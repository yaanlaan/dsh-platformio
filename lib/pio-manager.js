/**
 * dsh-pio PlatformIO CLI Executor & Project Manager
 * Executes `pio run`, `pio device list`, detects boards, inspects/modifies `platformio.ini`,
 * provides multi-platform project wizard (ESP32, STM32, Pico, Arduino, etc.),
 * environment switching, library management, and code database generation.
 */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, promises as fs } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { homedir } from 'node:os';

export const CURATED_BOARDS = [
  {
    id: 'esp32doit-devkit-v1',
    name: 'DOIT ESP32 DEVKIT V1 (ESP-WROOM-32)',
    platform: 'espressif32',
    mcu: 'ESP32',
    fcpu: '240MHz',
    ram: '320KB',
    rom: '4MB',
    vendor: 'Espressif / DOIT',
    frameworks: ['arduino', 'espidf'],
    category: 'ESP32'
  },
  {
    id: 'esp32-s3-devkitc-1',
    name: 'Espressif ESP32-S3-DevKitC-1 (Dual-Core LX7 + AI)',
    platform: 'espressif32',
    mcu: 'ESP32-S3',
    fcpu: '240MHz',
    ram: '512KB',
    rom: '8MB',
    vendor: 'Espressif',
    frameworks: ['arduino', 'espidf'],
    category: 'ESP32-S3'
  },
  {
    id: 'esp32-c3-devkitm-1',
    name: 'Espressif ESP32-C3-DevKitM-1 (RISC-V 32-bit)',
    platform: 'espressif32',
    mcu: 'ESP32-C3',
    fcpu: '160MHz',
    ram: '400KB',
    rom: '4MB',
    vendor: 'Espressif',
    frameworks: ['arduino', 'espidf'],
    category: 'ESP32-C3'
  },
  {
    id: 'esp32-c6-devkitc-1',
    name: 'Espressif ESP32-C6-DevKitC-1 (Wi-Fi 6 + Zigbee/Thread)',
    platform: 'espressif32',
    mcu: 'ESP32-C6',
    fcpu: '160MHz',
    ram: '512KB',
    rom: '8MB',
    vendor: 'Espressif',
    frameworks: ['arduino', 'espidf'],
    category: 'ESP32-C6'
  },
  {
    id: 'esp32-s2-saola-1',
    name: 'Espressif ESP32-S2-Saola-1 (Native USB)',
    platform: 'espressif32',
    mcu: 'ESP32-S2',
    fcpu: '240MHz',
    ram: '320KB',
    rom: '4MB',
    vendor: 'Espressif',
    frameworks: ['arduino', 'espidf'],
    category: 'ESP32-S2'
  },
  {
    id: 'seeed_xiao_esp32c3',
    name: 'Seeed Studio XIAO ESP32C3',
    platform: 'espressif32',
    mcu: 'ESP32-C3',
    fcpu: '160MHz',
    ram: '400KB',
    rom: '4MB',
    vendor: 'Seeed Studio',
    frameworks: ['arduino', 'espidf'],
    category: 'ESP32-C3'
  },
  {
    id: 'seeed_xiao_esp32s3',
    name: 'Seeed Studio XIAO ESP32S3',
    platform: 'espressif32',
    mcu: 'ESP32-S3',
    fcpu: '240MHz',
    ram: '512KB',
    rom: '8MB',
    vendor: 'Seeed Studio',
    frameworks: ['arduino', 'espidf'],
    category: 'ESP32-S3'
  },
  {
    id: 'bluepill_f103c8',
    name: 'STM32F103C8 (BluePill 64K/128K)',
    platform: 'ststm32',
    mcu: 'STM32F103C8T6',
    fcpu: '72MHz',
    ram: '20KB',
    rom: '64KB',
    vendor: 'Generic STM32',
    frameworks: ['arduino', 'stm32cube', 'cmsis', 'libopencm3'],
    category: 'STM32'
  },
  {
    id: 'blackpill_f401cc',
    name: 'WeAct BlackPill V3.0 (STM32F401CC)',
    platform: 'ststm32',
    mcu: 'STM32F401CCU6',
    fcpu: '84MHz',
    ram: '64KB',
    rom: '256KB',
    vendor: 'WeAct Studio',
    frameworks: ['arduino', 'stm32cube', 'cmsis'],
    category: 'STM32'
  },
  {
    id: 'blackpill_f411ce',
    name: 'WeAct BlackPill V3.0 (STM32F411CE)',
    platform: 'ststm32',
    mcu: 'STM32F411CEU6',
    fcpu: '100MHz',
    ram: '128KB',
    rom: '512KB',
    vendor: 'WeAct Studio',
    frameworks: ['arduino', 'stm32cube', 'cmsis'],
    category: 'STM32'
  },
  {
    id: 'nucleo_f401re',
    name: 'ST Nucleo F401RE',
    platform: 'ststm32',
    mcu: 'STM32F401RET6',
    fcpu: '84MHz',
    ram: '96KB',
    rom: '512KB',
    vendor: 'STMicroelectronics',
    frameworks: ['arduino', 'stm32cube', 'cmsis', 'mbed'],
    category: 'STM32'
  },
  {
    id: 'pico',
    name: 'Raspberry Pi Pico (RP2040 Dual ARM Cortex-M0+)',
    platform: 'raspberrypi',
    mcu: 'RP2040',
    fcpu: '133MHz',
    ram: '264KB',
    rom: '2MB',
    vendor: 'Raspberry Pi',
    frameworks: ['arduino'],
    category: 'Raspberry Pi'
  },
  {
    id: 'uno',
    name: 'Arduino Uno (ATmega328P)',
    platform: 'atmelavr',
    mcu: 'ATmega328P',
    fcpu: '16MHz',
    ram: '2KB',
    rom: '32KB',
    vendor: 'Arduino',
    frameworks: ['arduino'],
    category: 'Arduino AVR'
  },
  {
    id: 'nanoatmega328',
    name: 'Arduino Nano (ATmega328P)',
    platform: 'atmelavr',
    mcu: 'ATmega328P',
    fcpu: '16MHz',
    ram: '2KB',
    rom: '32KB',
    vendor: 'Arduino',
    frameworks: ['arduino'],
    category: 'Arduino AVR'
  },
  {
    id: 'megaatmega2560',
    name: 'Arduino Mega 2560 (ATmega2560)',
    platform: 'atmelavr',
    mcu: 'ATmega2560',
    fcpu: '16MHz',
    ram: '8KB',
    rom: '256KB',
    vendor: 'Arduino',
    frameworks: ['arduino'],
    category: 'Arduino AVR'
  },
  {
    id: 'nodemcuv2',
    name: 'NodeMCU 1.0 (ESP-12E / ESP8266)',
    platform: 'espressif8266',
    mcu: 'ESP8266',
    fcpu: '80MHz',
    ram: '80KB',
    rom: '4MB',
    vendor: 'NodeMCU',
    frameworks: ['arduino'],
    category: 'ESP8266'
  }
];

