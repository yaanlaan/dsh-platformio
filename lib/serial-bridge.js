/**
 * dsh-pio Serial Bridge Manager
 * Manages active serial port worker, SSE streaming, and automatic upload handoff.
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import { EventEmitter } from 'node:events';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class SerialBridge extends EventEmitter {
  constructor(options = {}) {
    super();
    this.pythonPath = options.pythonPath || 'python';
    this.workerPath = join(__dirname, 'serial_worker.py');
    this.process = null;
    this.port = null;
    this.baud = 115200;
    this.connected = false;
    this.pausedForUpload = false;
    this.savedState = null;
    this.logBuffer = [];
    this.maxBufferSize = 2000;
    this.seqId = 0;
  }

  setPythonPath(p) {
    if (p && existsSync(p)) {
      this.pythonPath = p;
    }
  }

  getStatus() {
    return {
      connected: this.connected,
      port: this.port,
      baud: this.baud,
      baudrate: this.baud,
      pausedForUpload: this.pausedForUpload,
      bufferLength: this.logBuffer.length
    };
  }

  getLogs(sinceId = 0) {
    if (!sinceId || sinceId <= 0) return this.logBuffer;
    return this.logBuffer.filter(l => (l.id || 0) > sinceId);
  }

  open(port, baud = 115200) {
    if (this.process) {
      if (this.port === port && this.baud === baud && this.connected) {
        return Promise.resolve({ success: true, message: 'Already connected' });
      }
      this.close();
    }

    this.port = port;
    this.baud = baud;

    return new Promise((resolve) => {
      let resolved = false;
      const finish = (result) => {
        if (!resolved) {
          resolved = true;
          resolve(result);
        }
      };

      try {
        this.process = spawn(this.pythonPath, [this.workerPath, '--port', port, '--baud', String(baud)], {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let lineBuffer = '';
        let flushTimeout = null;

        const emitLine = (text) => {
          this.seqId = (this.seqId || 0) + 1;
          const timestamp = new Date().toISOString().substring(11, 23);
          const entry = { id: this.seqId, text, timestamp, time: Date.now() };

          this.logBuffer.push(entry);
          if (this.logBuffer.length > this.maxBufferSize) {
            this.logBuffer.shift();
          }

          this.emit('data', entry);
        };

        this.process.stdout.on('data', (chunk) => {
          lineBuffer += chunk.toString('utf-8');
          const lines = lineBuffer.split('\n');
          if (lines.length > 1) {
            lineBuffer = lines.pop();
            for (const line of lines) {
              const clean = line.replace(/\r$/, '');
              emitLine(clean);
            }
          }
          if (flushTimeout) clearTimeout(flushTimeout);
          if (lineBuffer) {
            flushTimeout = setTimeout(() => {
              if (lineBuffer) {
                const clean = lineBuffer.replace(/\r$/, '');
                emitLine(clean);
                lineBuffer = '';
              }
            }, 300);
          }
        });

        this.process.stderr.on('data', (chunk) => {
          const msg = chunk.toString('utf-8');
          if (msg.includes('[SERIAL_OPENED]')) {
            this.connected = true;
            this.emit('status', this.getStatus());
            finish({ success: true, port, baud });
          } else if (msg.includes('[SERIAL_OPEN_FAILED]')) {
            this.connected = false;
            this.emit('status', this.getStatus());
            finish({ success: false, error: msg.replace('[SERIAL_OPEN_FAILED]', '').trim() });
          } else if (msg.includes('[SERIAL_RESET_DONE]')) {
            this.emit('system', { type: 'reset_done' });
          } else if (msg.includes('[SERIAL_ERROR]')) {
            this.emit('error', msg.replace('[SERIAL_ERROR]', '').trim());
          }
        });

        this.process.on('close', (code) => {
          this.connected = false;
          this.process = null;
          this.emit('status', this.getStatus());
          this.emit('closed', code);
          finish({ success: false, error: `Worker exited with code ${code}` });
        });

        this.process.on('error', (err) => {
          this.connected = false;
          this.process = null;
          this.emit('status', this.getStatus());
          finish({ success: false, error: err.message });
        });

        // Timeout fallback
        setTimeout(() => {
          if (!resolved) {
            if (this.connected) {
              finish({ success: true, port, baud });
            } else {
              finish({ success: false, error: 'Connection timeout' });
            }
          }
        }, 3000);
      } catch (err) {
        this.connected = false;
        finish({ success: false, error: err.message });
      }
    });
  }

  write(text, ending = '\r\n') {
    if (!this.process || !this.connected) {
      return { success: false, error: 'Serial port is not connected' };
    }
    try {
      const full = text + (ending || '');
      // Escaping for line-based stdin protocol
      const escaped = full.replace(/\\/g, '\\\\').replace(/\r/g, '\\r').replace(/\n/g, '\\n');
      this.process.stdin.write(`SEND:${escaped}\n`);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  reset() {
    if (!this.process || !this.connected) {
      return { success: false, error: 'Serial port is not connected' };
    }
    try {
      this.process.stdin.write('RESET\n');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  bootloader() {
    if (!this.process || !this.connected) {
      return { success: false, error: 'Serial port is not connected' };
    }
    try {
      this.process.stdin.write('BOOTLOADER\n');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  clear() {
    this.logBuffer = [];
    this.emit('cleared');
    return { success: true };
  }

  close() {
    if (this.process) {
      try {
        this.process.stdin.write('CLOSE\n');
      } catch (e) {}
      setTimeout(() => {
        if (this.process) {
          try {
            this.process.kill();
          } catch (e) {}
          this.process = null;
        }
      }, 500);
    }
    this.connected = false;
    this.emit('status', this.getStatus());
    return { success: true };
  }

  /**
   * Prepares for upload: pauses and releases COM port so esptool can flash.
   */
  async pauseForUpload(targetPort) {
    if (this.connected && (!targetPort || targetPort === this.port)) {
      this.savedState = {
        port: this.port,
        baud: this.baud
      };
      this.pausedForUpload = true;
      this.emit('status', this.getStatus());
      this.close();
      // Allow OS to fully close COM port handle
      await new Promise(r => setTimeout(r, 400));
      return true;
    }
    return false;
  }

  /**
   * Resumes serial monitor after upload completes.
   */
  async resumeAfterUpload() {
    if (this.pausedForUpload && this.savedState) {
      const { port, baud } = this.savedState;
      this.pausedForUpload = false;
      this.savedState = null;
      // Wait for ESP32 boot
      await new Promise(r => setTimeout(r, 600));
      return await this.open(port, baud);
    }
    this.pausedForUpload = false;
    this.savedState = null;
    return false;
  }
}
