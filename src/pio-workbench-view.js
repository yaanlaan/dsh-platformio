/**
 * DeepSeek Harness PlatformIO IDE Plugin - Unified Workbench View
 * Suitable for DSH Native Bottom Panel and Sidebar
 * Zero Emojis - Professional VSCode/PlatformIO Experience
 * Supports Real-time Device Hotplug Detection, Dual Port Settings, Visual Config & Autocomplete
 */

function normalizeDevice(d) {
  const desc = (d.description || '').toLowerCase();
  const hwid = (d.hwid || '').toLowerCase();
  const isUsb = d.isUsb !== undefined ? Boolean(d.isUsb) : Boolean(d.vid || hwid.includes('usb') || desc.includes('cp210') || desc.includes('ch34') || desc.includes('uart') || desc.includes('ftdi') || desc.includes('silicon'));
  const isBt = d.isBt !== undefined ? Boolean(d.isBt) : (desc.includes('蓝牙') || desc.includes('bluetooth') || hwid.includes('bthenum'));
  const isAcpi = d.isAcpi !== undefined ? Boolean(d.isAcpi) : (hwid.includes('acpi') || desc.includes('通信端口'));
  let chip = d.chip || 'Serial';
  if (chip === 'Serial') {
    if (desc.includes('cp210') || hwid.includes('10c4:ea60')) chip = 'CP210x';
    else if (desc.includes('ch34') || hwid.includes('1a86:7523')) chip = 'CH340';
    else if (desc.includes('ftdi')) chip = 'FTDI';
    else if (desc.includes('jtag') || desc.includes('esp32')) chip = 'ESP32 CDC';
  }
  return {
    ...d,
    isUsb,
    isBt,
    isAcpi,
    chip,
    label: `${d.port} (${d.description || '设备'})${isUsb ? ' [USB]' : ''}`
  };
}