export const CURATED_LIBS = [
  {
    name: 'bblanchon/ArduinoJson',
    version: '^7.0.0',
    description: '嵌入式高效 JSON 编解码库 (高效零拷贝，支持流式解析与过滤)',
    author: 'Benoit Blanchon',
    keywords: ['json', 'rest', 'data', 'stream']
  },
  {
    name: 'olikraus/U8g2',
    version: '^2.35.0',
    description: '单色 OLED 与 LCD 图形库 (SSD1306, SH1106, ST7920 等近百款屏)',
    author: 'Olikraus',
    keywords: ['display', 'oled', 'lcd', 'graphics']
  },
  {
    name: 'fastled/FastLED',
    version: '^3.6.0',
    description: '高性能可寻址 LED 彩灯控制库 (WS2812B, SK6812, APA102, 极速色彩动画)',
    author: 'FastLED Team',
    keywords: ['led', 'ws2812', 'rgb', 'neopixel']
  },
  {
    name: 'adafruit/Adafruit GFX Library',
    version: '^1.11.9',
    description: 'Adafruit 经典通用屏幕图形基础引擎 (画线/画圆/文字渲染)',
    author: 'Adafruit',
    keywords: ['display', 'graphics', 'font']
  },
  {
    name: 'adafruit/Adafruit SSD1306',
    version: '^2.5.9',
    description: 'I2C/SPI SSD1306 OLED 显示屏官方驱动库',
    author: 'Adafruit',
    keywords: ['display', 'oled', 'i2c', 'spi']
  },
  {
    name: 'adafruit/Adafruit NeoPixel',
    version: '^1.12.0',
    description: 'Adafruit WS2812/NeoPixel 单总线彩灯驱动库',
    author: 'Adafruit',
    keywords: ['led', 'rgb', 'ws2812']
  },
  {
    name: 'knolleary/PubSubClient',
    version: '^2.8.0',
    description: '轻量级嵌入式 MQTT 协议客户端 (极低 RAM 占用，IoT 联网标配)',
    author: 'Nick O\'Leary',
    keywords: ['mqtt', 'iot', 'network', 'cloud']
  },
  {
    name: 'lvgl/lvgl',
    version: '^9.0.0',
    description: 'LVGL 轻量级全功能现代嵌入式 GUI 图形框架 (支持复杂触控、动画与微件)',
    author: 'LVGL Team',
    keywords: ['gui', 'touch', 'display', 'ui']
  },
  {
    name: 'mathieucarbou/ESPAsyncWebServer',
    version: '^3.6.0',
    description: 'ESP32/ESP8266 高性能异步 WebServer 与 WebSocket 库 (支持 SSE/上传)',
    author: 'Mathieu Carbou',
    keywords: ['http', 'async', 'websocket', 'webserver']
  },
  {
    name: 'me-no-dev/AsyncTCP',
    version: '^1.1.1',
    description: 'ESP32 异步 TCP 基础网络通信库 (ESPAsyncWebServer 核心依赖)',
    author: 'me-no-dev',
    keywords: ['tcp', 'network', 'async', 'esp32']
  },
  {
    name: 'tzapu/WiFiManager',
    version: '^2.0.16-rc.2',
    description: 'ESP32/ESP8266 自动配网热点门户管理器 (免写死 Wi-Fi 密码)',
    author: 'tzapu',
    keywords: ['wifi', 'captive-portal', 'config', 'iot']
  },
  {
    name: 'bodmer/TFT_eSPI',
    version: '^2.5.43',
    description: 'ESP32 超高速硬件 SPI TFT 驱动库 (ST7789, ILI9341, ST7735 高刷专用)',
    author: 'Bodmer',
    keywords: ['tft', 'display', 'spi', 'esp32', 'fast']
  },
  {
    name: 'milesburton/DallasTemperature',
    version: '^3.11.0',
    description: 'DS18B20 1-Wire 数字温度传感器驱动库',
    author: 'Miles Burton',
    keywords: ['temperature', 'sensor', 'ds18b20', '1-wire']
  },
  {
    name: 'paulstoffregen/OneWire',
    version: '^2.3.8',
    description: 'Arduino 单总线 (1-Wire) 协议核心底层库',
    author: 'Paul Stoffregen',
    keywords: ['1-wire', 'protocol', 'sensor']
  },
  {
    name: 'h2zero/NimBLE-Arduino',
    version: '^1.4.1',
    description: '超省内存的 ESP32 低功耗蓝牙 BLE 驱动库 (比原生 Bluedroid 节省 100KB+ RAM)',
    author: 'h2zero',
    keywords: ['ble', 'bluetooth', 'low-power', 'esp32']
  },
  {
    name: 'mathertel/OneButton',
    version: '^2.5.0',
    description: '单按键多功能检测库 (单击、双击、长按、连击手势)',
    author: 'Matthias Hertel',
    keywords: ['button', 'input', 'event']
  },
  {
    name: 'madhephaestus/ESP32Servo',
    version: '^3.0.5',
    description: 'ESP32 高精度硬件 PWM 舵机/电机控制库',
    author: 'Kevin Harrington',
    keywords: ['servo', 'motor', 'pwm', 'esp32']
  },
  {
    name: 'adafruit/DHT sensor library',
    version: '^1.4.6',
    description: 'DHT11 / DHT22 / AM2302 温湿度传感器官方驱动库',
    author: 'Adafruit',
    keywords: ['dht11', 'dht22', 'sensor', 'humidity']
  },
  {
    name: 'adafruit/Adafruit BME280 Library',
    version: '^2.2.4',
    description: 'Bosch BME280 温湿度气压传感器官方驱动',
    author: 'Adafruit',
    keywords: ['bme280', 'sensor', 'i2c', 'pressure']
  },
  {
    name: 'adafruit/Adafruit MPU6050',
    version: '^2.2.6',
    description: 'MPU6050 六轴陀螺仪加速度计高精度读取库',
    author: 'Adafruit',
    keywords: ['mpu6050', 'gyro', 'accelerometer', 'i2c']
  }
];

