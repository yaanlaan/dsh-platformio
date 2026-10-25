import { spawn, execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync, promises as fs } from 'node:fs';
import { join, resolve, basename, dirname } from 'node:path';
import { homedir, platform } from 'node:os';

const isWin = platform() === 'win32';

export class PythonScanner {
  constructor(options = {}) {
    this.workspaceRoot = options.workspaceRoot || process.cwd();
    this.configPath = join(homedir(), '.dsh', 'dsh-pio-config.json');
    this.cachedInterpreters = [];
    this.activePythonPath = '';
    this.loadConfig();
  }

  setWorkspace(dir) {
    if (dir && existsSync(dir)) {
      this.workspaceRoot = dir;
    }
  }

  loadConfig() {
    try {
      if (existsSync(this.configPath)) {
        const raw = readFileSync(this.configPath, 'utf8');
        const data = JSON.parse(raw);
        if (data.activePythonPath && existsSync(data.activePythonPath)) {
          this.activePythonPath = resolve(data.activePythonPath);
        }
        this.customPaths = Array.isArray(data.customPaths) ? data.customPaths.filter(p => existsSync(p)) : [];
      } else {
        this.customPaths = [];
      }
    } catch (e) {
      this.customPaths = [];
    }
  }

  saveConfig() {
    try {
      const dir = dirname(this.configPath);
      if (!existsSync(dir)) {
        fs.mkdir(dir, { recursive: true }).catch(() => {});
      }
      const data = {
        activePythonPath: this.activePythonPath,
        customPaths: this.customPaths || [],
        updatedAt: new Date().toISOString()
      };
      writeFileSync(this.configPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {}
  }

  /**
   * Run a lightweight inspector on a python executable
   */
  async inspectPython(pyPath) {
    return new Promise((res) => {
      if (!pyPath || !existsSync(pyPath)) {
        return res(null);
      }

      const script = [
        'import sys, json',
        'res = {"version": sys.version.split()[0], "arch": "64bit" if sys.maxsize > 2**32 else "32bit"}',
        'try:',
        '    import platformio',
        '    res["platformio"] = getattr(platformio, "__version__", "installed")',
        'except Exception:',
        '    res["platformio"] = None',
        'try:',
        '    import serial',
        '    res["pyserial"] = getattr(serial, "__version__", "installed")',
        'except Exception:',
        '    res["pyserial"] = None',
        'print("__PIO_PY_INFO__" + json.dumps(res))'
      ].join('\n');

      const child = spawn(pyPath, ['-c', script], {
        timeout: 5000,
        windowsHide: true
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', chunk => { stdout += chunk.toString(); });
      child.stderr.on('data', chunk => { stderr += chunk.toString(); });

      child.on('close', (code) => {
        const match = stdout.match(/__PIO_PY_INFO__(\{.*\})/);
        if (match) {
          try {
            const data = JSON.parse(match[1]);
            return res(data);
          } catch (e) {}
        }
        res(null);
      });

      child.on('error', () => res(null));
    });
  }

  /**
   * Collect all candidate Python interpreter paths on the system
   */
  async findCandidates() {
    const candidatePaths = new Set();
    const addIfValid = (p) => {
      if (!p) return;
      try {
        const resolved = resolve(p);
        if (existsSync(resolved)) {
          // On Windows, ignore WindowsApps stub
          if (isWin && resolved.toLowerCase().includes('windowsapps')) return;
          candidatePaths.add(resolved);
        }
      } catch (e) {}
    };

    // 1. Saved active & custom paths
    if (this.activePythonPath) addIfValid(this.activePythonPath);
    if (this.customPaths) {
      for (const cp of this.customPaths) addIfValid(cp);
    }

    // 2. Conda environments
    try {
      const condaOut = execSync('conda env list --json', { encoding: 'utf8', timeout: 3500 });
      const condaData = JSON.parse(condaOut);
      if (Array.isArray(condaData.envs)) {
        for (const envDir of condaData.envs) {
          const py = isWin ? join(envDir, 'python.exe') : join(envDir, 'bin', 'python');
          addIfValid(py);
        }
      }
    } catch (e) {}

    // 2.1 Common Conda filesystem roots
    const home = homedir();
    const commonCondaDirs = [
      join(home, 'miniconda3'),
      join(home, 'anaconda3'),
      join(home, 'miniforge3'),
      'C:\\ProgramData\\miniconda3',
      'C:\\ProgramData\\anaconda3',
      'C:\\tools\\miniconda3'
    ];

    for (const root of commonCondaDirs) {
      if (existsSync(root)) {
        addIfValid(isWin ? join(root, 'python.exe') : join(root, 'bin', 'python'));
        const envsDir = join(root, 'envs');
        if (existsSync(envsDir)) {
          try {
            const list = readdirSync(envsDir, { withFileTypes: true });
            for (const d of list) {
              if (d.isDirectory()) {
                addIfValid(isWin ? join(envsDir, d.name, 'python.exe') : join(envsDir, d.name, 'bin', 'python'));
              }
            }
          } catch (e) {}
        }
      }
    }

    // 2.2 ~/.conda/environments.txt
    try {
      const condaTxt = join(home, '.conda', 'environments.txt');
      if (existsSync(condaTxt)) {
        const lines = readFileSync(condaTxt, 'utf8').split(/\r?\n/).filter(Boolean);
        for (const line of lines) {
          addIfValid(isWin ? join(line, 'python.exe') : join(line, 'bin', 'python'));
        }
      }
    } catch (e) {}

    // 3. Current Workspace Virtualenvs (.venv, venv, env)
    if (this.workspaceRoot && existsSync(this.workspaceRoot)) {
      const venvNames = ['.venv', 'venv', 'env', '.env'];
      for (const vn of venvNames) {
        const vDir = join(this.workspaceRoot, vn);
        if (existsSync(vDir)) {
          addIfValid(isWin ? join(vDir, 'Scripts', 'python.exe') : join(vDir, 'bin', 'python'));
          addIfValid(isWin ? join(vDir, 'python.exe') : join(vDir, 'bin', 'python'));
        }
      }
    }

    // 4. PlatformIO Default Penv (~/.platformio/penv)
    const pioPenv = isWin
      ? join(home, '.platformio', 'penv', 'Scripts', 'python.exe')
      : join(home, '.platformio', 'penv', 'bin', 'python');
    addIfValid(pioPenv);

    const pioPy3 = isWin
      ? join(home, '.platformio', 'python3', 'python.exe')
      : join(home, '.platformio', 'python3', 'bin', 'python');
    addIfValid(pioPy3);

    // 5. DeepSeek Harness Bundled Runtime Python
    const dshRuntimesDir = join(home, '.dsh', 'dsh-runtimes');
    if (existsSync(dshRuntimesDir)) {
      try {
        const list = readdirSync(dshRuntimesDir, { withFileTypes: true });
        for (const d of list) {
          if (d.isDirectory()) {
            const dshPy = join(dshRuntimesDir, d.name, 'dependencies', 'python', 'python.exe');
            addIfValid(dshPy);
          }
        }
      } catch (e) {}
    }

    // 6. System PATH Python
    try {
      const cmd = isWin ? 'where python' : 'which -a python3 2>/dev/null || which -a python';
      const lines = execSync(cmd, { encoding: 'utf8', timeout: 3000 }).split(/\r?\n/).filter(Boolean);
      for (const line of lines) {
        addIfValid(line.trim());
      }
    } catch (e) {}

    return Array.from(candidatePaths);
  }

  /**
   * Scan and categorize all available Python interpreters
   */
  async scanAll(forceRefresh = false) {
    if (!forceRefresh && this.cachedInterpreters.length > 0) {
      return this.formatScanResult();
    }

    const candidatePaths = await this.findCandidates();
    const results = [];

    await Promise.all(
      candidatePaths.map(async (pyPath) => {
        try {
          const info = await this.inspectPython(pyPath);
          if (!info) return;

          // Categorize and name
          const lower = pyPath.toLowerCase();
          let category = 'system';
          let displayName = basename(dirname(pyPath));
          let tag = '系统环境';

          if (lower.includes('envs\\') || lower.includes('envs/')) {
            category = 'conda';
            // Extract conda env name
            const parts = pyPath.split(/[\\\/]/);
            const envIdx = parts.findIndex(p => p.toLowerCase() === 'envs');
            if (envIdx !== -1 && parts[envIdx + 1]) {
              displayName = parts[envIdx + 1];
            }
            tag = 'Conda';
          } else if (lower.includes('miniconda3') || lower.includes('anaconda3')) {
            category = 'conda';
            displayName = 'base';
            tag = 'Conda (base)';
          } else if (lower.includes('.platformio')) {
            category = 'platformio';
            displayName = 'PlatformIO 专用环境';
            tag = 'PlatformIO Penv';
          } else if (lower.includes('.dsh') && lower.includes('dsh-runtimes')) {
            category = 'dsh';
            displayName = 'DeepSeek Harness 内置环境';
            tag = 'DSH 运行时';
          } else if (lower.includes('.venv') || lower.includes('venv') || lower.includes('\\env\\')) {
            category = 'venv';
            displayName = '项目虚拟环境 (' + basename(dirname(dirname(pyPath))) + ')';
            tag = 'Virtualenv';
          }

          const isCurrentActive = this.activePythonPath
            ? this.activePythonPath.toLowerCase() === pyPath.toLowerCase()
            : false;

          results.push({
            path: pyPath,
            name: displayName,
            tag,
            category,
            version: info.version || '未知版本',
            arch: info.arch || '64bit',
            platformio: info.platformio || null,
            pyserial: info.pyserial || null,
            isReady: Boolean(info.platformio && info.pyserial),
            isActive: isCurrentActive
          });
        } catch (e) {}
      })
    );

    // Auto-select best active python if none selected or current is invalid
    if (!this.activePythonPath || !results.some(r => r.path.toLowerCase() === this.activePythonPath.toLowerCase())) {
      // 1. Prefer an environment named 'pio' that is ready
      const pioEnv = results.find(r => r.name.toLowerCase() === 'pio' && r.isReady);
      if (pioEnv) {
        this.activePythonPath = pioEnv.path;
      } else {
        // 2. Or any ready environment
        const readyEnv = results.find(r => r.isReady);
        if (readyEnv) {
          this.activePythonPath = readyEnv.path;
        } else if (results.length > 0) {
          this.activePythonPath = results[0].path;
        }
      }
      this.saveConfig();
    }

    // Update isActive flag
    for (const r of results) {
      r.isActive = (r.path.toLowerCase() === this.activePythonPath.toLowerCase());
    }

    // Sort:
    // 1. Active first
    // 2. isReady first
    // 3. Conda 'pio' first
    // 4. Alphabetical
    results.sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      if (a.isReady && !b.isReady) return -1;
      if (!a.isReady && b.isReady) return 1;
      if (a.name === 'pio' && b.name !== 'pio') return -1;
      if (a.name !== 'pio' && b.name === 'pio') return 1;
      return a.name.localeCompare(b.name);
    });

    this.cachedInterpreters = results;
    return this.formatScanResult();
  }

  formatScanResult() {
    const active = this.cachedInterpreters.find(r => r.isActive) ||
      (this.cachedInterpreters.length > 0 ? this.cachedInterpreters[0] : null);

    return {
      success: true,
      active,
      activePath: active ? active.path : '',
      interpreters: this.cachedInterpreters,
      total: this.cachedInterpreters.length,
      readyCount: this.cachedInterpreters.filter(r => r.isReady).length
    };
  }

  /**
   * Set active Python interpreter
   */
  async setActive(pyPath) {
    if (!pyPath || !existsSync(pyPath)) {
      return { success: false, error: '指定 Python 路径不存在: ' + pyPath };
    }

    const resolved = resolve(pyPath);
    this.activePythonPath = resolved;

    // Check if in custom list, if not add
    if (!this.cachedInterpreters.some(r => r.path.toLowerCase() === resolved.toLowerCase())) {
      if (!this.customPaths.includes(resolved)) {
        this.customPaths.push(resolved);
      }
    }

    this.saveConfig();
    // Rescan to update metadata
    return await this.scanAll(true);
  }

  /**
   * Add a custom interpreter path
   */
  async addCustomPath(pyPath) {
    if (!pyPath || !existsSync(pyPath)) {
      return { success: false, error: '指定 Python 文件不存在' };
    }
    const resolved = resolve(pyPath);
    if (!this.customPaths.includes(resolved)) {
      this.customPaths.push(resolved);
    }
    return await this.setActive(resolved);
  }

  /**
   * Install PlatformIO & pyserial into the specified Python environment
   */
  installPlatformIO(pyPath, onLog) {
    return new Promise((res) => {
      const targetPy = pyPath || this.activePythonPath;
      if (!targetPy || !existsSync(targetPy)) {
        return res({ success: false, error: '无效的 Python 路径' });
      }

      onLog?.(`[INSTALL] 正在准备在环境 ${targetPy} 中安装 PlatformIO 和 pyserial...\n`, 'info');
      onLog?.(`[INSTALL] 执行: ${targetPy} -m pip install -U platformio pyserial -i https://mirrors.aliyun.com/pypi/simple/\n`, 'info');

      const args = [
        '-m', 'pip', 'install', '-U',
        'platformio', 'pyserial',
        '-i', 'https://mirrors.aliyun.com/pypi/simple/',
        '--trusted-host', 'mirrors.aliyun.com'
      ];

      const child = spawn(targetPy, args, {
        windowsHide: true,
        env: { ...process.env, PYTHONUNBUFFERED: '1' }
      });

      child.stdout.on('data', chunk => {
        onLog?.(chunk.toString(), 'stdout');
      });

      child.stderr.on('data', chunk => {
        onLog?.(chunk.toString(), 'stderr');
      });

      child.on('close', async (code) => {
        if (code === 0) {
          onLog?.('\n[INSTALL_SUCCESS] PlatformIO 与 pyserial 安装成功！正在重新自检环境...\n', 'success');
          await this.scanAll(true);
          res({ success: true });
        } else {
          onLog?.(`\n[INSTALL_FAILED] 安装退出，代码: ${code}\n`, 'error');
          res({ success: false, code });
        }
      });

      child.on('error', (err) => {
        onLog?.(`[INSTALL_ERROR] ${err.message}\n`, 'error');
        res({ success: false, error: err.message });
      });
    });
  }
}
