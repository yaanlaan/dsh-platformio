/**
 * ds-platformio Host Plugin
 * DeepSeek Harness PlatformIO IDE Host Plugin
 * Exposes /api/pio endpoints on DSH webServer for building, flashing, debugging,
 * monitoring, project management, multi-platform project wizard, and hardware control.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { PioManager, CURATED_BOARDS, CURATED_LIBS } from './pio-manager.js';
import { SerialBridge } from './serial-bridge.js';
import { PythonScanner } from './python-scanner.js';

export const name = 'ds-platformio';
export const inject = ['webServer', 'clientModules'];

function resolveWorkspacePath(explicitCwd) {
  if (explicitCwd && existsSync(explicitCwd)) {
    return explicitCwd;
  }
  try {
    const wsFile = join(homedir(), '.dsh', 'storages', 'workspace.json');
    if (existsSync(wsFile)) {
      const data = JSON.parse(readFileSync(wsFile, 'utf8'));
      const workspaces = data?.tables?.workspaces || {};
      const list = Object.values(workspaces).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      for (const ws of list) {
        if (ws.path && existsSync(join(ws.path, 'platformio.ini'))) {
          return ws.path;
        }
      }
      if (list.length > 0 && list[0].path) {
        return list[0].path;
      }
    }
  } catch (err) {}
  if (existsSync('C:\\Users\\yaan\\Documents\\deepseek\\esp32\\platformio.ini')) {
    return 'C:\\Users\\yaan\\Documents\\deepseek\\esp32';
  }
  return explicitCwd || process.cwd();
}

export function apply(ctx, config = {}) {
  const initialWorkspace = resolveWorkspacePath(config.workspace);
  const pythonScanner = new PythonScanner({
    workspaceRoot: initialWorkspace
  });

  const pioManager = new PioManager({
    pythonPath: pythonScanner.activePythonPath || config.pythonPath || 'python',
    workspaceRoot: initialWorkspace
  });

  const serialBridge = new SerialBridge({
    pythonPath: pythonScanner.activePythonPath || config.pythonPath || 'python'
  });

  // Background auto-scan on startup to pick or refresh active python
  pythonScanner.scanAll().then(scanRes => {
    if (scanRes.activePath) {
      pioManager.setPythonPath(scanRes.activePath);
      serialBridge.setPythonPath(scanRes.activePath);
    }
  }).catch(() => {});

  // Active task state and log buffer
  let taskLogs = [];
  let taskSeqId = 0;
  const taskClients = new Set();
  const serialClients = new Set();

  function broadcastTask(event, data) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of taskClients) {
      try {
        client.write(payload);
      } catch (e) {
        taskClients.delete(client);
      }
    }
  }

  function broadcastSerial(event, data) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of serialClients) {
      try {
        client.write(payload);
      } catch (e) {
        serialClients.delete(client);
      }
    }
  }

  // Hook serial bridge events to SSE
  serialBridge.on('data', (entry) => {
    broadcastSerial('data', entry);
  });

  serialBridge.on('status', (status) => {
    broadcastSerial('status', status);
  });

  serialBridge.on('system', (sys) => {
    broadcastSerial('system', sys);
  });

  serialBridge.on('error', (err) => {
    broadcastSerial('error', { error: err });
  });

  // Background real-time device change detection & caching
  let lastDevicesSignature = '';
  let cachedDevices = [];

  async function checkDeviceChanges() {
    try {
      const result = await pioManager.listDevices();
      if (result.success && result.devices) {
        cachedDevices = result.devices;
        const sig = result.devices.map(d => `${d.port}:${d.hwid || ''}`).join('|');
        if (lastDevicesSignature !== '' && sig !== lastDevicesSignature) {
          // Hardware plugged in or unplugged!
          broadcastTask('devices', { devices: result.devices, changed: true, timestamp: Date.now() });
          broadcastSerial('devices', { devices: result.devices, changed: true, timestamp: Date.now() });
        }
        lastDevicesSignature = sig;
      }
    } catch (e) {}
  }

  // Poll devices every 1500ms
  const devWatcherTimer = setInterval(checkDeviceChanges, 1500);
  checkDeviceChanges();

  function sendJson(res, status, obj) {
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(obj));
  }

  function readJson(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (e) {
          reject(e);
        }
      });
      req.on('error', reject);
    });
  }

  if (ctx.webServer) {
    ctx.effect(() => {
      return ctx.webServer.register({
        kind: 'prefix',
        path: '/api/pio',
        handler: async (req, res) => {
          const url = new URL(req.url, 'http://localhost');
          const path = url.pathname;

          // Handle CORS Preflight
          if (req.method === 'OPTIONS') {
            res.writeHead(204, {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            });
            res.end();
            return;
          }

          try {
            // 1. GET /api/pio/info
            if (path === '/api/pio/info' && req.method === 'GET') {
              const queryWs = url.searchParams.get('workspace');
              if (queryWs && existsSync(queryWs)) {
                pioManager.setWorkspace(queryWs);
              }
              const project = await pioManager.getProjectInfo();
              return sendJson(res, 200, {
                success: true,
                project,
                workspace: pioManager.workspaceRoot,
                pioPath: pioManager.pioPath,
                serialStatus: serialBridge.getStatus(),
                activeTask: pioManager.activeTask ? {
                  args: pioManager.activeTask.args,
                  startTime: pioManager.activeTask.startTime
                } : null
              });
            }

            // 2. GET /api/pio/projects (scan workspaces for PlatformIO projects)
            if (path === '/api/pio/projects' && req.method === 'GET') {
              const result = await pioManager.listProjects();
              return sendJson(res, 200, result);
            }

            // 3. POST /api/pio/workspace (switch active workspace)
            if (path === '/api/pio/workspace' && req.method === 'POST') {
              const body = await readJson(req);
              if (body.workspace) {
                const switchResult = pioManager.setWorkspace(body.workspace);
                const project = await pioManager.getProjectInfo();
                return sendJson(res, 200, {
                  success: switchResult.success,
                  workspace: pioManager.workspaceRoot,
                  project
                });
              }
              return sendJson(res, 400, { success: false, error: 'Missing workspace path' });
            }

            // 4. GET /api/pio/boards (search boards)
            if (path === '/api/pio/boards' && req.method === 'GET') {
              const query = url.searchParams.get('q') || '';
              const result = await pioManager.searchBoards(query);
              return sendJson(res, 200, result);
            }

            // 5. GET /api/pio/libs or /api/pio/libs/search (libraries search with autocomplete)
            if ((path === '/api/pio/libs' || path === '/api/pio/libs/search') && req.method === 'GET') {
              const query = url.searchParams.get('q') || '';
              const result = await pioManager.searchLibraries(query);
              return sendJson(res, 200, result);
            }

            // 6. POST /api/pio/project/init (create new project for ANY board/framework)
            if (path === '/api/pio/project/init' && req.method === 'POST') {
              const body = await readJson(req);
              const result = await pioManager.initProject(body);
              if (result.success) {
                const project = await pioManager.getProjectInfo(result.dir);
                return sendJson(res, 200, { ...result, project });
              }
              return sendJson(res, 400, result);
            }

            // 7. POST /api/pio/ini/save (save platformio.ini raw)
            if (path === '/api/pio/ini/save' && req.method === 'POST') {
              const body = await readJson(req);
              if (!body.rawIni) {
                return sendJson(res, 400, { success: false, error: 'rawIni is required' });
              }
              const result = await pioManager.saveProjectIni(body.rawIni, body.dir);
              const project = await pioManager.getProjectInfo();
              return sendJson(res, result.success ? 200 : 400, { ...result, project });
            }

            // 7.1 POST /api/pio/ini/update-env (update specific env configuration non-destructively)
            if (path === '/api/pio/ini/update-env' && req.method === 'POST') {
              const body = await readJson(req);
              const { env, updates, dir } = body;
              if (!env) {
                return sendJson(res, 400, { success: false, error: 'Target environment name is required' });
              }
              const result = await pioManager.updateProjectEnvConfig(env, updates || {}, dir);
              return sendJson(res, result.success ? 200 : 400, result);
            }

            // 8. POST /api/pio/env/add (add environment to platformio.ini)
            if (path === '/api/pio/env/add' && req.method === 'POST') {
              const body = await readJson(req);
              const result = await pioManager.addEnvironment(body);
              const project = await pioManager.getProjectInfo();
              return sendJson(res, result.success ? 200 : 400, { ...result, project });
            }

            // 9. POST /api/pio/libs/add (add library to platformio.ini)
            if (path === '/api/pio/libs/add' && req.method === 'POST') {
              const body = await readJson(req);
              const result = await pioManager.addLibraryDependency(body.lib, body.env, body.dir);
              const project = await pioManager.getProjectInfo();
              return sendJson(res, result.success ? 200 : 400, { ...result, project });
            }

            // 9.1 POST /api/pio/libs/remove (remove library from platformio.ini)
            if (path === '/api/pio/libs/remove' && req.method === 'POST') {
              const body = await readJson(req);
              const result = await pioManager.removeLibraryDependency(body.lib, body.env, body.dir);
              const project = await pioManager.getProjectInfo();
              return sendJson(res, result.success ? 200 : 400, { ...result, project });
            }

            // 10. GET /api/pio/devices
            if (path === '/api/pio/devices' && req.method === 'GET') {
              const force = url.searchParams.get('force') === '1';
              if (!force && cachedDevices.length > 0) {
                return sendJson(res, 200, { success: true, devices: cachedDevices });
              }
              const result = await pioManager.listDevices();
              if (result.success && result.devices) {
                cachedDevices = result.devices;
              }
              return sendJson(res, 200, result);
            }

            // 11. POST /api/pio/task (build, upload, clean, compiledb, check, size)
            if (path === '/api/pio/task' && req.method === 'POST') {
              const body = await readJson(req);
              const { task, env, port, extraArgs, autoReconnectSerial } = body;

              if (pioManager.activeTask) {
                return sendJson(res, 409, { success: false, error: 'Another task is currently running' });
              }

              taskLogs = [];
              broadcastTask('start', { task, env, port, time: Date.now() });

              // If task is upload, release serial port handle
              let pausedSerial = false;
              if (task === 'upload') {
                pausedSerial = await serialBridge.pauseForUpload();
                if (pausedSerial) {
                  const pauseEntry = { text: '\n[dsh-pio] Paused serial monitor to release COM port for flashing...\n', stream: 'stdout' };
                  taskLogs.push(pauseEntry);
                  broadcastTask('output', pauseEntry);
                }
              }

              const result = pioManager.runTask({
                task,
                env,
                port,
                extraArgs,
                onOutput: (entry) => {
                  entry.id = ++taskSeqId;
                  taskLogs.push(entry);
                  if (taskLogs.length > 3000) taskLogs.shift();
                  broadcastTask('output', entry);
                },
                onFinish: async (status) => {
                  broadcastTask('finish', status);

                  // If serial monitor was paused for upload, resume it after flashing!
                  if (pausedSerial || autoReconnectSerial) {
                    const resumeEntry = { text: '[dsh-pio] Flashing finished. Resuming serial monitor...\n', stream: 'stdout' };
                    taskLogs.push(resumeEntry);
                    broadcastTask('output', resumeEntry);
                    await serialBridge.resumeAfterUpload();
                  }
                }
              });

              return sendJson(res, result.success ? 200 : 400, result);
            }

            // 12. POST /api/pio/stop-task
            if (path === '/api/pio/stop-task' && req.method === 'POST') {
              const result = pioManager.stopTask();
              broadcastTask('stopped', { time: Date.now() });
              return sendJson(res, 200, result);
            }

            // 13. GET /api/pio/task-stream (SSE)
            if (path === '/api/pio/task-stream' && req.method === 'GET') {
              res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*'
              });
              res.write(': connected\n\n');
              if (cachedDevices.length > 0) {
                res.write(`event: devices\ndata: ${JSON.stringify({ devices: cachedDevices, timestamp: Date.now() })}\n\n`);
              }
              taskClients.add(res);

              req.on('close', () => {
                taskClients.delete(res);
              });
              return;
            }

            // 14. GET /api/pio/task-logs
            if (path === '/api/pio/task-logs' && req.method === 'GET') {
              const since = parseInt(url.searchParams.get('since_id') || url.searchParams.get('since') || '0', 10);
              const filtered = since > 0 ? taskLogs.filter(l => (l.id || 0) > since) : taskLogs;
              return sendJson(res, 200, {
                success: true,
                isRunning: !!pioManager.activeTask,
                activeTask: pioManager.activeTask ? {
                  args: pioManager.activeTask.args,
                  startTime: pioManager.activeTask.startTime
                } : null,
                logs: filtered
              });
            }

            // 15. POST /api/pio/serial/connect
            if (path === '/api/pio/serial/connect' && req.method === 'POST') {
              const body = await readJson(req);
              const { port } = body;
              const baud = body.baud || body.baudrate || 115200;
              if (!port) {
                return sendJson(res, 400, { success: false, error: 'Port is required' });
              }
              const result = await serialBridge.open(port, baud);
              return sendJson(res, result.success ? 200 : 400, result);
            }

            // 16. POST /api/pio/serial/disconnect
            if (path === '/api/pio/serial/disconnect' && req.method === 'POST') {
              const result = serialBridge.close();
              return sendJson(res, 200, result);
            }

            // 17. POST /api/pio/serial/send
            if (path === '/api/pio/serial/send' && req.method === 'POST') {
              const body = await readJson(req);
              const { text, ending } = body;
              const result = serialBridge.write(text, ending !== undefined ? ending : '\r\n');
              return sendJson(res, result.success ? 200 : 400, result);
            }

            // 18. POST /api/pio/serial/reset
            if (path === '/api/pio/serial/reset' && req.method === 'POST') {
              const result = serialBridge.reset();
              return sendJson(res, 200, result);
            }

            // 19. POST /api/pio/serial/bootloader
            if (path === '/api/pio/serial/bootloader' && req.method === 'POST') {
              const result = serialBridge.bootloader();
              return sendJson(res, 200, result);
            }

            // 20. POST /api/pio/serial/clear
            if (path === '/api/pio/serial/clear' && req.method === 'POST') {
              const result = serialBridge.clear();
              return sendJson(res, 200, result);
            }

            // 21. GET /api/pio/serial-stream (SSE)
            if (path === '/api/pio/serial-stream' && req.method === 'GET') {
              res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*'
              });
              res.write(': connected\n\n');
              res.write(`event: status\ndata: ${JSON.stringify(serialBridge.getStatus())}\n\n`);
              if (cachedDevices.length > 0) {
                res.write(`event: devices\ndata: ${JSON.stringify({ devices: cachedDevices, timestamp: Date.now() })}\n\n`);
              }
              serialClients.add(res);

              req.on('close', () => {
                serialClients.delete(res);
              });
              return;
            }

            // 22. GET /api/pio/serial/logs
            if (path === '/api/pio/serial/logs' && req.method === 'GET') {
              const since = parseInt(url.searchParams.get('since_id') || url.searchParams.get('since') || '0', 10);
              return sendJson(res, 200, {
                success: true,
                status: serialBridge.getStatus(),
                logs: serialBridge.getLogs(since)
              });
            }

            // 23. GET /api/pio/python/interpreters
            if (path === '/api/pio/python/interpreters' && req.method === 'GET') {
              const refresh = url.searchParams.get('refresh') === '1' || url.searchParams.get('force') === '1';
              const result = await pythonScanner.scanAll(refresh);
              return sendJson(res, 200, result);
            }

            // 24. POST /api/pio/python/select
            if (path === '/api/pio/python/select' && req.method === 'POST') {
              const body = await readJson(req);
              const { path: pyPath } = body;
              if (!pyPath) {
                return sendJson(res, 400, { success: false, error: 'Path is required' });
              }
              const result = await pythonScanner.setActive(pyPath);
              if (result.success && result.activePath) {
                pioManager.setPythonPath(result.activePath);
                serialBridge.setPythonPath(result.activePath);
              }
              return sendJson(res, result.success ? 200 : 400, result);
            }

            // 25. POST /api/pio/python/add-custom
            if (path === '/api/pio/python/add-custom' && req.method === 'POST') {
              const body = await readJson(req);
              const { path: pyPath } = body;
              if (!pyPath) {
                return sendJson(res, 400, { success: false, error: 'Path is required' });
              }
              const result = await pythonScanner.addCustomPath(pyPath);
              if (result.success && result.activePath) {
                pioManager.setPythonPath(result.activePath);
                serialBridge.setPythonPath(result.activePath);
              }
              return sendJson(res, result.success ? 200 : 400, result);
            }

            // 26. POST /api/pio/python/install-pio
            if (path === '/api/pio/python/install-pio' && req.method === 'POST') {
              const body = await readJson(req);
              const { path: pyPath } = body;
              const targetPy = pyPath || pythonScanner.activePythonPath;

              taskLogs = [];
              broadcastTask('start', { command: 'pip install platformio' });

              const installResult = await pythonScanner.installPlatformIO(targetPy, (text, stream) => {
                taskSeqId++;
                const logEntry = { id: taskSeqId, text, stream, timestamp: Date.now() };
                taskLogs.push(logEntry);
                broadcastTask('data', logEntry);
              });

              broadcastTask('finish', { code: installResult.success ? 0 : 1, success: installResult.success });
              if (installResult.success) {
                pioManager.setPythonPath(targetPy);
                serialBridge.setPythonPath(targetPy);
              }
              return sendJson(res, installResult.success ? 200 : 400, installResult);
            }

            sendJson(res, 404, { success: false, error: 'Endpoint not found' });
          } catch (err) {
            sendJson(res, 500, { success: false, error: err.message });
          }
        }
      });
    }, 'ds-platformio: api route');
  }

  if (ctx.clientModules) {
    try {
      ctx.clientModules.rebuilt('ds-platformio');
      ctx.clientModules.rebuilt('dsh-pio');
    } catch (e) {}
  }
}