/**
 * Robust INI Parser for PlatformIO configuration
 * Correctly parses multi-line values (like indented lib_deps, monitor_filters)
 */
export function parseIni(content) {
  const lines = content.split(/\r?\n/);
  const envs = [];
  let globalPlatformio = {};
  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith(';') || trimmed.startsWith('#')) {
      continue;
    }

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      const secName = trimmed.slice(1, -1).trim();
      if (secName.startsWith('env:')) {
        currentSection = {
          name: secName.slice(4).trim(),
          platform: '',
          board: '',
          framework: '',
          monitor_speed: '',
          upload_speed: '',
          monitor_filters: [],
          lib_deps: [],
          build_flags: [],
          options: {}
        };
        envs.push(currentSection);
      } else if (secName === 'platformio') {
        currentSection = { isGlobal: true, options: {} };
      } else {
        currentSection = { name: secName, options: {} };
      }
      continue;
    }

    if (currentSection) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        const multiLineValues = [];
        if (val) multiLineValues.push(val);

        // Check subsequent lines that are indented
        let j = i + 1;
        while (j < lines.length) {
          const nextRaw = lines[j];
          if (nextRaw.startsWith(' ') || nextRaw.startsWith('\t')) {
            const nextTrimmed = nextRaw.trim();
            if (nextTrimmed && !nextTrimmed.startsWith(';') && !nextTrimmed.startsWith('#')) {
              multiLineValues.push(nextTrimmed);
            }
            j++;
          } else {
            break;
          }
        }
        i = j - 1; // Advance loop

        if (currentSection.isGlobal) {
          currentSection.options[key] = multiLineValues.join(' ');
          if (key === 'default_envs') {
            globalPlatformio.default_envs = multiLineValues.join(' ').split(/[,\s]+/).filter(Boolean);
          }
        } else if (currentSection.name && !currentSection.isGlobal) {
          if (key === 'platform') currentSection.platform = multiLineValues[0] || '';
          else if (key === 'board') currentSection.board = multiLineValues[0] || '';
          else if (key === 'framework') currentSection.framework = multiLineValues[0] || '';
          else if (key === 'monitor_speed') currentSection.monitor_speed = multiLineValues[0] || '';
          else if (key === 'upload_speed') currentSection.upload_speed = multiLineValues[0] || '';
          else if (key === 'monitor_filters') {
            currentSection.monitor_filters = multiLineValues.flatMap(v => v.split(/[,\s]+/).filter(Boolean));
          } else if (key === 'lib_deps') {
            currentSection.lib_deps = multiLineValues;
          } else if (key === 'build_flags') {
            currentSection.build_flags = multiLineValues;
          } else {
            currentSection.options[key] = multiLineValues.length === 1 ? multiLineValues[0] : multiLineValues;
          }
        }
      }
    }
  }

  return { envs, global: globalPlatformio };
}