export function createPioWorkbenchComponent(React, Icons) {
  const h = React.createElement;
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  // ==========================================
  // Helper: Board Autocomplete Input with Live Search Recommendations
  // ==========================================
  function BoardAutocomplete({ value, onChange, onSelect, placeholder, style }) {
    const [query, setQuery] = useState(value || '');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const wrapRef = useRef(null);

    useEffect(() => {
      if (!isFocused) {
        setQuery(value || '');
      }
    }, [value, isFocused]);

    useEffect(() => {
      if (!isOpen) return;
      let active = true;
      setIsLoading(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/pio/boards?q=${encodeURIComponent(query || '')}`);
          if (res.ok && active) {
            const data = await res.json();
            if (data.boards) setResults(data.boards);
          }
        } catch (e) {
        } finally {
          if (active) setIsLoading(false);
        }
      }, 150);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }, [query, isOpen]);

    useEffect(() => {
      function handleClickOutside(e) {
        if (wrapRef.current && !wrapRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return h('div', { className: 'dsh-pio-autocomplete-wrap', ref: wrapRef, style },
      h('div', { style: { position: 'relative', display: 'flex', alignItems: 'center' } },
        h('input', {
          type: 'text',
          className: 'dsh-pio-input',
          style: { width: '100%', paddingLeft: '26px' },
          placeholder: placeholder || '搜索开发板型号...',
          value: query,
          onChange: (e) => {
            const val = e.target.value;
            setQuery(val);
            if (onChange) onChange(val);
            setIsOpen(true);
          },
          onFocus: () => {
            setIsFocused(true);
            setIsOpen(true);
          },
          onBlur: () => {
            setIsFocused(false);
          }
        }),
        h('div', { style: { position: 'absolute', left: '8px', color: 'var(--dsw-alias-label-tertiary, #777)', pointerEvents: 'none' } },
          h(Icons.Search, { size: 12 })
        ),
        query ? h('button', {
          style: { position: 'absolute', right: '6px', background: 'none', border: 'none', color: 'var(--dsw-alias-label-tertiary, #777)', cursor: 'pointer', padding: '2px' },
          onClick: () => {
            setQuery('');
            if (onChange) onChange('');
            setIsOpen(true);
          }
        }, h(Icons.Close, { size: 10 })) : null
      ),
      isOpen ? h('div', { className: 'dsh-pio-autocomplete-dropdown' },
        isLoading ? h('div', { style: { padding: '8px 12px', fontSize: '11px', color: 'var(--dsw-alias-label-secondary, #888)' } }, '搜索中...') : null,
        results.length === 0 && !isLoading ? h('div', { style: { padding: '8px 12px', fontSize: '11px', color: 'var(--dsw-alias-label-secondary, #888)' } }, '无匹配型号，回车直接使用') : null,
        results.map(b => h('div', {
          key: b.id,
          className: 'dsh-pio-autocomplete-item',
          onClick: () => {
            setQuery(b.id);
            if (onChange) onChange(b.id);
            if (onSelect) onSelect(b);
            setIsOpen(false);
          }
        },
          h('div', { style: { flex: 1, minWidth: 0 } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
              h('span', { className: 'dsh-pio-autocomplete-title' }, b.name || b.id),
              h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-brand-primary, #4ec9b0)', fontFamily: 'monospace' } }, b.id),
              b.vendor ? h('span', { className: 'dsh-pio-autocomplete-badge' }, b.vendor) : null
            ),
            h('div', { className: 'dsh-pio-autocomplete-desc' },
              `${b.platform || ''} | ${b.mcu || ''} ${b.fcpu || b.f_cpu ? '@ ' + (b.fcpu || b.f_cpu) : ''} | Flash: ${b.rom || b.flash || '4MB'}, RAM: ${b.ram || '320KB'}`
            )
          ),
          h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' } },
            h('span', { className: 'dsh-pio-autocomplete-badge' }, b.frameworks?.join(', ') || 'arduino'),
            h('button', {
              className: 'dsh-pio-btn',
              style: { height: '20px', padding: '0 6px', fontSize: '10px' },
              onClick: (e) => {
                e.stopPropagation();
                setQuery(b.id);
                if (onChange) onChange(b.id);
                if (onSelect) onSelect(b);
                setIsOpen(false);
              }
            }, '选用')
          )
        ))
      ) : null
    );
  }

  // ==========================================
  // Helper: Library Autocomplete Input with Live Search Recommendations
  // ==========================================
  function LibAutocomplete({ onAddLib, placeholder, style }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapRef = useRef(null);

    useEffect(() => {
      if (!isOpen) return;
      let active = true;
      setIsLoading(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/pio/libs/search?q=${encodeURIComponent(query || '')}`);
          if (res.ok && active) {
            const data = await res.json();
            if (data.libs) setResults(data.libs);
          }
        } catch (e) {
        } finally {
          if (active) setIsLoading(false);
        }
      }, 150);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }, [query, isOpen]);

    useEffect(() => {
      function handleClickOutside(e) {
        if (wrapRef.current && !wrapRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return h('div', { className: 'dsh-pio-autocomplete-wrap', ref: wrapRef, style },
      h('div', { style: { position: 'relative', display: 'flex', alignItems: 'center' } },
        h('input', {
          type: 'text',
          className: 'dsh-pio-input',
          style: { width: '100%', paddingLeft: '26px' },
          placeholder: placeholder || '搜索库依赖...',
          value: query,
          onChange: (e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          },
          onFocus: () => setIsOpen(true),
          onKeyDown: (e) => {
            if (e.key === 'Enter' && query.trim()) {
              onAddLib(query.trim());
              setQuery('');
              setIsOpen(false);
            }
          }
        }),
        h('div', { style: { position: 'absolute', left: '8px', color: 'var(--dsw-alias-label-tertiary, #777)', pointerEvents: 'none' } },
          h(Icons.Search, { size: 12 })
        ),
        query ? h('button', {
          style: { position: 'absolute', right: '6px', background: 'none', border: 'none', color: 'var(--dsw-alias-label-tertiary, #777)', cursor: 'pointer', padding: '2px' },
          onClick: () => { setQuery(''); setIsOpen(true); }
        }, h(Icons.Close, { size: 10 })) : null
      ),
      isOpen ? h('div', { className: 'dsh-pio-autocomplete-dropdown' },
        isLoading ? h('div', { style: { padding: '8px 12px', fontSize: '11px', color: 'var(--dsw-alias-label-secondary, #888)' } }, '搜索中...') : null,
        results.length === 0 && !isLoading ? h('div', { style: { padding: '8px 12px', fontSize: '11px', color: 'var(--dsw-alias-label-secondary, #888)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          h('span', null, `回车添加 "${query}"`),
          query.trim() ? h('button', {
            className: 'dsh-pio-btn dsh-pio-btn-primary',
            style: { height: '20px', padding: '0 8px', fontSize: '10px' },
            onClick: () => {
              onAddLib(query.trim());
              setQuery('');
              setIsOpen(false);
            }
          }, '添加') : null
        ) : null,
        results.map(lib => h('div', {
          key: lib.name,
          className: 'dsh-pio-autocomplete-item',
          onClick: () => {
            onAddLib(lib.name);
            setQuery('');
            setIsOpen(false);
          }
        },
          h('div', { style: { flex: 1, minWidth: 0 } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
              h('span', { className: 'dsh-pio-autocomplete-title' }, lib.name),
              lib.version ? h('span', { style: { fontSize: '10px', color: 'var(--dsw-alias-brand-primary, #4ec9b0)', fontFamily: 'monospace' } }, lib.version) : null,
              lib.category ? h('span', { className: 'dsh-pio-autocomplete-badge' }, lib.category) : null
            ),
            h('div', { className: 'dsh-pio-autocomplete-desc' },
              lib.description || `作者: ${lib.author || 'PlatformIO'}`
            )
          ),
          h('button', {
            className: 'dsh-pio-btn dsh-pio-btn-primary',
            style: { height: '22px', padding: '0 8px', fontSize: '11px', whiteSpace: 'nowrap' },
            onClick: (e) => {
              e.stopPropagation();
              onAddLib(lib.name);
              setQuery('');
              setIsOpen(false);
            }
          }, h(Icons.Plus, { size: 10 }), '添加')
        ))
      ) : null
    );
  }

  return function PioWorkbenchView(props) {
    const [subTab, setSubTab] = useState('build'); // 'build', 'serial', 'devices', 'config'
    const [projectInfo, setProjectInfo] = useState(null);
    const [devices, setDevices] = useState([]);

    // Independent Port Settings: Upload Port vs Serial Monitor Port
    const [uploadPort, setUploadPort] = useState('auto'); // 'auto' or specific 'COM6'
    const [monitorPort, setMonitorPort] = useState('follow'); // 'follow' (follows uploadPort) or specific 'COM6'
    const [monitorBaud, setMonitorBaud] = useState(115200);

    const [serialStatus, setSerialStatus] = useState({ connected: false });
    const [serialLogs, setSerialLogs] = useState([]);
    const [serialInput, setSerialInput] = useState('');
    const [serialEnding, setSerialEnding] = useState('\r\n');
    const [autoScrollSerial, setAutoScrollSerial] = useState(true);
    const [showTimestamps, setShowTimestamps] = useState(false);
    const [hexMode, setHexMode] = useState(false);

    const [activeTask, setActiveTask] = useState(null);
    const [taskLogs, setTaskLogs] = useState([]);
    const [autoScrollTask, setAutoScrollTask] = useState(true);
    const [hotplugNotice, setHotplugNotice] = useState(null);

    // Python Interpreter Management State (VSCode-like)
    const [interpreters, setInterpreters] = useState([]);
    const [activePython, setActivePython] = useState(null);
    const [isPySelectorOpen, setIsPySelectorOpen] = useState(false);
    const [isScanningPy, setIsScanningPy] = useState(false);
    const [pyFilter, setPyFilter] = useState('');
    const [showAddCustomPy, setShowAddCustomPy] = useState(false);
    const [customPyInput, setCustomPyInput] = useState('');

    // Project & Workspace Management State
    const [projectList, setProjectList] = useState([]);
    const [isSwitchingWorkspace, setIsSwitchingWorkspace] = useState(false);
    const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
    const [newProjectForm, setNewProjectForm] = useState({
      name: 'esp32-project',
      board: 'esp32doit-devkit-v1',
      framework: 'arduino',
      dir: 'C:\\Users\\yaan\\Documents\\deepseek'
    });
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [isAddEnvOpen, setIsAddEnvOpen] = useState(false);
    const [newEnvForm, setNewEnvForm] = useState({
      name: 'esp32-s3',
      board: 'esp32-s3-devkitc-1',
      framework: 'arduino',
      platform: 'espressif32'
    });

    // Configuration View Mode & Active Environment
    const [configViewMode, setConfigViewMode] = useState('visual'); // 'visual' or 'raw'
    const [selectedEnvName, setSelectedEnvName] = useState('');
    const [rawIniEdit, setRawIniEdit] = useState('');
    const [isSavingConfig, setIsSavingConfig] = useState(false);
    const [configFeedback, setConfigFeedback] = useState(null);

    // Form fields for active env
    const [formBoard, setFormBoard] = useState('');
    const [formFramework, setFormFramework] = useState('arduino');
    const [formPlatform, setFormPlatform] = useState('');
    const [formMonitorSpeed, setFormMonitorSpeed] = useState('115200');
    const [formUploadSpeed, setFormUploadSpeed] = useState('921600');
    const [formMonitorFilters, setFormMonitorFilters] = useState([]);
    const [formBuildFlags, setFormBuildFlags] = useState('');
    const [formLibDeps, setFormLibDeps] = useState([]);

    const serialScreenRef = useRef(null);
    const taskScreenRef = useRef(null);
    const lastSerialIdRef = useRef(0);
    const lastTaskIdRef = useRef(0);

    // Append Task Log Entries with deduplication
    const appendTaskEntries = useCallback((entries) => {
      if (!entries || entries.length === 0) return;
      setTaskLogs(prev => {
        const existingIds = new Set();
        for (let i = Math.max(0, prev.length - 200); i < prev.length; i++) {
          if (prev[i].id) existingIds.add(prev[i].id);
        }
        const toAdd = [];
        for (const entry of entries) {
          if (entry.id) {
            if (!existingIds.has(entry.id)) {
              existingIds.add(entry.id);
              toAdd.push(entry);
              if (entry.id > lastTaskIdRef.current) {
                lastTaskIdRef.current = entry.id;
              }
            }
          } else {
            toAdd.push(entry);
          }
        }
        if (toAdd.length === 0) return prev;
        const next = prev.concat(toAdd);
        return next.length > 3000 ? next.slice(-2500) : next;
      });
    }, []);

    // Append Serial Log Entries with deduplication
    const appendSerialEntries = useCallback((entries) => {
      if (!entries || entries.length === 0) return;
      setSerialLogs(prev => {
        const existingIds = new Set();
        for (let i = Math.max(0, prev.length - 300); i < prev.length; i++) {
          if (prev[i].id) existingIds.add(prev[i].id);
        }
        const toAdd = [];
        for (const entry of entries) {
          if (entry.id) {
            if (!existingIds.has(entry.id)) {
              existingIds.add(entry.id);
              toAdd.push(entry);
              if (entry.id > lastSerialIdRef.current) {
                lastSerialIdRef.current = entry.id;
              }
            }
          } else {
            toAdd.push(entry);
          }
        }
        if (toAdd.length === 0) return prev;
        const next = prev.concat(toAdd);
        return next.length > 2500 ? next.slice(-2000) : next;
      });
    }, []);

    // Calculate effective ports
    const primaryUsbPort = useMemo(() => {
      const usbDev = devices.find(d => d.isUsb);
      return usbDev ? usbDev.port : (devices.length > 0 ? devices[0].port : '');
    }, [devices]);

    const effectiveUploadPort = useMemo(() => {
      if (uploadPort && uploadPort !== 'auto') return uploadPort;
      return primaryUsbPort;
    }, [uploadPort, primaryUsbPort]);

    const effectiveMonitorPort = useMemo(() => {
      if (monitorPort && monitorPort !== 'follow') return monitorPort;
      return effectiveUploadPort || primaryUsbPort;
    }, [monitorPort, effectiveUploadPort, primaryUsbPort]);

    // Handle updating device list with smart selection
    const handleDevicesUpdate = useCallback((rawDevices) => {
      if (!Array.isArray(rawDevices)) return;
      const newDevices = rawDevices.map(normalizeDevice);
      newDevices.sort((a, b) => {
        if (a.isUsb && !b.isUsb) return -1;
        if (!a.isUsb && b.isUsb) return 1;
        return a.port.localeCompare(b.port, undefined, { numeric: true });
      });

      setDevices(prevDevices => {
        const oldSig = prevDevices.map(d => `${d.port}:${d.hwid || ''}`).join('|');
        const newSig = newDevices.map(d => `${d.port}:${d.hwid || ''}`).join('|');
        if (oldSig !== newSig && prevDevices.length > 0) {
          const added = newDevices.filter(nd => !prevDevices.some(pd => pd.port === nd.port));
          if (added.length > 0) {
            setHotplugNotice(`已检测到新串口插入: ${added.map(a => `${a.port} (${a.chip || 'USB'})`).join(', ')}`);
            setTimeout(() => setHotplugNotice(null), 4000);
          }
        }
        return newDevices;
      });

      const usbDevice = newDevices.find(d => d.isUsb);
      if (usbDevice) {
        setUploadPort(curr => {
          if (!curr || curr === 'auto' || curr === 'COM1' || !newDevices.some(d => d.port === curr)) {
            return usbDevice.port;
          }
          return curr;
        });
      } else if (newDevices.length > 0) {
        setUploadPort(curr => {
          if (!curr || curr === 'auto' || !newDevices.some(d => d.port === curr)) {
            return newDevices[0].port;
          }
          return curr;
        });
      }
    }, []);

    // Fetch Project Info & Initial State
    const refreshInfo = useCallback(async () => {
      try {
        const res = await fetch('/api/pio/info');
        if (res.ok) {
          const data = await res.json();
          if (data.project) setProjectInfo(data.project);
          if (data.serialStatus) setSerialStatus(data.serialStatus);
          if (data.activeTask) setActiveTask(data.activeTask);
        }
      } catch (e) {
        console.warn('[dsh-pio] fetch info error:', e);
      }
    }, []);

    // Fetch Projects list
    const refreshProjects = useCallback(async () => {
      try {
        const res = await fetch('/api/pio/projects');
        if (res.ok) {
          const data = await res.json();
          if (data.projects) setProjectList(data.projects);
        }
      } catch (e) {}
    }, []);

    // Fetch Devices manually or fallback
    const refreshDevices = useCallback(async (force = false) => {
      try {
        const url = force ? '/api/pio/devices?force=1' : '/api/pio/devices';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.devices) {
            handleDevicesUpdate(data.devices);
          }
        }
      } catch (e) {
        console.warn('[dsh-pio] fetch devices error:', e);
      }
    }, [handleDevicesUpdate]);

    // Fetch Python Interpreters
    const refreshInterpreters = useCallback(async (force = false) => {
      setIsScanningPy(true);
      try {
        const url = force ? '/api/pio/python/interpreters?refresh=1' : '/api/pio/python/interpreters';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.interpreters) setInterpreters(data.interpreters);
          if (data.active) setActivePython(data.active);
        }
      } catch (e) {
      } finally {
        setIsScanningPy(false);
      }
    }, []);

    const handleSelectPy = useCallback(async (pyPath) => {
      try {
        const res = await fetch('/api/pio/python/select', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: pyPath })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.active) setActivePython(data.active);
          if (data.interpreters) setInterpreters(data.interpreters);
          setIsPySelectorOpen(false);
          appendTaskEntries([{
            id: (lastTaskIdRef.current || 0) + 1,
            text: `\n>>> [Python环境切换] 已切换当前 PlatformIO 运行环境为: ${pyPath}\n`,
            stream: 'system'
          }]);
        }
      } catch (e) {}
    }, [appendTaskEntries]);

    const handleAddCustomPy = useCallback(async () => {
      if (!customPyInput.trim()) return;
      try {
        const res = await fetch('/api/pio/python/add-custom', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: customPyInput.trim() })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.active) setActivePython(data.active);
          if (data.interpreters) setInterpreters(data.interpreters);
          setCustomPyInput('');
          setShowAddCustomPy(false);
          setIsPySelectorOpen(false);
        }
      } catch (e) {}
    }, [customPyInput]);

    const handleInstallPio = useCallback(async (pyPath) => {
      try {
        setSubTab('build');
        setIsPySelectorOpen(false);
        appendTaskEntries([{
          id: (lastTaskIdRef.current || 0) + 1,
          text: `\n>>> 正在准备在环境 ${pyPath} 中安装 PlatformIO 与 pyserial...\n`,
          stream: 'system'
        }]);
        await fetch('/api/pio/python/install-pio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: pyPath })
        });
        setTimeout(() => refreshInterpreters(true), 2000);
      } catch (e) {}
    }, [appendTaskEntries, refreshInterpreters]);

    // Switch Active Workspace
    const handleSwitchWorkspace = useCallback(async (workspaceDir) => {
      if (!workspaceDir) return;
      setIsSwitchingWorkspace(true);
      try {
        const res = await fetch('/api/pio/workspace', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workspace: workspaceDir })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.project) setProjectInfo(data.project);
          refreshProjects();
          appendTaskEntries([{
            id: (lastTaskIdRef.current || 0) + 1,
            text: `\n>>> 已切换工程工作区至: ${workspaceDir}\n`,
            stream: 'system'
          }]);
        }
      } catch (e) {
      } finally {
        setIsSwitchingWorkspace(false);
      }
    }, [refreshProjects, appendTaskEntries]);

    // Create New Project Wizard
    const handleCreateProject = useCallback(async () => {
      if (!newProjectForm.name || !newProjectForm.board) return;
      setIsCreatingProject(true);
      try {
        const res = await fetch('/api/pio/project/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProjectForm)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setIsNewProjectOpen(false);
          if (data.project) setProjectInfo(data.project);
          await refreshProjects();
          appendTaskEntries([{
            id: (lastTaskIdRef.current || 0) + 1,
            text: `\n>>> 新建工程 [${newProjectForm.name}] (${newProjectForm.board}) 初始化完成！已切换至当前工作区。\n路径: ${data.dir || ''}\n`,
            stream: 'success'
          }]);
          setSubTab('config');
        } else {
          alert('创建工程失败: ' + (data.error || '未知错误'));
        }
      } catch (e) {
        alert('创建工程网络错误: ' + e.message);
      } finally {
        setIsCreatingProject(false);
      }
    }, [newProjectForm, refreshProjects, appendTaskEntries]);

    // Add Environment
    const handleAddEnv = useCallback(async () => {
      if (!newEnvForm.name || !newEnvForm.board) return;
      try {
        const res = await fetch('/api/pio/env/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            envName: newEnvForm.name,
            board: newEnvForm.board,
            framework: newEnvForm.framework,
            platform: newEnvForm.platform,
            dir: projectInfo?.dir
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setIsAddEnvOpen(false);
          if (data.project) setProjectInfo(data.project);
          setSelectedEnvName(newEnvForm.name);
          setConfigFeedback({ success: true, text: `成功添加环境 [${newEnvForm.name}]` });
          setTimeout(() => setConfigFeedback(null), 3000);
        } else {
          alert('添加环境失败: ' + (data.error || '未知错误'));
        }
      } catch (e) {
        alert('添加环境网络错误: ' + e.message);
      }
    }, [newEnvForm, projectInfo]);

    // Save Visual Config to platformio.ini
    const handleSaveEnvConfig = useCallback(async () => {
      if (!selectedEnvName) return;
      setIsSavingConfig(true);
      try {
        const res = await fetch('/api/pio/ini/update-env', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            env: selectedEnvName,
            dir: projectInfo?.dir,
            updates: {
              board: formBoard,
              framework: formFramework,
              platform: formPlatform,
              monitor_speed: formMonitorSpeed,
              upload_speed: formUploadSpeed,
              monitor_filters: formMonitorFilters.join(', '),
              build_flags: formBuildFlags,
              lib_deps: formLibDeps.join('\n')
            }
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.project) setProjectInfo(data.project);
          setConfigFeedback({ success: true, text: '配置已成功更新至 platformio.ini' });
          setTimeout(() => setConfigFeedback(null), 3000);
        } else {
          setConfigFeedback({ success: false, text: '保存失败: ' + (data.error || '未知错误') });
        }
      } catch (e) {
        setConfigFeedback({ success: false, text: '保存网络错误: ' + e.message });
      } finally {
        setIsSavingConfig(false);
      }
    }, [selectedEnvName, projectInfo, formBoard, formFramework, formPlatform, formMonitorSpeed, formUploadSpeed, formMonitorFilters, formBuildFlags, formLibDeps]);

    // Save Raw INI text
    const handleSaveRawIni = useCallback(async () => {
      setIsSavingConfig(true);
      try {
        const res = await fetch('/api/pio/ini/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rawIni: rawIniEdit,
            dir: projectInfo?.dir
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.project) setProjectInfo(data.project);
          setConfigFeedback({ success: true, text: 'platformio.ini 原始文件已成功更新' });
          setTimeout(() => setConfigFeedback(null), 3000);
        } else {
          setConfigFeedback({ success: false, text: '保存失败: ' + (data.error || '未知错误') });
        }
      } catch (e) {
        setConfigFeedback({ success: false, text: '保存网络错误: ' + e.message });
      } finally {
        setIsSavingConfig(false);
      }
    }, [rawIniEdit, projectInfo]);

    // Add Library Dependency
    const handleAddLibDep = useCallback(async (libName) => {
      if (!libName || !selectedEnvName) return;
      try {
        const res = await fetch('/api/pio/libs/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lib: libName,
            env: selectedEnvName,
            dir: projectInfo?.dir
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.project) setProjectInfo(data.project);
          setFormLibDeps(prev => prev.includes(libName) ? prev : [...prev, libName]);
          setConfigFeedback({ success: true, text: `已添加库依赖 [${libName}]` });
          setTimeout(() => setConfigFeedback(null), 3000);
        }
      } catch (e) {}
    }, [selectedEnvName, projectInfo]);

    // Remove Library Dependency
    const handleRemoveLibDep = useCallback(async (libName) => {
      if (!libName || !selectedEnvName) return;
      try {
        const res = await fetch('/api/pio/libs/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lib: libName,
            env: selectedEnvName,
            dir: projectInfo?.dir
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.project) setProjectInfo(data.project);
          setFormLibDeps(prev => prev.filter(l => l !== libName));
          setConfigFeedback({ success: true, text: `已移除库依赖 [${libName}]` });
          setTimeout(() => setConfigFeedback(null), 3000);
        }
      } catch (e) {}
    }, [selectedEnvName, projectInfo]);

    // Sync Form Fields with Active Environment (only when env switches or project switches)
    const lastSyncedEnvKeyRef = useRef('');
    useEffect(() => {
      if (!projectInfo) return;
      setRawIniEdit(projectInfo.rawIni || '');

      const envs = projectInfo.environments || [];
      let envObj = envs.find(e => e.name === selectedEnvName);
      if (!envObj && envs.length > 0) {
        envObj = envs.find(e => e.name === projectInfo.env) || envs[0];
        setSelectedEnvName(envObj.name);
      }

      const syncKey = `${projectInfo.projectPath || projectInfo.dir || ''}::${envObj ? envObj.name : ''}`;
      if (lastSyncedEnvKeyRef.current !== syncKey) {
        lastSyncedEnvKeyRef.current = syncKey;
        if (envObj) {
          setFormBoard(envObj.board || '');
          setFormFramework(envObj.framework || 'arduino');
          setFormPlatform(envObj.platform || '');
          setFormMonitorSpeed(envObj.monitor_speed || '115200');
          setFormUploadSpeed(envObj.upload_speed || '921600');

          let filters = [];
          if (envObj.monitor_filters) {
            if (Array.isArray(envObj.monitor_filters)) {
              filters = envObj.monitor_filters.map(f => String(f).trim()).filter(Boolean);
            } else if (typeof envObj.monitor_filters === 'string') {
              filters = envObj.monitor_filters.split(/[, \t\r\n]+/).map(f => f.trim()).filter(Boolean);
            }
          }
          setFormMonitorFilters(filters);

          let bFlags = '';
          if (Array.isArray(envObj.build_flags)) {
            bFlags = envObj.build_flags.join(' ');
          } else if (typeof envObj.build_flags === 'string') {
            bFlags = envObj.build_flags;
          }
          setFormBuildFlags(bFlags || '');

          let lDeps = [];
          if (Array.isArray(envObj.lib_deps)) {
            lDeps = envObj.lib_deps.map(l => String(l).trim()).filter(Boolean);
          } else if (typeof envObj.lib_deps === 'string') {
            lDeps = envObj.lib_deps.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
          }
          setFormLibDeps(lDeps);
        }
      }
    }, [projectInfo, selectedEnvName]);

    const filteredInterpreters = useMemo(() => {
      if (!pyFilter.trim()) return interpreters;
      const q = pyFilter.trim().toLowerCase();
      return interpreters.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.path.toLowerCase().includes(q) ||
        i.tag.toLowerCase().includes(q) ||
        (i.version && i.version.toLowerCase().includes(q))
      );
    }, [interpreters, pyFilter]);

    const readyCount = useMemo(() => {
      return interpreters.filter(i => i.isReady).length;
    }, [interpreters]);

    useEffect(() => {
      refreshInfo();
      refreshDevices(true);
      refreshInterpreters(false);
      refreshProjects();

      const interval = setInterval(() => {
        refreshInfo();
        refreshDevices(false);
      }, 2500);
      return () => clearInterval(interval);
    }, [refreshInfo, refreshDevices, refreshInterpreters, refreshProjects]);

    // Setup SSE for Task Output & Device Hotplug Events
    useEffect(() => {
      let sse = null;
      try {
        sse = new EventSource('/api/pio/task-stream');
        sse.addEventListener('start', (e) => {
          try {
            const data = JSON.parse(e.data);
            setActiveTask(data);
            lastTaskIdRef.current = 0;
            setTaskLogs([{ id: 0, text: `>>> 启动任务: pio run ${data.task ? '-t ' + data.task : ''} ${data.port ? '--upload-port ' + data.port : ''}\n`, stream: 'system' }]);
            setSubTab('build');
          } catch (err) {}
        });

        sse.addEventListener('output', (e) => {
          try {
            const entry = JSON.parse(e.data);
            appendTaskEntries([entry]);
          } catch (err) {}
        });

        sse.addEventListener('finish', (e) => {
          try {
            const data = JSON.parse(e.data);
            setActiveTask(null);
            appendTaskEntries([
              {
                id: (lastTaskIdRef.current || 0) + 1,
                text: `\n>>> 任务结束，退出代码: ${data.code} (${data.success ? '成功' : '失败'})\n`,
                stream: data.success ? 'success' : 'stderr'
              }
            ]);
          } catch (err) {}
        });

        sse.addEventListener('stopped', () => {
          setActiveTask(null);
          appendTaskEntries([{ id: (lastTaskIdRef.current || 0) + 1, text: '\n>>> 任务已被用户终止\n', stream: 'warning' }]);
        });

        sse.addEventListener('devices', (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data.devices) {
              handleDevicesUpdate(data.devices);
            }
          } catch (err) {}
        });
      } catch (err) {}

      return () => {
        if (sse) sse.close();
      };
    }, [handleDevicesUpdate, appendTaskEntries]);

    // Resilient Task Sync: Polling fallback for Desktop Electron / custom schemes
    useEffect(() => {
      let isSubscribed = true;
      const pollTask = async () => {
        try {
          const since = lastTaskIdRef.current;
          const res = await fetch(`/api/pio/task-logs?since_id=${since}`);
          if (res.ok && isSubscribed) {
            const data = await res.json();
            if (data.activeTask !== undefined) {
              setActiveTask(data.activeTask);
            }
            if (data.logs && data.logs.length > 0) {
              appendTaskEntries(data.logs);
            }
          }
        } catch (e) {}
      };

      if (activeTask) {
        pollTask();
      }

      const timer = setInterval(pollTask, activeTask ? 300 : 2500);
      return () => {
        isSubscribed = false;
        clearInterval(timer);
      };
    }, [activeTask, appendTaskEntries]);

    // Setup SSE for Serial Stream
    useEffect(() => {
      let sse = null;
      try {
        sse = new EventSource('/api/pio/serial/stream');
        sse.addEventListener('status', (e) => {
          try {
            const st = JSON.parse(e.data);
            setSerialStatus(st);
          } catch (err) {}
        });

        sse.addEventListener('log', (e) => {
          try {
            const entry = JSON.parse(e.data);
            appendSerialEntries([entry]);
          } catch (err) {}
        });
      } catch (err) {}

      return () => {
        if (sse) sse.close();
      };
    }, [appendSerialEntries]);

    // Resilient Serial Sync: Polling fallback for Desktop Electron / custom schemes
    useEffect(() => {
      let isSubscribed = true;
      const pollSerial = async () => {
        try {
          const since = lastSerialIdRef.current;
          const res = await fetch(`/api/pio/serial/logs?since_id=${since}`);
          if (res.ok && isSubscribed) {
            const data = await res.json();
            if (data.status) {
              setSerialStatus(data.status);
            }
            if (data.logs && data.logs.length > 0) {
              appendSerialEntries(data.logs);
            }
          }
        } catch (e) {}
      };

      if (serialStatus.connected) {
        pollSerial();
      }

      const timer = setInterval(pollSerial, serialStatus.connected ? 200 : 3000);
      return () => {
        isSubscribed = false;
        clearInterval(timer);
      };
    }, [serialStatus.connected, appendSerialEntries]);

    // Auto-scroll screens
    useEffect(() => {
      if (autoScrollTask && taskScreenRef.current) {
        taskScreenRef.current.scrollTop = taskScreenRef.current.scrollHeight;
      }
    }, [taskLogs, autoScrollTask]);

    useEffect(() => {
      if (autoScrollSerial && serialScreenRef.current) {
        serialScreenRef.current.scrollTop = serialScreenRef.current.scrollHeight;
      }
    }, [serialLogs, autoScrollSerial]);

    // Run PlatformIO Task
    const runTask = async (taskName, extraArgs = []) => {
      try {
        setSubTab('build');
        const res = await fetch('/api/pio/task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task: taskName,
            env: selectedEnvName || projectInfo?.env,
            port: effectiveUploadPort,
            extraArgs,
            autoReconnectSerial: taskName === 'upload' && serialStatus.connected
          })
        });
        const data = await res.json();
        if (!res.ok) {
          appendTaskEntries([{
            id: (lastTaskIdRef.current || 0) + 1,
            text: `[错误] 启动任务失败: ${data.error || '未知错误'}\n`,
            stream: 'stderr'
          }]);
        }
      } catch (e) {
        appendTaskEntries([{
          id: (lastTaskIdRef.current || 0) + 1,
          text: `[网络异常] 发送任务请求失败: ${e.message}\n`,
          stream: 'stderr'
        }]);
      }
    };

    const stopTask = async () => {
      try {
        await fetch('/api/pio/stop-task', { method: 'POST' });
      } catch (e) {}
    };

    const toggleSerial = async () => {
      if (serialStatus.connected) {
        await fetch('/api/pio/serial/disconnect', { method: 'POST' });
      } else {
        const port = effectiveMonitorPort;
        if (!port) {
          alert('请先选择监视串口');
          return;
        }
        await fetch('/api/pio/serial/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ port, baud: Number(monitorBaud) })
        });
      }
    };

    const sendSerialData = async (e) => {
      if (e) e.preventDefault();
      if (!serialInput) return;
      try {
        let payload = serialInput;
        if (serialEnding === '\\r\\n') payload += '\r\n';
        else if (serialEnding === '\\n') payload += '\n';
        else if (serialEnding === '\\r') payload += '\r';

        await fetch('/api/pio/serial/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: payload, ending: '' })
        });
        setSerialInput('');
      } catch (e) {}
    };

    const uploadAndMonitor = async () => {
      if (serialStatus.connected && serialStatus.port === effectiveUploadPort) {
        await fetch('/api/pio/serial/disconnect', { method: 'POST' });
      }
      await runTask('upload');
      const checkFinish = setInterval(async () => {
        const infoRes = await fetch('/api/pio/info');
        const info = await infoRes.json();
        if (!info.activeTask) {
          clearInterval(checkFinish);
          setTimeout(() => {
            fetch('/api/pio/serial/connect', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ port: effectiveMonitorPort, baud: Number(monitorBaud) })
            });
            setSubTab('serial');
          }, 800);
        }
      }, 1000);
    };

    // ==========================================
    // Render Functions
    // ==========================================

    // Top Toolbar
    const renderTopBar = () => {
      const usbDevices = devices.filter(d => d.isUsb);
      const otherDevices = devices.filter(d => !d.isUsb);

      return h('div', { className: 'dsh-pio-topbar' },
        h('div', { className: 'dsh-pio-topbar-left' },
          h('div', { className: 'dsh-pio-brand-badge' },
            h(Icons.PioLogo, { size: 14 }),
            h('span', null, 'PlatformIO')
          ),

          // Dynamic Active Board & Framework Tags (clickable to open config)
          h('span', {
            className: 'dsh-pio-tag',
            style: { cursor: 'pointer', transition: 'border-color 0.15s ease' },
            onClick: () => setSubTab('config'),
            title: '点击进入项目配置修改开发板'
          }, formBoard || projectInfo?.board || 'esp32doit-devkit-v1'),

          h('span', {
            className: 'dsh-pio-tag',
            style: { cursor: 'pointer', transition: 'border-color 0.15s ease' },
            onClick: () => setSubTab('config'),
            title: '点击进入项目配置修改框架'
          }, formFramework || projectInfo?.framework || 'arduino'),

          // Python Interpreter Selector Button (VSCode-like)
          h('button', {
            className: 'dsh-pio-btn',
            style: {
              height: '24px',
              padding: '0 8px',
              fontSize: '11px',
              gap: '6px',
              background: isPySelectorOpen ? 'rgba(14, 99, 156, 0.25)' : 'rgba(255, 255, 255, 0.03)',
              borderColor: activePython?.isReady ? 'rgba(78, 201, 176, 0.5)' : '#f39c12',
              display: 'inline-flex',
              alignItems: 'center'
            },
            onClick: () => setIsPySelectorOpen(prev => !prev),
            title: `Python 解释器环境: ${activePython ? `${activePython.name} (${activePython.path})` : '点击选择环境'}`
          },
            h('span', {
              style: {
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: activePython?.isReady ? '#4ec9b0' : (activePython ? '#f39c12' : '#888')
              }
            }),
            h('span', { style: { fontWeight: 500, color: '#e0e0e0' } },
              activePython ? `${activePython.name} (${activePython.version ? activePython.version.split('.').slice(0, 2).join('.') : 'Py'})` : '选择 Python...'
            ),
            activePython?.platformio
              ? h('span', { style: { fontSize: '9px', padding: '1px 4px', background: 'rgba(78, 201, 176, 0.2)', color: '#4ec9b0', borderRadius: '2px' } }, 'PIO')
              : h('span', { style: { fontSize: '9px', padding: '1px 4px', background: 'rgba(243, 156, 18, 0.2)', color: '#f39c12', borderRadius: '2px' } }, '无PIO')
          ),

          // Upload Port Selector
          h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '4px' } },
            h('span', {
              style: { fontSize: '11px', color: '#aaaaaa', display: 'flex', alignItems: 'center', gap: '3px' },
              title: '烧录端口'
            },
              h(Icons.Upload, { size: 11 }),
              h('span', null, '烧录:')
            ),
            h('select', {
              className: 'dsh-pio-select',
              style: { maxWidth: '170px', borderColor: uploadPort && uploadPort !== 'auto' ? '#0e639c' : undefined },
              value: uploadPort,
              onChange: (e) => setUploadPort(e.target.value),
              title: `烧录端口: ${effectiveUploadPort || '自动'}`
            },
              h('option', { value: 'auto' }, `自动 (${primaryUsbPort || '无'})`),
              usbDevices.length > 0 ? h('optgroup', { label: 'USB 串口' },
                usbDevices.map(d => h('option', { key: 'up-' + d.port, value: d.port }, `${d.port} (${d.chip || 'USB'})`))
              ) : null,
              otherDevices.length > 0 ? h('optgroup', { label: '其它串口' },
                otherDevices.map(d => h('option', { key: 'up-' + d.port, value: d.port }, `${d.port} (${d.description || '端口'})`))
              ) : null
            )
          ),

          // Monitor Port Selector
          h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '4px' } },
            h('span', {
              style: { fontSize: '11px', color: '#aaaaaa', display: 'flex', alignItems: 'center', gap: '3px' },
              title: '监视端口'
            },
              h(Icons.Serial, { size: 11 }),
              h('span', null, '监视:')
            ),
            h('select', {
              className: 'dsh-pio-select',
              style: { maxWidth: '170px' },
              value: monitorPort,
              onChange: (e) => setMonitorPort(e.target.value),
              title: `监视端口: ${effectiveMonitorPort}`
            },
              h('option', { value: 'follow' }, `同烧录 (${effectiveUploadPort || '无'})`),
              usbDevices.length > 0 ? h('optgroup', { label: 'USB 串口' },
                usbDevices.map(d => h('option', { key: 'mp-' + d.port, value: d.port }, `${d.port} (${d.chip || 'USB'})`))
              ) : null,
              otherDevices.length > 0 ? h('optgroup', { label: '其它串口' },
                otherDevices.map(d => h('option', { key: 'mp-' + d.port, value: d.port }, `${d.port} (${d.description || '端口'})`))
              ) : null
            )
          ),

          // Baud Rate Selector
          h('select', {
            className: 'dsh-pio-select',
            style: { minWidth: '90px' },
            value: monitorBaud,
            onChange: (e) => setMonitorBaud(Number(e.target.value)),
            title: '波特率'
          },
            [115200, 9600, 57600, 230400, 460800, 921600].map(b =>
              h('option', { key: b, value: b }, String(b))
            )
          ),

          // Refresh Devices Button
          h('button', {
            className: 'dsh-pio-btn',
            onClick: () => refreshDevices(true),
            title: '刷新串口列表'
          }, h(Icons.Refresh, { size: 12 }), h('span', null, '刷新')),

          // Hotplug Notice Badge
          hotplugNotice ? h('span', {
            style: {
              fontSize: '11px',
              padding: '2px 8px',
              background: 'rgba(78, 201, 176, 0.2)',
              color: '#4ec9b0',
              border: '1px solid rgba(78, 201, 176, 0.4)',
              borderRadius: '3px'
            }
          }, hotplugNotice) : null
        ),

        h('div', { className: 'dsh-pio-topbar-right' },
          // Build Button
          h('button', {
            className: 'dsh-pio-btn dsh-pio-btn-primary',
            onClick: () => runTask(''),
            disabled: !!activeTask,
            title: '编译 (pio run)'
          }, h(Icons.Build, { size: 12 }), h('span', null, '编译')),

          // Upload Button
          h('button', {
            className: 'dsh-pio-btn dsh-pio-btn-primary',
            onClick: () => runTask('upload'),
            disabled: !!activeTask,
            title: '烧录 (pio run -t upload)'
          }, h(Icons.Upload, { size: 12 }), h('span', null, '烧录')),

          // Upload & Monitor Button
          h('button', {
            className: 'dsh-pio-btn',
            onClick: uploadAndMonitor,
            disabled: !!activeTask,
            title: '烧录并监视'
          }, h(Icons.Upload, { size: 12 }), h('span', null, '烧录+监视')),

          // Clean Button
          h('button', {
            className: 'dsh-pio-btn',
            onClick: () => runTask('clean'),
            disabled: !!activeTask,
            title: '清理 (pio run -t clean)'
          }, h(Icons.Clean, { size: 12 }), h('span', null, '清理')),

          // Stop Task Button
          activeTask ? h('button', {
            className: 'dsh-pio-btn',
            style: { color: '#ff6b6b', borderColor: '#ff6b6b' },
            onClick: stopTask,
            title: '停止任务'
          }, h(Icons.Stop, { size: 12 }), h('span', null, '终止')) : null
        )
      );
    };

    // Sub-Tabs Bar
    const renderSubTabsBar = () => {
      return h('div', { className: 'dsh-pio-tab-bar' },
        h('button', {
          className: `dsh-pio-tab-item ${subTab === 'build' ? 'active' : ''}`,
          onClick: () => setSubTab('build')
        },
          h(Icons.Build, { size: 12 }),
          h('span', null, '构建输出'),
          activeTask ? h('span', { className: 'dsh-pio-tab-badge active-dot' }) : null
        ),
        h('button', {
          className: `dsh-pio-tab-item ${subTab === 'serial' ? 'active' : ''}`,
          onClick: () => setSubTab('serial')
        },
          h(Icons.Serial, { size: 12 }),
          h('span', null, '串口监视'),
          serialStatus.connected ? h('span', { className: 'dsh-pio-tab-badge active-dot' }) : null
        ),
        h('button', {
          className: `dsh-pio-tab-item ${subTab === 'devices' ? 'active' : ''}`,
          onClick: () => setSubTab('devices')
        },
          h(Icons.Chip, { size: 12 }),
          h('span', null, '设备'),
          h('span', { className: 'dsh-pio-tab-badge' }, String(devices.length))
        ),
        h('button', {
          className: `dsh-pio-tab-item ${subTab === 'config' ? 'active' : ''}`,
          onClick: () => setSubTab('config')
        },
          h(Icons.PioLogo, { size: 12 }),
          h('span', null, '项目配置'),
          projectInfo?.environments?.length ? h('span', { className: 'dsh-pio-tab-badge' }, String(projectInfo.environments.length)) : null
        ),

        // Spacer
        h('div', { style: { flex: 1 } }),

        // Tab Actions (Clear & Auto-Scroll)
        subTab === 'build' ? h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '8px' } },
          h('label', { style: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#888', cursor: 'pointer' } },
            h('input', {
              type: 'checkbox',
              checked: autoScrollTask,
              onChange: (e) => setAutoScrollTask(e.target.checked)
            }),
            '自动滚屏'
          ),
          h('button', {
            className: 'dsh-pio-btn',
            style: { height: '22px', padding: '1px 6px', fontSize: '11px' },
            onClick: () => setTaskLogs([])
          }, '清空')
        ) : null,

        subTab === 'serial' ? h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '8px' } },
          h('label', { style: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#888', cursor: 'pointer' } },
            h('input', {
              type: 'checkbox',
              checked: showTimestamps,
              onChange: (e) => setShowTimestamps(e.target.checked)
            }),
            '时间戳'
          ),
          h('label', { style: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#888', cursor: 'pointer' } },
            h('input', {
              type: 'checkbox',
              checked: hexMode,
              onChange: (e) => setHexMode(e.target.checked)
            }),
            'HEX'
          ),
          h('label', { style: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#888', cursor: 'pointer' } },
            h('input', {
              type: 'checkbox',
              checked: autoScrollSerial,
              onChange: (e) => setAutoScrollSerial(e.target.checked)
            }),
            '自动滚屏'
          ),
          h('button', {
            className: 'dsh-pio-btn',
            style: { height: '22px', padding: '1px 6px', fontSize: '11px' },
            onClick: () => {
              setSerialLogs([]);
              fetch('/api/pio/serial/clear', { method: 'POST' }).catch(() => {});
            }
          }, '清空')
        ) : null
      );
    };

    // Build Output View
    const renderBuildView = () => {
      return h('div', { className: 'dsh-pio-tab-content' },
        h('div', { className: 'dsh-pio-terminal-screen', ref: taskScreenRef },
          taskLogs.length === 0
            ? h('div', { style: { color: '#666', fontStyle: 'italic', padding: '12px' } },
                '无构建任务输出'
              )
            : taskLogs.map((log, idx) =>
                h('div', {
                  key: idx,
                  className: `dsh-pio-terminal-line ${log.stream || 'stdout'}`
                }, log.text)
              )
        )
      );
    };

    // Serial Monitor View with dedicated sub-toolbar
    const renderSerialView = () => {
      return h('div', { className: 'dsh-pio-tab-content' },
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 8px',
            background: 'var(--dsw-alias-bg-layer-2, #1f1f1f)',
            borderBottom: '1px solid var(--dsw-alias-border-l1, #282828)',
            fontSize: '11px',
            flexShrink: 0,
            gap: '8px',
            flexWrap: 'wrap'
          }
        },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
            h('button', {
              className: `dsh-pio-btn ${serialStatus.connected ? '' : 'dsh-pio-btn-primary'}`,
              style: { height: '22px', padding: '0 8px', fontSize: '11px' },
              onClick: toggleSerial
            },
              h(Icons.Serial, { size: 10 }),
              h('span', null, serialStatus.connected ? '断开串口' : '连接串口')
            ),
            h('span', { style: { color: serialStatus.connected ? '#4ec9b0' : '#888888', fontWeight: 500 } },
              serialStatus.connected
                ? `${serialStatus.port} @ ${serialStatus.baud || monitorBaud}`
                : `${effectiveMonitorPort || '未指定'} @ ${monitorBaud}`
            )
          ),

          h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
            h('button', {
              className: 'dsh-pio-btn',
              style: { height: '22px', padding: '0 6px', fontSize: '11px' },
              onClick: () => {
                fetch('/api/pio/serial/send', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ text: '', rts: true, dtr: false })
                }).catch(() => {});
              },
              title: '硬件复位 (DTR/RTS)'
            }, h(Icons.Reset, { size: 10 }), '复位'),

            h('button', {
              className: 'dsh-pio-btn',
              style: { height: '22px', padding: '0 6px', fontSize: '11px' },
              onClick: () => {
                setSerialLogs([]);
                fetch('/api/pio/serial/clear', { method: 'POST' }).catch(() => {});
              }
            }, '清空')
          )
        ),

        // Serial Terminal Screen
        h('div', { className: 'dsh-pio-terminal-screen', ref: serialScreenRef },
          serialLogs.length === 0
            ? h('div', { style: { color: '#666', fontStyle: 'italic', padding: '12px' } },
                serialStatus.connected
                  ? '已连接，等待数据输出...'
                  : '串口未连接'
              )
            : serialLogs.map((log, idx) => {
                let text = log.text;
                if (hexMode && typeof text === 'string') {
                  text = Array.from(new TextEncoder().encode(text))
                    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
                    .join(' ') + ' ';
                }
                const timeStr = showTimestamps && log.time ? `[${new Date(log.time).toLocaleTimeString()}] ` : '';
                return h('div', {
                  key: idx,
                  className: `dsh-pio-terminal-line ${log.stream || 'stdout'}`
                }, timeStr + text);
              })
        ),

        // Serial Input Bar
        h('form', { className: 'dsh-pio-serial-input-bar', onSubmit: sendSerialData },
          h('input', {
            type: 'text',
            className: 'dsh-pio-input',
            style: { flex: 1, height: '26px' },
            placeholder: serialStatus.connected ? '输入指令 (Enter 发送)...' : '串口未连接',
            value: serialInput,
            disabled: !serialStatus.connected,
            onChange: (e) => setSerialInput(e.target.value)
          }),
          h('select', {
            className: 'dsh-pio-select',
            style: { width: '80px', height: '26px' },
            value: serialEnding,
            disabled: !serialStatus.connected,
            onChange: (e) => setSerialEnding(e.target.value)
          },
            h('option', { value: '\\r\\n' }, 'CRLF'),
            h('option', { value: '\\n' }, 'LF'),
            h('option', { value: '\\r' }, 'CR'),
            h('option', { value: '' }, '无')
          ),
          h('button', {
            type: 'submit',
            className: 'dsh-pio-btn dsh-pio-btn-primary',
            style: { height: '26px', padding: '0 10px' },
            disabled: !serialStatus.connected || !serialInput
          }, h(Icons.Send, { size: 10 }), '发送')
        )
      );
    };

    // Hardware Devices View
    const renderDevicesView = () => {
      return h('div', { className: 'dsh-pio-tab-content' },
        h('div', { className: 'dsh-pio-info-pane' },
          h('div', { className: 'dsh-pio-info-card' },
            h('div', { className: 'dsh-pio-info-title' },
              h(Icons.Chip, { size: 14 }),
              h('span', null, '串口与硬件设备'),
              h('div', { style: { flex: 1 } }),
              h('button', {
                className: 'dsh-pio-btn',
                style: { height: '22px', fontSize: '11px', padding: '0 8px' },
                onClick: () => refreshDevices(true)
              }, h(Icons.Refresh, { size: 10 }), '扫描')
            ),
            h('table', { className: 'dsh-pio-table' },
              h('tbody', null,
                devices.length === 0
                  ? h('tr', null, h('td', { colSpan: 4, style: { color: '#888' } }, '无活动串口'))
                  : devices.map(d => {
                      const isUp = d.port === effectiveUploadPort;
                      const isMp = d.port === effectiveMonitorPort;
                      return h('tr', { key: d.port },
                        h('td', { className: 'value', style: { width: '80px', color: d.isUsb ? '#4ec9b0' : '#cccccc', fontWeight: 'bold' } },
                          d.port,
                          d.isUsb ? h('span', { style: { marginLeft: '4px', fontSize: '9px', padding: '1px 4px', background: 'rgba(78, 201, 176, 0.2)', borderRadius: '2px' } }, 'USB') : null
                        ),
                        h('td', { className: 'value' },
                          h('div', { style: { fontWeight: 500 } }, d.description || '通信端口'),
                          d.hwid ? h('div', { style: { fontSize: '10px', color: '#777' } }, d.hwid) : null
                        ),
                        h('td', { style: { width: '130px' } },
                          isUp ? h('span', { style: { fontSize: '10px', padding: '2px 5px', background: 'rgba(243, 156, 18, 0.2)', color: '#f39c12', borderRadius: '3px', marginRight: '4px' } }, '烧录') : null,
                          isMp ? h('span', { style: { fontSize: '10px', padding: '2px 5px', background: 'rgba(78, 201, 176, 0.2)', color: '#4ec9b0', borderRadius: '3px' } }, '监视') : null
                        ),
                        h('td', { style: { textAlign: 'right', whiteSpace: 'nowrap' } },
                          h('button', {
                            className: 'dsh-pio-btn',
                            style: { height: '22px', padding: '0 6px', fontSize: '11px', marginRight: '4px' },
                            onClick: () => setUploadPort(d.port)
                          }, isUp ? '烧录' : '设为烧录'),
                          h('button', {
                            className: 'dsh-pio-btn',
                            style: { height: '22px', padding: '0 6px', fontSize: '11px', marginRight: '4px' },
                            onClick: () => setMonitorPort(d.port)
                          }, isMp ? '监视' : '设为监视'),
                          h('button', {
                            className: 'dsh-pio-btn',
                            style: { height: '22px', padding: '0 6px', fontSize: '11px' },
                            onClick: () => {
                              setUploadPort(d.port);
                              setMonitorPort('follow');
                            }
                          }, '设为两者')
                        )
                      );
                    })
              )
            )
          )
        )
      );
    };

    // ==========================================
    // Project Configuration & Management View (Visual Form + Search Recommendations)
    // ==========================================
    const renderConfigView = () => {
      const environments = projectInfo?.environments || [];
      const commonFilters = [
        { id: 'esp32_exception_decoder', label: 'esp32_exception_decoder (堆栈解码)' },
        { id: 'time', label: 'time (时间戳)' },
        { id: 'colorize', label: 'colorize (彩色)' },
        { id: 'log2file', label: 'log2file (日志文件)' },
        { id: 'send_on_enter', label: 'send_on_enter (回车发送)' }
      ];

      return h('div', { className: 'dsh-pio-tab-content' },
        h('div', { className: 'dsh-pio-info-pane' },

          // Project & Workspace Switcher Card
          h('div', { className: 'dsh-pio-info-card' },
            h('div', { className: 'dsh-pio-card-header' },
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                h(Icons.Project, { size: 14 }),
                h('span', { style: { fontWeight: 600, fontSize: '13px' } }, '工程管理'),
                projectInfo?.name ? h('span', { className: 'dsh-pio-badge dsh-pio-badge-esp32' }, projectInfo.name) : null
              ),
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
                h('button', {
                  className: 'dsh-pio-btn dsh-pio-btn-primary',
                  onClick: () => {
                    const currentDir = projectInfo?.dir || projectInfo?.projectPath || 'C:\\Users\\yaan\\Documents\\deepseek';
                    const parentDir = currentDir.includes('\\') ? currentDir.substring(0, currentDir.lastIndexOf('\\')) : currentDir;
                    setNewProjectForm(prev => ({
                      name: 'esp32-app-' + Math.floor(100 + Math.random() * 900),
                      board: projectInfo?.board || prev.board || 'esp32doit-devkit-v1',
                      framework: projectInfo?.framework || prev.framework || 'arduino',
                      dir: parentDir || 'C:\\Users\\yaan\\Documents\\deepseek'
                    }));
                    setIsNewProjectOpen(true);
                  },
                  title: '新建 PlatformIO 工程'
                }, h(Icons.Plus, { size: 11 }), '新建工程'),

                h('div', { style: { display: 'inline-flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', padding: '1px' } },
                  h('button', {
                    className: `dsh-pio-btn ${configViewMode === 'visual' ? 'dsh-pio-btn-primary' : ''}`,
                    style: { height: '22px', padding: '0 8px', fontSize: '11px', border: 'none' },
                    onClick: () => setConfigViewMode('visual')
                  }, '配置'),
                  h('button', {
                    className: `dsh-pio-btn ${configViewMode === 'raw' ? 'dsh-pio-btn-primary' : ''}`,
                    style: { height: '22px', padding: '0 8px', fontSize: '11px', border: 'none' },
                    onClick: () => setConfigViewMode('raw')
                  }, '源码')
                )
              )
            ),

            // Active Project Workspace Info & Switcher
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '12px' } },
              h('span', { style: { color: '#888' } }, '当前工程:'),
              h('select', {
                className: 'dsh-pio-select',
                style: { flex: 1, minWidth: '240px', maxWidth: '420px', fontFamily: 'monospace' },
                value: projectInfo?.projectPath || projectInfo?.dir || '',
                disabled: isSwitchingWorkspace,
                onChange: (e) => handleSwitchWorkspace(e.target.value)
              },
                projectList.length === 0
                  ? h('option', { value: projectInfo?.projectPath || '' }, projectInfo?.name || projectInfo?.projectPath || '无工程')
                  : projectList.map(p => {
                      const pPath = p.path || p.dir;
                      const envText = p.envs?.length ? ` [${p.envs.join(', ')}]` : '';
                      return h('option', { key: pPath, value: pPath }, `${p.name} (${pPath})${envText}`);
                    })
              ),
              h('button', {
                className: 'dsh-pio-btn',
                onClick: refreshProjects,
                title: '扫描 PlatformIO 工程'
              }, h(Icons.Refresh, { size: 10 }), '扫描')
            )
          ),

          // Feedback Banner if save successful / error
          configFeedback ? h('div', {
            style: {
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: configFeedback.success ? 'rgba(78, 201, 176, 0.15)' : 'rgba(231, 76, 60, 0.15)',
              border: `1px solid ${configFeedback.success ? 'rgba(78, 201, 176, 0.4)' : 'rgba(231, 76, 60, 0.4)'}`,
              color: configFeedback.success ? '#4ec9b0' : '#ff6b6b'
            }
          },
            h(configFeedback.success ? Icons.Check : Icons.Close, { size: 14 }),
            h('span', null, configFeedback.text)
          ) : null,

          // Environment Navigation Bar
          h('div', { className: 'dsh-pio-env-nav' },
            h('span', { style: { fontSize: '11px', color: '#888', marginRight: '6px' } }, '环境:'),
            environments.length === 0
              ? h('span', { style: { fontSize: '11px', color: '#666' } }, '未定义')
              : environments.map(env =>
                  h('button', {
                    key: env.name,
                    className: `dsh-pio-env-tab ${selectedEnvName === env.name ? 'active' : ''}`,
                    onClick: () => setSelectedEnvName(env.name)
                  },
                    h(Icons.Chip, { size: 11 }),
                    `env:${env.name}`
                  )
                ),
            h('button', {
              className: 'dsh-pio-btn',
              style: { height: '22px', padding: '0 8px', fontSize: '11px', marginLeft: '6px' },
              onClick: () => setIsAddEnvOpen(true),
              title: '添加运行环境'
            }, h(Icons.Plus, { size: 10 }), '添加环境')
          ),

          // MODE A: VISUAL CONFIGURATION FORM
          configViewMode === 'visual' ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },

            // Card 1: Hardware & Core Framework
            h('div', { className: 'dsh-pio-info-card' },
              h('div', { className: 'dsh-pio-info-title' },
                h(Icons.Chip, { size: 14 }),
                h('span', null, `硬件与框架 [env:${selectedEnvName || 'default'}]`),
                formBoard ? h('span', { className: 'dsh-pio-badge dsh-pio-badge-esp32' }, formBoard) : null
              ),
              h('div', { className: 'dsh-pio-form-grid' },
                // Board Field with Real-time Search Recommendation Dropdown
                h('div', { className: 'dsh-pio-form-field' },
                  h('label', null,
                    h(Icons.Search, { size: 11 }),
                    '开发板型号 (Board)'
                  ),
                  h(BoardAutocomplete, {
                    value: formBoard,
                    onChange: (val) => setFormBoard(val),
                    onSelect: (b) => {
                      setFormBoard(b.id);
                      if (b.platform) setFormPlatform(b.platform);
                      if (b.frameworks && b.frameworks.length > 0 && !b.frameworks.includes(formFramework)) {
                        setFormFramework(b.frameworks[0]);
                      }
                    },
                    placeholder: '搜索开发板 (如 esp32, doit, nodemcu, s3...)'
                  })
                ),

                // Framework Field
                h('div', { className: 'dsh-pio-form-field' },
                  h('label', null, '开发框架 (Framework)'),
                  h('select', {
                    className: 'dsh-pio-select',
                    style: { width: '100%', height: '28px' },
                    value: formFramework,
                    onChange: (e) => setFormFramework(e.target.value)
                  },
                    h('option', { value: 'arduino' }, 'arduino'),
                    h('option', { value: 'espidf' }, 'espidf')
                  )
                ),

                // Platform Field
                h('div', { className: 'dsh-pio-form-field' },
                  h('label', null, '硬件平台 (Platform)'),
                  h('input', {
                    type: 'text',
                    className: 'dsh-pio-input',
                    value: formPlatform,
                    onChange: (e) => setFormPlatform(e.target.value),
                    placeholder: '例如: espressif32'
                  }),
                  h('div', { className: 'dsh-pio-chip-group' },
                    ['espressif32', 'espressif8266', 'ststm32', 'raspberrypi', 'atmelavr'].map(p =>
                      h('span', {
                        key: p,
                        className: `dsh-pio-chip ${formPlatform === p ? 'active' : ''}`,
                        onClick: () => setFormPlatform(p)
                      }, p)
                    )
                  )
                )
              )
            ),

            // Card 2: Serial Communication & Upload Options
            h('div', { className: 'dsh-pio-info-card' },
              h('div', { className: 'dsh-pio-info-title' },
                h(Icons.Serial, { size: 14 }),
                h('span', null, '串口与烧录参数')
              ),
              h('div', { className: 'dsh-pio-form-grid' },
                // Monitor Speed
                h('div', { className: 'dsh-pio-form-field' },
                  h('label', null, '监视波特率 (monitor_speed)'),
                  h('select', {
                    className: 'dsh-pio-select',
                    style: { width: '100%', height: '28px' },
                    value: formMonitorSpeed,
                    onChange: (e) => setFormMonitorSpeed(e.target.value)
                  },
                    [
                      { val: '115200', text: '115200 (默认)' },
                      { val: '9600', text: '9600' },
                      { val: '74880', text: '74880 (Bootloader)' },
                      { val: '230400', text: '230400' },
                      { val: '460800', text: '460800' },
                      { val: '921600', text: '921600' }
                    ].map(opt => h('option', { key: opt.val, value: opt.val }, opt.text))
                  )
                ),

                // Upload Speed
                h('div', { className: 'dsh-pio-form-field' },
                  h('label', null, '烧录波特率 (upload_speed)'),
                  h('select', {
                    className: 'dsh-pio-select',
                    style: { width: '100%', height: '28px' },
                    value: formUploadSpeed,
                    onChange: (e) => setFormUploadSpeed(e.target.value)
                  },
                    [
                      { val: '921600', text: '921600 (推荐)' },
                      { val: '460800', text: '460800' },
                      { val: '115200', text: '115200' },
                      { val: '1500000', text: '1500000' }
                    ].map(opt => h('option', { key: opt.val, value: opt.val }, opt.text))
                  )
                )
              ),

              // Monitor Filters Interactive Chips
              h('div', { style: { marginTop: '12px' } },
                h('label', { style: { fontSize: '11px', fontWeight: 600, color: '#999', display: 'block', marginBottom: '4px' } },
                  '输出过滤器 (monitor_filters):'
                ),
                h('div', { className: 'dsh-pio-chip-group' },
                  commonFilters.map(filter => {
                    const isActive = formMonitorFilters.includes(filter.id);
                    return h('span', {
                      key: filter.id,
                      className: `dsh-pio-chip ${isActive ? 'active' : ''}`,
                      onClick: () => {
                        setFormMonitorFilters(prev =>
                          isActive ? prev.filter(f => f !== filter.id) : [...prev, filter.id]
                        );
                      }
                    },
                      h(isActive ? Icons.Check : Icons.Plus, { size: 10 }),
                      filter.label
                    );
                  })
                )
              )
            ),

            // Card 3: Build Flags & Macros
            h('div', { className: 'dsh-pio-info-card' },
              h('div', { className: 'dsh-pio-info-title' },
                h(Icons.Code, { size: 14 }),
                h('span', null, '编译宏定义 (build_flags)')
              ),
              h('div', { className: 'dsh-pio-form-field' },
                h('input', {
                  type: 'text',
                  className: 'dsh-pio-input',
                  value: formBuildFlags,
                  onChange: (e) => setFormBuildFlags(e.target.value),
                  placeholder: '例如: -DCORE_DEBUG_LEVEL=3 -DBOARD_HAS_PSRAM'
                }),
                h('div', { className: 'dsh-pio-chip-group' },
                  [
                    { flag: '-DCORE_DEBUG_LEVEL=3', label: '+ Debug 3' },
                    { flag: '-DCORE_DEBUG_LEVEL=5', label: '+ Verbose 5' },
                    { flag: '-DARDUINO_USB_CDC_ON_BOOT=1', label: '+ USB CDC' },
                    { flag: '-DBOARD_HAS_PSRAM', label: '+ PSRAM' }
                  ].map(item =>
                    h('span', {
                      key: item.flag,
                      className: 'dsh-pio-chip',
                      onClick: () => {
                        if (!formBuildFlags.includes(item.flag)) {
                          setFormBuildFlags(prev => (prev ? prev + ' ' : '') + item.flag);
                        }
                      }
                    }, item.label)
                  )
                )
              )
            ),

            // Card 4: Third-Party Library Dependencies with Live Search Recommendation
            h('div', { className: 'dsh-pio-info-card' },
              h('div', { className: 'dsh-pio-info-title' },
                h(Icons.Library, { size: 14 }),
                h('span', null, '库依赖 (lib_deps)'),
                h('span', { className: 'dsh-pio-badge' }, String(formLibDeps.length))
              ),

              // Autocomplete Input to Add Library
              h('div', { style: { marginBottom: '12px' } },
                h(LibAutocomplete, {
                  onAddLib: handleAddLibDep,
                  placeholder: '搜索库 (如 ArduinoJson, WiFi, TFT_eSPI...)'
                })
              ),

              // Currently Installed Libraries
              h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
                formLibDeps.length === 0
                  ? h('div', { style: { color: '#888', fontStyle: 'italic', fontSize: '12px', padding: '6px 0' } },
                      '无库依赖'
                    )
                  : formLibDeps.map(lib =>
                      h('div', { key: lib, className: 'dsh-pio-lib-card' },
                        h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                          h(Icons.Library, { size: 12, style: { color: '#4ec9b0' } }),
                          h('span', { className: 'lib-name' }, lib)
                        ),
                        h('button', {
                          className: 'dsh-pio-btn',
                          style: { height: '22px', padding: '0 8px', fontSize: '11px', color: '#ff6b6b' },
                          onClick: () => handleRemoveLibDep(lib)
                        }, h(Icons.Close, { size: 10 }), '移除')
                      )
                    )
              )
            ),

            // Save Actions Bar (Bottom Sticky)
            h('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'var(--dsw-alias-bg-layer-2, #1e1e1e)',
                border: '1px solid var(--dsw-alias-border-l1, #303030)',
                borderRadius: '6px',
                marginTop: '10px'
              }
            },
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                h('button', {
                  className: 'dsh-pio-btn dsh-pio-btn-primary',
                  style: { height: '28px', padding: '0 14px', fontSize: '12px' },
                  disabled: isSavingConfig,
                  onClick: handleSaveEnvConfig
                },
                  h(Icons.Save, { size: 12 }),
                  isSavingConfig ? '正在保存...' : '保存配置'
                )
              ),
              h('div', { style: { display: 'flex', gap: '8px' } },
                h('button', {
                  className: 'dsh-pio-btn',
                  onClick: () => runTask('compiledb'),
                  title: '生成 compile_commands.json 供 clangd / LSP 语法补全'
                }, '编译数据库 (compiledb)'),
                h('button', {
                  className: 'dsh-pio-btn',
                  onClick: () => runTask('size'),
                  title: '精确分析当前固件 RAM 与 Flash 占用'
                }, '固件占用 (size)')
              )
            )

          ) : null,

          // MODE B: RAW INI EDITOR
          configViewMode === 'raw' ? h('div', { className: 'dsh-pio-info-card' },
            h('div', { className: 'dsh-pio-info-title' },
              h(Icons.Code, { size: 14 }),
              h('span', null, 'platformio.ini 源码'),
              h('div', { style: { flex: 1 } }),
              h('button', {
                className: 'dsh-pio-btn dsh-pio-btn-primary',
                style: { height: '24px' },
                disabled: isSavingConfig,
                onClick: handleSaveRawIni
              }, h(Icons.Save, { size: 12 }), isSavingConfig ? '保存中...' : '保存')
            ),
            h('textarea', {
              className: 'dsh-pio-ini-editor',
              value: rawIniEdit,
              onChange: (e) => setRawIniEdit(e.target.value)
            })
          ) : null,

          // Python Environment Card (Always accessible)
          h('div', { className: 'dsh-pio-info-card' },
            h('div', { className: 'dsh-pio-info-title' },
              h(Icons.Settings, { size: 14 }),
              h('span', null, 'Python 与 PlatformIO 运行环境')
            ),
            h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', flexWrap: 'wrap', gap: '12px' } },
              h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
                h('div', { style: { fontSize: '12px', fontWeight: 600, color: '#e0e0e0', display: 'flex', alignItems: 'center', gap: '8px' } },
                  activePython ? `${activePython.name} (Python ${activePython.version})` : '未选定解释器',
                  activePython?.tag ? h('span', { style: { fontSize: '10px', padding: '1px 5px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', color: '#aaa' } }, activePython.tag) : null
                ),
                h('div', { style: { fontSize: '11px', color: '#888', fontFamily: 'Consolas, monospace' } },
                  activePython?.path || '无'
                ),
                h('div', { style: { display: 'flex', gap: '8px', marginTop: '2px' } },
                  activePython?.platformio
                    ? h('span', { style: { fontSize: '11px', color: '#4ec9b0' } }, `PlatformIO ${activePython.platformio}`)
                    : h('span', { style: { fontSize: '11px', color: '#f39c12' } }, '未安装 PlatformIO'),
                  activePython?.pyserial
                    ? h('span', { style: { fontSize: '11px', color: '#4ec9b0' } }, `pyserial ${activePython.pyserial}`)
                    : null
                )
              ),
              h('div', { style: { display: 'flex', gap: '6px' } },
                h('button', {
                  className: 'dsh-pio-btn dsh-pio-btn-primary',
                  onClick: () => setIsPySelectorOpen(true)
                }, '切换解释器'),
                h('button', {
                  className: 'dsh-pio-btn',
                  onClick: () => refreshInterpreters(true)
                }, '扫描')
              )
            )
          )

        )
      );
    };

    // New Project Wizard Modal Dialog
    const renderNewProjectModal = () => {
      return h('div', { className: 'dsh-pio-modal-wrapper' },
        h('div', { className: 'dsh-pio-modal-backdrop', onClick: () => setIsNewProjectOpen(false) }),
        h('div', { className: 'dsh-pio-modal-dialog' },
          h('div', { className: 'dsh-pio-modal-header' },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              h(Icons.Project, { size: 16 }),
              h('span', { style: { fontWeight: 600, fontSize: '13px' } }, '新建工程')
            ),
            h('button', {
              className: 'dsh-pio-btn',
              style: { height: '22px', width: '22px', padding: 0, justifyContent: 'center' },
              onClick: () => setIsNewProjectOpen(false)
            }, '✕')
          ),
          h('div', { className: 'dsh-pio-modal-body' },
            h('div', { className: 'dsh-pio-form-field' },
              h('label', null, '工程名称'),
              h('input', {
                type: 'text',
                className: 'dsh-pio-input',
                value: newProjectForm.name,
                onChange: (e) => setNewProjectForm(prev => ({ ...prev, name: e.target.value })),
                placeholder: '例如: esp32-app'
              })
            ),

            h('div', { className: 'dsh-pio-form-field' },
              h('label', null, '开发板型号 (Board)'),
              h(BoardAutocomplete, {
                value: newProjectForm.board,
                onChange: (val) => setNewProjectForm(prev => ({ ...prev, board: val })),
                onSelect: (b) => {
                  setNewProjectForm(prev => ({
                    ...prev,
                    board: b.id,
                    framework: b.frameworks && b.frameworks.length > 0 ? b.frameworks[0] : prev.framework
                  }));
                },
                placeholder: '搜索开发板 (如 esp32, doit...)'
              })
            ),

            h('div', { className: 'dsh-pio-form-field' },
              h('label', null, '开发框架'),
              h('select', {
                className: 'dsh-pio-select',
                style: { width: '100%', height: '28px' },
                value: newProjectForm.framework,
                onChange: (e) => setNewProjectForm(prev => ({ ...prev, framework: e.target.value }))
              },
                h('option', { value: 'arduino' }, 'arduino'),
                h('option', { value: 'espidf' }, 'espidf')
              )
            ),

            h('div', { className: 'dsh-pio-form-field' },
              h('label', null, '存储路径'),
              h('input', {
                type: 'text',
                className: 'dsh-pio-input',
                value: newProjectForm.dir,
                onChange: (e) => setNewProjectForm(prev => ({ ...prev, dir: e.target.value })),
                placeholder: '例如: C:\\Users\\yaan\\Documents\\deepseek'
              }),
              h('div', { style: { fontSize: '10px', color: 'var(--dsw-alias-label-secondary, #888)' } },
                `${newProjectForm.dir ? (newProjectForm.dir.endsWith('\\') ? newProjectForm.dir : newProjectForm.dir + '\\') : ''}${newProjectForm.name || ''}`
              )
            )
          ),
          h('div', { className: 'dsh-pio-modal-footer' },
            h('button', {
              className: 'dsh-pio-btn',
              onClick: () => setIsNewProjectOpen(false)
            }, '取消'),
            h('button', {
              className: 'dsh-pio-btn dsh-pio-btn-primary',
              disabled: isCreatingProject || !newProjectForm.name || !newProjectForm.board,
              onClick: handleCreateProject
            }, isCreatingProject ? '正在初始化...' : '创建工程')
          )
        )
      );
    };

    // Add Environment Modal Dialog
    const renderAddEnvModal = () => {
      return h('div', { className: 'dsh-pio-modal-wrapper' },
        h('div', { className: 'dsh-pio-modal-backdrop', onClick: () => setIsAddEnvOpen(false) }),
        h('div', { className: 'dsh-pio-modal-dialog', style: { width: '500px' } },
          h('div', { className: 'dsh-pio-modal-header' },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              h(Icons.Plus, { size: 14 }),
              h('span', { style: { fontWeight: 600, fontSize: '13px' } }, '添加运行环境')
            ),
            h('button', {
              className: 'dsh-pio-btn',
              style: { height: '22px', width: '22px', padding: 0, justifyContent: 'center' },
              onClick: () => setIsAddEnvOpen(false)
            }, '✕')
          ),
          h('div', { className: 'dsh-pio-modal-body' },
            h('div', { className: 'dsh-pio-form-field' },
              h('label', null, '环境名称'),
              h('input', {
                type: 'text',
                className: 'dsh-pio-input',
                value: newEnvForm.name,
                onChange: (e) => setNewEnvForm(prev => ({ ...prev, name: e.target.value })),
                placeholder: '例如: esp32-s3'
              })
            ),
            h('div', { className: 'dsh-pio-form-field' },
              h('label', null, '开发板型号 (Board)'),
              h(BoardAutocomplete, {
                value: newEnvForm.board,
                onChange: (val) => setNewEnvForm(prev => ({ ...prev, board: val })),
                onSelect: (b) => {
                  setNewEnvForm(prev => ({
                    ...prev,
                    board: b.id,
                    platform: b.platform || prev.platform
                  }));
                },
                placeholder: '搜索开发板...'
              })
            ),
            h('div', { className: 'dsh-pio-form-field' },
              h('label', null, '开发框架'),
              h('select', {
                className: 'dsh-pio-select',
                style: { width: '100%', height: '28px' },
                value: newEnvForm.framework,
                onChange: (e) => setNewEnvForm(prev => ({ ...prev, framework: e.target.value }))
              },
                h('option', { value: 'arduino' }, 'arduino'),
                h('option', { value: 'espidf' }, 'espidf')
              )
            )
          ),
          h('div', { className: 'dsh-pio-modal-footer' },
            h('button', {
              className: 'dsh-pio-btn',
              onClick: () => setIsAddEnvOpen(false)
            }, '取消'),
            h('button', {
              className: 'dsh-pio-btn dsh-pio-btn-primary',
              disabled: !newEnvForm.name || !newEnvForm.board,
              onClick: handleAddEnv
            }, '添加')
          )
        )
      );
    };

    // Python Interpreter Selector Modal (VSCode-like)
    const renderPySelectorModal = () => {
      return h('div', { className: 'dsh-pio-modal-wrapper' },
        h('div', { className: 'dsh-pio-modal-backdrop', onClick: () => setIsPySelectorOpen(false) }),
        h('div', { className: 'dsh-pio-modal-dialog', style: { width: '560px' } },
          h('div', { className: 'dsh-pio-modal-header' },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              h('span', { style: { fontWeight: 600, fontSize: '12px', color: 'var(--dsw-alias-label-primary, #e0e0e0)' } }, '选择 Python 解释器'),
              h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-secondary, #888)' } }, `${interpreters.length} 个环境 (${readyCount} 就绪)`)
            ),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
              h('button', {
                className: 'dsh-pio-btn',
                style: { height: '22px', fontSize: '11px', padding: '0 6px' },
                onClick: () => refreshInterpreters(true),
                title: '扫描系统 Python 环境'
              }, isScanningPy ? '扫描中...' : '扫描'),
              h('button', {
                className: 'dsh-pio-btn',
                style: { height: '22px', width: '22px', padding: 0, justifyContent: 'center' },
                onClick: () => setIsPySelectorOpen(false)
              }, '✕')
            )
          ),

          h('div', {
            style: {
              padding: '6px 12px',
              borderBottom: '1px solid var(--dsw-alias-border-l1, #282828)',
              display: 'flex',
              gap: '8px',
              background: 'rgba(0, 0, 0, 0.1)'
            }
          },
            h('input', {
              type: 'text',
              className: 'dsh-pio-input',
              style: { flex: 1, height: '26px', fontSize: '11px' },
              placeholder: '搜索解释器或路径...',
              value: pyFilter,
              onChange: (e) => setPyFilter(e.target.value)
            }),
            h('button', {
              className: 'dsh-pio-btn',
              style: { height: '26px', fontSize: '11px' },
              onClick: () => setShowAddCustomPy(prev => !prev)
            }, showAddCustomPy ? '收起' : '自定义路径')
          ),

          showAddCustomPy ? h('div', {
            style: {
              padding: '8px 12px',
              borderBottom: '1px solid var(--dsw-alias-border-l1, #282828)',
              background: 'rgba(255, 255, 255, 0.02)',
              display: 'flex',
              gap: '8px'
            }
          },
            h('input', {
              type: 'text',
              className: 'dsh-pio-input',
              style: { flex: 1, height: '24px', fontSize: '11px' },
              placeholder: '例如: C:\\miniconda3\\envs\\myenv\\python.exe',
              value: customPyInput,
              onChange: (e) => setCustomPyInput(e.target.value)
            }),
            h('button', {
              className: 'dsh-pio-btn dsh-pio-btn-primary',
              style: { height: '24px', fontSize: '11px' },
              onClick: handleAddCustomPy,
              disabled: !customPyInput.trim()
            }, '选用')
          ) : null,

          h('div', {
            style: {
              maxHeight: '320px',
              overflowY: 'auto',
              padding: '4px'
            }
          },
            filteredInterpreters.length === 0
              ? h('div', { style: { padding: '16px', color: '#888', textAlign: 'center', fontSize: '12px' } },
                  isScanningPy ? '正在扫描环境...' : '无匹配解释器'
                )
              : filteredInterpreters.map((item) => {
                  const isSelected = activePython?.path?.toLowerCase() === item.path?.toLowerCase();
                  return h('div', {
                    key: item.path,
                    style: {
                      padding: '8px 10px',
                      margin: '2px 4px',
                      borderRadius: '4px',
                      background: isSelected ? 'rgba(14, 99, 156, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1px solid rgba(14, 99, 156, 0.6)' : '1px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.15s ease'
                    },
                    onClick: () => handleSelectPy(item.path)
                  },
                    h('div', { style: { display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: 0 } },
                      h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
                        h('span', { style: { fontWeight: 600, fontSize: '12px', color: isSelected ? '#4ec9b0' : '#e0e0e0' } },
                          item.name
                        ),
                        h('span', {
                          style: {
                            fontSize: '10px',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            color: '#aaa'
                          }
                        }, item.tag),
                        h('span', { style: { fontSize: '11px', color: '#888' } }, `Python ${item.version}`)
                      ),
                      h('div', {
                        style: {
                          fontSize: '10px',
                          color: '#777',
                          fontFamily: 'Consolas, monospace',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        },
                        title: item.path
                      }, item.path),
                      h('div', { style: { display: 'flex', gap: '6px', marginTop: '2px' } },
                        item.platformio
                          ? h('span', { style: { fontSize: '10px', color: '#4ec9b0' } }, `PlatformIO ${item.platformio}`)
                          : h('span', { style: { fontSize: '10px', color: '#f39c12' } }, '未安装 PlatformIO'),
                        item.pyserial
                          ? h('span', { style: { fontSize: '10px', color: '#4ec9b0' } }, `pyserial ${item.pyserial}`)
                          : null
                      )
                    ),
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '12px' } },
                      isSelected
                        ? h('span', { style: { fontSize: '11px', color: '#4ec9b0', fontWeight: 500 } }, '当前选用')
                        : h('button', {
                            className: 'dsh-pio-btn',
                            style: { height: '22px', fontSize: '11px', padding: '0 8px' },
                            onClick: (e) => { e.stopPropagation(); handleSelectPy(item.path); }
                          }, '选择'),
                      !item.platformio ? h('button', {
                        className: 'dsh-pio-btn dsh-pio-btn-primary',
                        style: { height: '22px', fontSize: '11px', padding: '0 8px' },
                        onClick: (e) => { e.stopPropagation(); handleInstallPio(item.path); },
                        title: `在 ${item.name} 中安装 platformio 和 pyserial`
                      }, '安装 PlatformIO') : null
                    )
                  );
                })
          )
        )
      );
    };

    return h('div', { className: 'dsh-pio-workbench', style: { position: 'relative' } },
      renderTopBar(),
      isPySelectorOpen ? renderPySelectorModal() : null,
      isNewProjectOpen ? renderNewProjectModal() : null,
      isAddEnvOpen ? renderAddEnvModal() : null,
      renderSubTabsBar(),
      h('div', { className: 'dsh-pio-body' },
        subTab === 'build' && renderBuildView(),
        subTab === 'serial' && renderSerialView(),
        subTab === 'devices' && renderDevicesView(),
        subTab === 'config' && renderConfigView()
      )
    );
  };
}
