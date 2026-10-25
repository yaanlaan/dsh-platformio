# -*- coding: utf-8 -*-
"""
PlatformIO Serial Worker for DeepSeek Harness (dsh-pio)
Runs in background and bridges serial port communication over stdio.
"""
import sys
import time
import argparse
import threading
import serial

def read_serial_loop(ser):
    buf = bytearray()
    last_read = time.time()
    while ser.is_open:
        try:
            waiting = ser.in_waiting
            raw = ser.read(waiting if waiting > 0 else 1)
            if raw:
                buf.extend(raw)
                last_read = time.time()
                while b'\n' in buf:
                    idx = buf.index(b'\n')
                    line = buf[:idx + 1]
                    del buf[:idx + 1]
                    sys.stdout.buffer.write(line)
                    sys.stdout.buffer.flush()
            else:
                # Flush incomplete prompt if idle for > 250ms
                if buf and (time.time() - last_read > 0.25):
                    sys.stdout.buffer.write(buf)
                    sys.stdout.buffer.flush()
                    buf.clear()
        except Exception as e:
            sys.stderr.write(f"\n[SERIAL_ERROR] Read error: {e}\n")
            sys.stderr.flush()
            break

def main():
    parser = argparse.ArgumentParser(description="dsh-pio serial bridge worker")
    parser.add_argument("--port", required=True, help="COM port name (e.g. COM3)")
    parser.add_argument("--baud", type=int, default=115200, help="Baud rate (e.g. 115200)")
    args = parser.parse_args()

    try:
        ser = serial.Serial(
            port=args.port,
            baudrate=args.baud,
            timeout=0.2,
            write_timeout=1.0,
            rtscts=False,
            dsrdtr=False
        )
        # Default DTR/RTS states for normal running ESP32
        ser.setDTR(False)
        ser.setRTS(False)
    except Exception as e:
        sys.stderr.write(f"[SERIAL_OPEN_FAILED] {e}\n")
        sys.stderr.flush()
        sys.exit(1)

    sys.stderr.write(f"[SERIAL_OPENED] {args.port} at {args.baud}\n")
    sys.stderr.flush()

    reader_thread = threading.Thread(target=read_serial_loop, args=(ser,), daemon=True)
    reader_thread.start()

    # Process stdin commands from parent Node.js process
    try:
        while True:
            line = sys.stdin.readline()
            if not line:
                break
            line = line.rstrip("\r\n")
            if line == "CLOSE":
                break
            elif line == "RESET":
                # Hardware reset ESP32 (EN pin pulse)
                ser.setDTR(False)
                ser.setRTS(True)
                time.sleep(0.12)
                ser.setDTR(True)
                ser.setRTS(False)
                time.sleep(0.1)
                sys.stderr.write("[SERIAL_RESET_DONE]\n")
                sys.stderr.flush()
            elif line == "BOOTLOADER":
                # Enter bootloader mode (GPIO0 low + EN pulse)
                ser.setDTR(False)
                ser.setRTS(True)
                time.sleep(0.1)
                ser.setDTR(True)
                ser.setRTS(True)
                time.sleep(0.1)
                ser.setRTS(False)
                sys.stderr.write("[SERIAL_BOOTLOADER_DONE]\n")
                sys.stderr.flush()
            elif line.startswith("SEND:"):
                payload = line[5:]
                # Convert escape sequences like \r, \n
                payload = payload.encode('utf-8').decode('unicode_escape')
                ser.write(payload.encode('utf-8'))
                ser.flush()
            elif line.startswith("SET_BAUD:"):
                try:
                    new_baud = int(line[9:])
                    ser.baudrate = new_baud
                    sys.stderr.write(f"[SERIAL_BAUD_CHANGED] {new_baud}\n")
                    sys.stderr.flush()
                except Exception as ex:
                    sys.stderr.write(f"[SERIAL_ERROR] Change baud failed: {ex}\n")
                    sys.stderr.flush()
    except Exception as e:
        sys.stderr.write(f"[SERIAL_WORKER_ERROR] {e}\n")
        sys.stderr.flush()
    finally:
        try:
            if ser.is_open:
                ser.close()
        except Exception:
            pass
        sys.stderr.write("[SERIAL_CLOSED]\n")
        sys.stderr.flush()

if __name__ == "__main__":
    main()