/**
 * Non-destructive INI updater for PlatformIO configuration
 * Preserves comments, file formatting, and untouched lines perfectly.
 */
export function updateIniEnv(iniText, envName, updates) {
  const lines = iniText.split(/\r?\n/);
  const targetHeader = '[env:' + envName + ']';
  let inTarget = false;
  let targetFound = false;
  const resultLines = [];
  const handledKeys = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      if (inTarget) {
        for (const [k, v] of Object.entries(updates)) {
          if (!handledKeys.has(k) && v !== undefined && v !== null && v !== '') {
            if (Array.isArray(v)) {
              if (v.length > 0) {
                resultLines.push(k + ' =');
                v.forEach(item => resultLines.push('    ' + item));
              }
            } else {
              resultLines.push(k + ' = ' + v);
            }
          }
        }
        inTarget = false;
      }

      if (trimmed === targetHeader) {
        inTarget = true;
        targetFound = true;
      }
      resultLines.push(line);
      continue;
    }

    if (inTarget) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1 && !trimmed.startsWith(';') && !trimmed.startsWith('#')) {
        const key = trimmed.slice(0, eqIdx).trim();
        // Collect continuation lines
        const continuation = [];
        let nextIdx = i + 1;
        while (nextIdx < lines.length && (lines[nextIdx].startsWith(' ') || lines[nextIdx].startsWith('\t'))) {
          continuation.push(lines[nextIdx]);
          nextIdx++;
        }

        if (key in updates) {
          i = nextIdx - 1; // Advance loop to skip old key and its continuation lines
          handledKeys.add(key);
          const val = updates[key];
          if (val !== undefined && val !== null && val !== '') {
            if (Array.isArray(val)) {
              if (val.length > 0) {
                resultLines.push(key + ' =');
                val.forEach(item => resultLines.push('    ' + item));
              }
            } else {
              resultLines.push(key + ' = ' + val);
            }
          }
          // If val is empty string or empty array, it is completely removed!
        } else {
          // Keep existing key AND its continuation lines!
          resultLines.push(line);
          continuation.forEach(c => resultLines.push(c));
          i = nextIdx - 1;
        }
        continue;
      }
    }

    resultLines.push(line);
  }

  if (inTarget) {
    for (const [k, v] of Object.entries(updates)) {
      if (!handledKeys.has(k) && v !== undefined && v !== null && v !== '') {
        if (Array.isArray(v)) {
          if (v.length > 0) {
            resultLines.push(k + ' =');
            v.forEach(item => resultLines.push('    ' + item));
          }
        } else {
          resultLines.push(k + ' = ' + v);
        }
      }
    }
  }

  if (!targetFound) {
    resultLines.push('');
    resultLines.push(targetHeader);
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined && v !== null && v !== '') {
        if (Array.isArray(v)) {
          if (v.length > 0) {
            resultLines.push(k + ' =');
            v.forEach(item => resultLines.push('    ' + item));
          }
        } else {
          resultLines.push(k + ' = ' + v);
        }
      }
    }
  }

  return resultLines.join('\n');
}

export class PioManager {
  constructor(options = {}) {
    this.pythonPath = options.pythonPath || 'python';
    this.workspaceRoot = options.workspaceRoot || process.cwd();
    this.activeTask = null;
    this.boardsCache = null;
    this.libsCache = new Map();
  }

  setPythonPath(p) {
    if (p && existsSync(p)) {
      this.pythonPath = p;
      return true;
    }
    return false;
  }

  setWorkspace(dir) {
    if (dir && existsSync(dir)) {
      this.workspaceRoot = dir;
      return { success: true, workspace: dir };
    }
    return { success: false, error: 'Directory does not exist' };
  }

  isPioProject(dir = this.workspaceRoot) {
    return existsSync(join(dir, 'platformio.ini'));
  }

  /**
   * Parse platformio.ini and return rich structured environments and options
   */
  async getProjectInfo(dir = this.workspaceRoot) {
    const iniPath = join(dir, 'platformio.ini');
    if (!existsSync(iniPath)) {
      return { isPio: false, dir, envs: [], rawIni: '' };
    }

    try {
      const content = await fs.readFile(iniPath, 'utf-8');
      const { envs, global } = parseIni(content);
      const firstEnv = envs[0] || {};

      return {
        isPio: true,
        dir,
        name: basename(dir),
        env: firstEnv.name || '',
        board: firstEnv.board || '',
        framework: firstEnv.framework || '',
        platform: firstEnv.platform || '',
        environments: envs,
        envs,
        defaultEnvs: global.default_envs || [],
        rawIni: content
      };
    } catch (err) {
      return { isPio: true, dir, error: err.message, envs: [], rawIni: '' };
    }
  }

  /**
   * Update specific configuration keys of an environment non-destructively
   */
  async updateProjectEnvConfig(envName, updates, dir = this.workspaceRoot) {
    const iniPath = join(dir, 'platformio.ini');
    if (!existsSync(iniPath)) {
      return { success: false, error: 'platformio.ini not found' };
    }

    try {
      const content = await fs.readFile(iniPath, 'utf8');
      const newContent = updateIniEnv(content, envName, updates);
      await fs.writeFile(iniPath, newContent, 'utf8');
      const updatedProject = await this.getProjectInfo(dir);
      return { success: true, project: updatedProject };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Scan workspace storage and local directories for PlatformIO projects
   */
  async listProjects() {
    const projects = [];
    const seenDirs = new Set();

    const addIfPio = (dir, source = 'workspace') => {
      const resolved = resolve(dir);
      if (seenDirs.has(resolved)) return;
      seenDirs.add(resolved);
      if (existsSync(join(resolved, 'platformio.ini'))) {
        try {
          const ini = readFileSync(join(resolved, 'platformio.ini'), 'utf8');
          const envMatches = Array.from(ini.matchAll(/\[env:([^\]]+)\]/g)).map(m => m[1]);
          projects.push({
            name: basename(resolved),
            path: resolved,
            envs: envMatches,
            source,
            isCurrent: resolved.toLowerCase() === this.workspaceRoot.toLowerCase()
          });
        } catch (e) {
          projects.push({
            name: basename(resolved),
            path: resolved,
            envs: [],
            source,
            isCurrent: resolved.toLowerCase() === this.workspaceRoot.toLowerCase()
          });
        }
      }
    };

    // 1. Current workspace
    if (this.workspaceRoot) {
      addIfPio(this.workspaceRoot, 'current');
    }

    // 2. DSH workspace storage
    try {
      const wsFile = join(homedir(), '.dsh', 'storages', 'workspace.json');
      if (existsSync(wsFile)) {
        const data = JSON.parse(readFileSync(wsFile, 'utf8'));
        const workspaces = data?.tables?.workspaces || {};
        for (const ws of Object.values(workspaces)) {
          if (ws.path && existsSync(ws.path)) {
            addIfPio(ws.path, 'dsh');
          }
        }
      }
    } catch (e) {}

    // 3. Scan C:\Users\yaan\Documents\deepseek
    try {
      const parentDir = 'C:\\Users\\yaan\\Documents\\deepseek';
      if (existsSync(parentDir)) {
        const entries = readdirSync(parentDir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            addIfPio(join(parentDir, entry.name), 'deepseek');
          }
        }
      }
    } catch (e) {}

    return { success: true, projects, currentWorkspace: this.workspaceRoot };
  }

  /**
   * Search available board models (instant curated + dynamic CLI)
   */
  async searchBoards(query = '') {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { success: true, boards: CURATED_BOARDS };
    }

    // Filter curated boards first (0ms)
    const curatedMatches = CURATED_BOARDS.filter(b =>
      b.id.toLowerCase().includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.mcu.toLowerCase().includes(q) ||
      b.platform.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    );

    // Also run CLI search with timeout
    return new Promise((resolveResult) => {
      let settled = false;
      const timeoutTimer = setTimeout(() => {
        if (!settled) {
          settled = true;
          resolveResult({ success: true, boards: curatedMatches });
        }
      }, 4000);

      try {
        const proc = spawn(this.pythonPath, ['-m', 'platformio', 'boards', q, '--json-output'], { shell: false });
        let stdout = '';
        proc.stdout.on('data', d => stdout += d);
        proc.on('close', (code) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeoutTimer);

          if (code === 0 && stdout) {
            try {
              const rawBoards = JSON.parse(stdout);
              const mapped = rawBoards.map(b => ({
                id: b.id,
                name: b.name,
                platform: b.platform,
                mcu: b.mcu || 'Unknown',
                fcpu: b.fcpu ? `${Math.round(b.fcpu / 1e6)}MHz` : 'N/A',
                ram: b.ram ? `${Math.round(b.ram / 1024)}KB` : 'N/A',
                rom: b.rom ? `${Math.round(b.rom / 1024)}KB` : 'N/A',
                vendor: b.vendor || 'Generic',
                frameworks: b.frameworks || ['arduino'],
                category: b.platform
              }));

              const ids = new Set(curatedMatches.map(c => c.id));
              const combined = [...curatedMatches];
              for (const b of mapped) {
                if (!ids.has(b.id)) {
                  ids.add(b.id);
                  combined.push(b);
                }
              }

              resolveResult({ success: true, boards: combined.slice(0, 40) });
              return;
            } catch (e) {}
          }
          resolveResult({ success: true, boards: curatedMatches });
        });
        proc.on('error', () => {
          if (!settled) {
            settled = true;
            clearTimeout(timeoutTimer);
            resolveResult({ success: true, boards: curatedMatches });
          }
        });
      } catch (err) {
        if (!settled) {
          settled = true;
          clearTimeout(timeoutTimer);
          resolveResult({ success: true, boards: curatedMatches });
        }
      }
    });
  }

  /**
   * Search libraries (instant curated + dynamic CLI search with autocomplete)
   */
  async searchLibraries(query = '') {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { success: true, libs: CURATED_LIBS };
    }

    // Filter curated libraries first (0ms)
    const curatedMatches = CURATED_LIBS.filter(lib =>
      lib.name.toLowerCase().includes(q) ||
      lib.description.toLowerCase().includes(q) ||
      lib.author.toLowerCase().includes(q) ||
      (lib.keywords && lib.keywords.some(k => k.toLowerCase().includes(q)))
    );

    // If cached for this query, return immediately
    if (this.libsCache.has(q)) {
      return { success: true, libs: this.libsCache.get(q) };
    }

    return new Promise((resolveResult) => {
      let settled = false;
      const timeoutTimer = setTimeout(() => {
        if (!settled) {
          settled = true;
          resolveResult({ success: true, libs: curatedMatches });
        }
      }, 4000);

      try {
        const proc = spawn(this.pythonPath, ['-m', 'platformio', 'lib', 'search', q, '--json-output'], { shell: false });
        let stdout = '';
        proc.stdout.on('data', d => stdout += d);
        proc.on('close', (code) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeoutTimer);

          if (code === 0 && stdout) {
            try {
              const res = JSON.parse(stdout);
              const items = Array.isArray(res) ? res : (res.items || []);
              const mapped = items.map(item => ({
                name: item.ownername ? `${item.ownername}/${item.name}` : item.name,
                rawName: item.name,
                version: item.versionname ? `^${item.versionname}` : '^1.0.0',
                author: (item.authornames && item.authornames.length) ? item.authornames.join(', ') : (item.ownername || 'Community'),
                description: item.description || '',
                keywords: item.keywords || []
              }));

              const names = new Set(curatedMatches.map(c => c.name.toLowerCase()));
              const combined = [...curatedMatches];
              for (const m of mapped) {
                if (!names.has(m.name.toLowerCase())) {
                  names.add(m.name.toLowerCase());
                  combined.push(m);
                }
              }

              this.libsCache.set(q, combined.slice(0, 30));
              resolveResult({ success: true, libs: combined.slice(0, 30) });
              return;
            } catch (e) {}
          }
          resolveResult({ success: true, libs: curatedMatches });
        });
        proc.on('error', () => {
          if (!settled) {
            settled = true;
            clearTimeout(timeoutTimer);
            resolveResult({ success: true, libs: curatedMatches });
          }
        });
      } catch (err) {
        if (!settled) {
          settled = true;
          clearTimeout(timeoutTimer);
          resolveResult({ success: true, libs: curatedMatches });
        }
      }
    });
  }

  /**
   * Initialize a new PlatformIO Project for ANY board and framework
   */
  async initProject({ dir, board, framework, projectName, name }) {
    const projName = (projectName || name || '').trim();
    let targetDir = dir ? dir.trim() : '';
    if (!targetDir) {
      targetDir = this.workspaceRoot || process.cwd();
    }
    // If projName is provided and targetDir doesn't already end with projName, join them
    if (projName && basename(targetDir).toLowerCase() !== projName.toLowerCase()) {
      targetDir = join(targetDir, projName);
    }

    if (!board) {
      return { success: false, error: 'Target board ID is required' };
    }

    try {
      if (!existsSync(targetDir)) {
        await fs.mkdir(targetDir, { recursive: true });
      }

      const iniPath = join(targetDir, 'platformio.ini');
      const args = ['project', 'init', '-d', targetDir, '-b', board, '--no-install-dependencies'];
      if (framework) {
        args.push('-O', `framework=${framework}`);
      }

      await new Promise((resolvePromise, rejectPromise) => {
        const proc = spawn(this.pythonPath, ['-m', 'platformio', ...args], { shell: false });
        let out = '';
        let errOut = '';
        proc.stdout.on('data', d => out += d);
        proc.stderr.on('data', d => errOut += d);
        proc.on('close', (code) => {
          if (code === 0) resolvePromise();
          else rejectPromise(new Error(errOut || out || `pio project init exited with code ${code}`));
        });
        proc.on('error', rejectPromise);
      });

      // Enhance platformio.ini with sensible defaults if needed
      if (existsSync(iniPath)) {
        let iniContent = await fs.readFile(iniPath, 'utf8');
        if (!iniContent.includes('monitor_speed')) {
          iniContent += '\n; 串口监视器波特率默认配置\nmonitor_speed = 115200\n';
          await fs.writeFile(iniPath, iniContent, 'utf8');
        }
      }

      // Create starter code if src is empty
      const srcDir = join(targetDir, 'src');
      if (!existsSync(srcDir)) await fs.mkdir(srcDir, { recursive: true });
      const mainCpp = join(srcDir, 'main.cpp');
      const mainC = join(srcDir, 'main.c');

      if (!existsSync(mainCpp) && !existsSync(mainC)) {
        const starterCode = this.generateStarterCode(board, framework, projName || basename(targetDir));
        await fs.writeFile(mainCpp, starterCode, 'utf8');
      }

      // Set this as the active workspace
      this.workspaceRoot = targetDir;

      return {
        success: true,
        dir: targetDir,
        board,
        framework,
        message: `成功初始化工程 [${projName || basename(targetDir)}] (${board})`
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  generateStarterCode(board, framework, name) {
    const isStm32 = board.toLowerCase().includes('stm32') || board.toLowerCase().includes('pill') || board.toLowerCase().includes('nucleo');
    const isPico = board.toLowerCase().includes('pico') || board.toLowerCase().includes('rp2040');
    const isAvr = board.toLowerCase().includes('uno') || board.toLowerCase().includes('nano') || board.toLowerCase().includes('mega');

    let ledPin = 'LED_BUILTIN';
    if (isStm32) ledPin = 'PC13';
    else if (isPico) ledPin = '25';
    else if (isAvr) ledPin = '13';
    else ledPin = '2'; // ESP32 default

    return `/**
 * ${name} - PlatformIO Embedded Application
 * Target Board: ${board}
 * Framework: ${framework || 'arduino'}
 */
#include <Arduino.h>

#ifndef ${ledPin}
#define LED_PIN 2
#else
#define LED_PIN ${ledPin}
#endif

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(115200);
  delay(1000);
  Serial.println("");
  Serial.println("==========================================");
  Serial.println("Hello from ${name}!");
  Serial.println("Board: ${board}");
  Serial.println("PlatformIO System Initialized Successfully.");
  Serial.println("==========================================");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  Serial.println("[TICK] LED ON");
  delay(500);

  digitalWrite(LED_PIN, LOW);
  Serial.println("[TICK] LED OFF");
  delay(500);
}
`;
  }

  /**
   * Save edited platformio.ini raw content
   */
  async saveProjectIni(rawContent, dir = this.workspaceRoot) {
    const iniPath = join(dir, 'platformio.ini');
    try {
      await fs.writeFile(iniPath, rawContent, 'utf8');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Add a new environment block to platformio.ini
   */
  async addEnvironment({ name, board, framework, platform, options = {}, dir = this.workspaceRoot }) {
    const iniPath = join(dir, 'platformio.ini');
    if (!existsSync(iniPath)) {
      return { success: false, error: 'platformio.ini not found' };
    }

    try {
      let content = await fs.readFile(iniPath, 'utf8');
      const envHeader = `[env:${name}]`;
      if (content.includes(envHeader)) {
        return { success: false, error: `Environment [env:${name}] already exists` };
      }

      let addition = `\n\n${envHeader}\n`;
      if (platform) addition += `platform = ${platform}\n`;
      if (board) addition += `board = ${board}\n`;
      if (framework) addition += `framework = ${framework}\n`;

      for (const [k, v] of Object.entries(options)) {
        if (v) addition += `${k} = ${v}\n`;
      }

      content += addition;
      await fs.writeFile(iniPath, content, 'utf8');
      return { success: true, message: `Environment [env:${name}] added successfully` };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Append library to lib_deps of target environment
   */
  async addLibraryDependency(libName, targetEnv, dir = this.workspaceRoot) {
    const project = await this.getProjectInfo(dir);
    if (!project.isPio) {
      return { success: false, error: 'platformio.ini not found' };
    }

    const env = project.envs.find(e => !targetEnv || e.name === targetEnv) || project.envs[0];
    if (!env) {
      return { success: false, error: 'No environment found to add library' };
    }

    const currentLibs = [...(env.lib_deps || [])];
    if (currentLibs.some(l => l.includes(libName))) {
      return { success: true, message: `依赖库 ${libName} 已存在于 [env:${env.name}]` };
    }

    currentLibs.push(libName);
    return await this.updateProjectEnvConfig(env.name, { lib_deps: currentLibs }, dir);
  }

  /**
   * Remove library from lib_deps of target environment
   */
  async removeLibraryDependency(libName, targetEnv, dir = this.workspaceRoot) {
    const project = await this.getProjectInfo(dir);
    if (!project.isPio) {
      return { success: false, error: 'platformio.ini not found' };
    }

    const env = project.envs.find(e => !targetEnv || e.name === targetEnv) || project.envs[0];
    if (!env) {
      return { success: false, error: 'No environment found' };
    }

    const currentLibs = (env.lib_deps || []).filter(l => l.trim() !== libName.trim());
    return await this.updateProjectEnvConfig(env.name, { lib_deps: currentLibs }, dir);
  }

  async listDevices() {
    return new Promise((resolveResult) => {
      if (this.pythonPath && existsSync(this.pythonPath)) {
        const pyCode = 'import serial.tools.list_ports, json; print(json.dumps([{"port": p.device, "description": p.description or "", "hwid": p.hwid or "", "vid": f"{p.vid:04X}" if p.vid else None, "pid": f"{p.pid:04X}" if p.pid else None, "manufacturer": p.manufacturer or ""} for p in serial.tools.list_ports.comports()]))';
        try {
          const pyProc = spawn(this.pythonPath, ['-c', pyCode], { shell: false });
          let pyOut = '';
          pyProc.stdout.on('data', c => pyOut += c);
          pyProc.on('close', (code) => {
            if (code === 0 && pyOut.trim()) {
              try {
                const rawPorts = JSON.parse(pyOut.trim());
                const devices = rawPorts.map(p => {
                  const desc = (p.description || '').toLowerCase();
                  const hwid = (p.hwid || '').toLowerCase();
                  const isUsb = Boolean(p.vid || hwid.includes('usb') || desc.includes('cp210') || desc.includes('ch34') || desc.includes('uart') || desc.includes('ftdi') || desc.includes('silicon'));
                  const isBt = desc.includes('蓝牙') || desc.includes('bluetooth') || hwid.includes('bthenum');
                  const isAcpi = hwid.includes('acpi') || desc.includes('通信端口');
                  let chip = 'Serial';
                  if (desc.includes('cp210') || hwid.includes('10c4:ea60')) chip = 'CP210x';
                  else if (desc.includes('ch34') || hwid.includes('1a86:7523')) chip = 'CH340';
                  else if (desc.includes('ftdi')) chip = 'FTDI';
                  else if (desc.includes('jtag') || desc.includes('esp32')) chip = 'ESP32 CDC';
                  
                  return {
                    ...p,
                    isUsb,
                    isBt,
                    isAcpi,
                    chip,
                    label: `${p.port} (${p.description || '设备'})${isUsb ? ' [USB]' : ''}`
                  };
                });

                devices.sort((a, b) => {
                  if (a.isUsb && !b.isUsb) return -1;
                  if (!a.isUsb && b.isUsb) return 1;
                  return a.port.localeCompare(b.port, undefined, { numeric: true });
                });

                resolveResult({ success: true, devices });
                return;
              } catch (e) {}
            }
            this.fallbackDeviceList(resolveResult);
          });
          pyProc.on('error', () => {
            this.fallbackDeviceList(resolveResult);
          });
          return;
        } catch (e) {
          this.fallbackDeviceList(resolveResult);
          return;
        }
      }
      this.fallbackDeviceList(resolveResult);
    });
  }

  fallbackDeviceList(resolveResult) {
    try {
      const proc = spawn(this.pythonPath, ['-m', 'platformio', 'device', 'list', '--json-output'], { shell: false });
      let stdout = '';
      proc.stdout.on('data', d => stdout += d);
      proc.on('close', (code) => {
        if (code === 0 && stdout) {
          try {
            const raw = JSON.parse(stdout);
            const devices = raw.map(p => {
              const desc = (p.description || '').toLowerCase();
              const hwid = (p.hwid || '').toLowerCase();
              const isUsb = Boolean(hwid.includes('usb') || desc.includes('cp210') || desc.includes('ch34') || desc.includes('uart') || desc.includes('ftdi') || desc.includes('silicon'));
              const isBt = desc.includes('蓝牙') || desc.includes('bluetooth') || hwid.includes('bthenum');
              const isAcpi = hwid.includes('acpi') || desc.includes('通信端口');
              let chip = 'Serial';
              if (desc.includes('cp210') || hwid.includes('10c4:ea60')) chip = 'CP210x';
              else if (desc.includes('ch34') || hwid.includes('1a86:7523')) chip = 'CH340';
              else if (desc.includes('ftdi')) chip = 'FTDI';
              else if (desc.includes('jtag') || desc.includes('esp32')) chip = 'ESP32 CDC';
              return {
                ...p,
                isUsb,
                isBt,
                isAcpi,
                chip,
                label: `${p.port} (${p.description || '设备'})${isUsb ? ' [USB]' : ''}`
              };
            });
            devices.sort((a, b) => {
              if (a.isUsb && !b.isUsb) return -1;
              if (!a.isUsb && b.isUsb) return 1;
              return a.port.localeCompare(b.port, undefined, { numeric: true });
            });
            resolveResult({ success: true, devices });
            return;
          } catch (e) {}
        }
        resolveResult({ success: true, devices: [] });
      });
      proc.on('error', (err) => {
        resolveResult({ success: false, error: err.message, devices: [] });
      });
    } catch (err) {
      resolveResult({ success: false, error: err.message, devices: [] });
    }
  }

  /**
   * Run a PlatformIO task (build, upload, clean, compiledb, check, size, etc.)
   */
  runTask({ task, env, port, extraArgs = [], onOutput, onFinish }) {
    if (this.activeTask) {
      return { success: false, error: 'A PlatformIO task is already running' };
    }

    const args = ['run'];
    if (env) {
      args.push('-e', env);
    }

    switch (task) {
      case 'build':
        break;
      case 'upload':
        args.push('-t', 'upload');
        if (port) {
          args.push('--upload-port', port);
        }
        break;
      case 'clean':
        args.push('-t', 'clean');
        break;
      case 'compiledb':
        args.push('-t', 'compiledb');
        break;
      case 'size':
        args.push('-t', 'sizedata');
        break;
      case 'check':
        return this.runPioCommand(['check'], onOutput, onFinish);
      default:
        if (task) args.push('-t', task);
        if (port && task && task.includes('upload')) {
          args.push('--upload-port', port);
        }
        break;
    }

    if (extraArgs && extraArgs.length > 0) {
      args.push(...extraArgs);
    }

    return this.runPioCommand(args, onOutput, onFinish);
  }

  runPioCommand(args, onOutput, onFinish) {
    try {
      const proc = spawn(this.pythonPath, ['-m', 'platformio', ...args], {
        cwd: this.workspaceRoot,
        shell: false
      });

      this.activeTask = {
        process: proc,
        args,
        startTime: Date.now()
      };

      proc.stdout.on('data', (chunk) => {
        const text = chunk.toString('utf-8');
        if (onOutput) onOutput({ text, stream: 'stdout' });
      });

      proc.stderr.on('data', (chunk) => {
        const text = chunk.toString('utf-8');
        if (onOutput) onOutput({ text, stream: 'stderr' });
      });

      proc.on('close', (code) => {
        this.activeTask = null;
        if (onFinish) onFinish({ code, success: code === 0 });
      });

      proc.on('error', (err) => {
        this.activeTask = null;
        if (onFinish) onFinish({ code: -1, success: false, error: err.message });
      });

      return { success: true, started: true };
    } catch (err) {
      this.activeTask = null;
      return { success: false, error: err.message };
    }
  }

  stopTask() {
    if (this.activeTask && this.activeTask.process) {
      try {
        this.activeTask.process.kill();
        this.activeTask = null;
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
    return { success: false, error: 'No active task' };
  }
}
