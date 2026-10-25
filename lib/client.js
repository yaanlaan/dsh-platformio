// DeepSeek Harness dsh-platformio Plugin - Client Bundle (Zero Emojis, Native Bottom Panel & Sidebar)
(function() {
  function factory(require) {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    const React = require("react");

    // ==========================================
    // 1. UI Styles
    // ==========================================
    /**
 * DeepSeek Harness PlatformIO Plugin - CSS Styles
 * Adaptive to DeepSeek Harness Light / Dark Themes & Responsive Widths
 * Zero Emojis - Professional VSCode/PlatformIO Experience
 */

const PIO_STYLES = `
/* ==========================================================================
   PlatformIO Native Workbench & Sidebar Styles (Adaptive Theme & Width)
   ========================================================================== */

.dsh-pio-workbench {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--dsw-alias-bg-base, #141414);
  color: var(--dsw-alias-label-primary, #cccccc);
  font-family: var(--dsw-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
  font-size: 12px;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
}

/* --- Top Toolbar --- */
.dsh-pio-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  background: var(--dsw-alias-bg-layer-1, #1a1a1a);
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));
  flex-shrink: 0;
  gap: 6px;
  flex-wrap: wrap;
}

.dsh-pio-topbar-left,
.dsh-pio-topbar-right {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.dsh-pio-brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 7px;
  background: rgba(230, 126, 34, 0.15);
  border: 1px solid rgba(230, 126, 34, 0.35);
  border-radius: var(--dsw-radius-xs, 4px);
  font-weight: 600;
  font-size: 11px;
  color: #f39c12;
  letter-spacing: 0.5px;
}

.dsh-pio-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background: var(--dsw-alias-bg-layer-2, rgba(255, 255, 255, 0.06));
  border: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.1));
  border-radius: var(--dsw-radius-xs, 3px);
  font-size: 11px;
  color: var(--dsw-alias-label-secondary, #999999);
  font-family: var(--dsh-font-family-code-default, "SF Mono", Consolas, monospace);
  white-space: nowrap;
}

/* --- Action Buttons --- */
.dsh-pio-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  height: 24px;
  background: var(--dsw-alias-bg-layer-2, #242424);
  color: var(--dsw-alias-label-primary, #cccccc);
  border: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.12));
  border-radius: var(--dsw-radius-xs, 4px);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
  white-space: nowrap;
  box-sizing: border-box;
}

.dsh-pio-btn:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-3, #323232));
  border-color: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.2));
  color: var(--dsw-alias-label-primary, #ffffff);
}

.dsh-pio-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.dsh-pio-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.dsh-pio-btn-primary {
  background: var(--dsw-alias-button-primary-fill, var(--dsw-alias-brand-primary, #10b981));
  border-color: var(--dsw-alias-button-primary-fill, var(--dsw-alias-brand-primary, #10b981));
  color: var(--dsw-alias-brand-text, #ffffff);
}

.dsh-pio-btn-primary:hover:not(:disabled) {
  background: var(--dsw-alias-button-primary-hover, #34d399);
  border-color: var(--dsw-alias-button-primary-hover, #34d399);
  color: var(--dsw-alias-brand-text, #ffffff);
}

.dsh-pio-btn-success {
  background: #1e7e34;
  border-color: #28a745;
  color: #ffffff;
}

.dsh-pio-btn-success:hover:not(:disabled) {
  background: #28a745;
  border-color: #34ce57;
}

.dsh-pio-btn-danger {
  background: #a81c1c;
  border-color: #c42b2b;
  color: #ffffff;
}

.dsh-pio-btn-danger:hover:not(:disabled) {
  background: #c42b2b;
  border-color: #e03636;
}

/* --- Select & Text Inputs --- */
.dsh-pio-select {
  height: 24px;
  padding: 2px 6px;
  background: var(--dsw-alias-bg-layer-2, #202020);
  color: var(--dsw-alias-label-primary, #cccccc);
  border: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.12));
  border-radius: var(--dsw-radius-xs, 4px);
  font-size: 11px;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
}

.dsh-pio-select:focus {
  border-color: var(--dsw-alias-brand-primary, #10b981);
}

.dsh-pio-input {
  height: 24px;
  padding: 2px 8px;
  background: var(--dsw-alias-bg-layer-2, #202020);
  color: var(--dsw-alias-label-primary, #ffffff);
  border: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.12));
  border-radius: var(--dsw-radius-xs, 4px);
  font-size: 11px;
  outline: none;
  box-sizing: border-box;
}

.dsh-pio-input:focus {
  border-color: var(--dsw-alias-brand-primary, #10b981);
}

/* --- Navigation Sub-Tabs Bar --- */
.dsh-pio-tab-bar,
.dsh-pio-tabs-bar,
.dsh-pio-subtabs {
  display: flex;
  align-items: center;
  background: var(--dsw-alias-bg-layer-1, #181818);
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));
  padding: 0 8px;
  flex-shrink: 0;
  gap: 2px;
  overflow-x: auto;
  scrollbar-width: none;
}

.dsh-pio-tab-bar::-webkit-scrollbar {
  display: none;
}

.dsh-pio-tab-item,
.dsh-pio-subtab-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #888888);
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.15s ease;
  user-select: none;
  white-space: nowrap;
}

.dsh-pio-tab-item:hover,
.dsh-pio-subtab-btn:hover {
  color: var(--dsw-alias-label-primary, #cccccc);
}

.dsh-pio-tab-item.active,
.dsh-pio-subtab-btn.active {
  color: var(--dsw-alias-label-primary, #ffffff);
  border-bottom-color: var(--dsw-alias-brand-primary, #10b981);
  background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.04));
}

.dsh-pio-tab-badge {
  padding: 1px 5px;
  background: var(--dsw-alias-bg-layer-3, rgba(255, 255, 255, 0.08));
  border-radius: 10px;
  font-size: 10px;
  color: var(--dsw-alias-label-secondary, #aaaaaa);
}

.dsh-pio-tab-badge.active-dot {
  width: 6px;
  height: 6px;
  padding: 0;
  border-radius: 50%;
  background: var(--dsw-alias-brand-primary, #10b981);
  animation: pio-pulse 1.2s infinite;
}

@keyframes pio-pulse {
  0% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.7; }
}

/* --- Tab Content Body --- */
.dsh-pio-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.dsh-pio-tab-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
}

/* --- Terminal Console Output --- */
.dsh-pio-console-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.dsh-pio-console-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  background: var(--dsw-alias-bg-layer-1, #1a1a1a);
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));
  font-size: 11px;
  color: var(--dsw-alias-label-secondary, #888888);
  flex-shrink: 0;
  gap: 6px;
  flex-wrap: wrap;
}

.dsh-pio-terminal-screen,
.dsh-pio-terminal {
  flex: 1;
  min-height: 0;
  height: 100%;
  padding: 8px 12px;
  font-family: var(--dsh-font-family-code-default, "SF Mono", Consolas, monospace);
  font-size: 12px;
  line-height: 1.5;
  background: var(--dsl-code-block-background, #0c0c0d);
  color: var(--dsw-alias-label-primary, #d4d4d4);
  overflow-y: auto;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  user-select: text;
}

.dsh-pio-terminal-line {
  margin: 0;
  padding: 0;
}

.dsh-pio-terminal-line.stderr {
  color: #f48771;
}

.dsh-pio-terminal-line.system {
  color: var(--dsw-alias-brand-primary, #10b981);
  font-style: italic;
}

.dsh-pio-timestamp {
  color: var(--dsw-alias-label-tertiary, #6a9955);
  margin-right: 6px;
  user-select: none;
}

/* --- Serial Toolbar & Inputs --- */
.dsh-pio-serial-toolbar {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  background: var(--dsw-alias-bg-layer-1, #1a1a1a);
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));
  flex-shrink: 0;
  gap: 6px;
  flex-wrap: wrap;
}

.dsh-pio-serial-input-form,
.dsh-pio-serial-input-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: var(--dsw-alias-bg-layer-1, #1a1a1a);
  border-top: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));
  flex-shrink: 0;
}

.dsh-pio-serial-input {
  flex: 1;
  min-width: 80px;
  height: 24px;
  background: var(--dsw-alias-bg-base, #101010);
  border: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.12));
  border-radius: var(--dsw-radius-xs, 4px);
  color: var(--dsw-alias-label-primary, #ffffff);
  padding: 0 8px;
  font-family: var(--dsh-font-family-code-default, monospace);
  font-size: 11px;
  outline: none;
}

.dsh-pio-serial-input:focus {
  border-color: var(--dsw-alias-brand-primary, #10b981);
}

/* --- Info Pane & Cards (Devices & Config) --- */
.dsh-pio-info-pane {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
}

.dsh-pio-info-card,
.dsh-pio-card {
  background: var(--dsw-alias-bg-layer-1, #1c1c1c);
  border: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));
  border-radius: var(--dsw-radius-sm, 6px);
  padding: 10px 12px;
  margin-bottom: 10px;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.dsh-pio-info-card:hover,
.dsh-pio-card:hover {
  border-color: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.18));
}

.dsh-pio-info-title,
.dsh-pio-card-title {
  font-weight: 600;
  font-size: 12px;
  color: var(--dsw-alias-label-primary, #ffffff);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.dsh-pio-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 6px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));
  flex-wrap: wrap;
  gap: 6px;
}

.dsh-pio-card-desc {
  font-size: 11px;
  color: var(--dsw-alias-label-secondary, #999999);
  line-height: 1.4;
  margin-bottom: 8px;
}

/* --- Responsive Form Layout --- */
.dsh-pio-form-grid,
.dsh-pio-form-row-2col {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
  width: 100%;
}

.dsh-pio-form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dsh-pio-form-field label {
  font-size: 11px;
  font-weight: 600;
  color: var(--dsw-alias-label-secondary, #999999);
  display: flex;
  align-items: center;
  gap: 4px;
}

.dsh-pio-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
  background: var(--dsw-alias-bg-layer-3, rgba(255, 255, 255, 0.08));
  color: var(--dsw-alias-label-secondary, #cccccc);
}

.dsh-pio-badge-esp32 { background: rgba(230, 126, 34, 0.2); color: #f39c12; border: 1px solid rgba(230, 126, 34, 0.3); }
.dsh-pio-badge-stm32 { background: rgba(52, 152, 219, 0.2); color: #3498db; border: 1px solid rgba(52, 152, 219, 0.3); }
.dsh-pio-badge-pico { background: rgba(233, 30, 99, 0.2); color: #ff4081; border: 1px solid rgba(233, 30, 99, 0.3); }
.dsh-pio-badge-avr { background: rgba(0, 150, 136, 0.2); color: #1abc9c; border: 1px solid rgba(0, 150, 136, 0.3); }

/* --- Table View --- */
.dsh-pio-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.dsh-pio-table td {
  padding: 5px 8px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.06));
}

.dsh-pio-table td.label {
  color: var(--dsw-alias-label-secondary, #888888);
  width: 120px;
}

.dsh-pio-table td.value {
  color: var(--dsw-alias-label-primary, #dddddd);
  font-family: var(--dsh-font-family-code-default, monospace);
}

/* --- Raw INI Editor --- */
.dsh-pio-ini-editor {
  width: 100%;
  height: 280px;
  background: var(--dsl-code-block-background, #0f0f0f);
  border: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.1));
  border-radius: var(--dsw-radius-xs, 4px);
  color: var(--dsw-alias-label-primary, #d4d4d4);
  font-family: var(--dsh-font-family-code-default, "SF Mono", Consolas, monospace);
  font-size: 11px;
  line-height: 1.5;
  padding: 8px;
  box-sizing: border-box;
  resize: vertical;
  outline: none;
}

.dsh-pio-ini-editor:focus {
  border-color: var(--dsw-alias-brand-primary, #10b981);
}

/* --- Autocomplete & Search Dropdown --- */
.dsh-pio-autocomplete-wrap {
  position: relative;
  width: 100%;
}

.dsh-pio-autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 220px;
  overflow-y: auto;
  background: var(--dsw-alias-bg-layer-2, #1e1e1e);
  border: 1px solid var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.16));
  border-radius: var(--dsw-radius-xs, 4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.65);
  z-index: 1050;
  margin-top: 3px;
}

.dsh-pio-autocomplete-item {
  padding: 6px 8px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.06));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  transition: background 0.1s ease;
}

.dsh-pio-autocomplete-item:last-child {
  border-bottom: none;
}

.dsh-pio-autocomplete-item:hover,
.dsh-pio-autocomplete-item.active {
  background: var(--dsw-alias-interactive-bg-hover, rgba(16, 185, 129, 0.18));
}

.dsh-pio-autocomplete-title {
  font-weight: 600;
  font-size: 11px;
  color: var(--dsw-alias-label-primary, #e0e0e0);
}

.dsh-pio-autocomplete-desc {
  font-size: 10px;
  color: var(--dsw-alias-label-secondary, #888888);
  margin-top: 1px;
  line-height: 1.3;
}

.dsh-pio-autocomplete-badge {
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--dsw-alias-bg-layer-3, rgba(255, 255, 255, 0.08));
  color: var(--dsw-alias-label-secondary, #aaaaaa);
  white-space: nowrap;
}

/* --- Chips --- */
.dsh-pio-chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 3px;
}

.dsh-pio-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: var(--dsw-radius-xs, 4px);
  font-size: 10px;
  background: var(--dsw-alias-bg-layer-2, #252525);
  border: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.1));
  color: var(--dsw-alias-label-secondary, #cccccc);
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
}

.dsh-pio-chip:hover {
  border-color: var(--dsw-alias-brand-primary, #10b981);
  color: var(--dsw-alias-label-primary, #ffffff);
}

.dsh-pio-chip.active {
  background: var(--dsw-alias-interactive-bg-active, rgba(16, 185, 129, 0.2));
  border-color: var(--dsw-alias-brand-primary, #10b981);
  color: var(--dsw-alias-brand-text, #ffffff);
  font-weight: 500;
}

.dsh-pio-chip .remove-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: var(--dsw-alias-label-secondary, #aaa);
  cursor: pointer;
  font-size: 9px;
}

.dsh-pio-chip .remove-btn:hover {
  background: #e74c3c;
  color: #fff;
}

/* --- Environment Tabs --- */
.dsh-pio-env-nav {
  display: flex;
  align-items: center;
  gap: 3px;
  overflow-x: auto;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));
  padding: 3px 6px;
  background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.1));
}

.dsh-pio-env-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  font-size: 11px;
  font-family: var(--dsh-font-family-code-default, monospace);
  font-weight: 500;
  border-radius: var(--dsw-radius-xs, 3px) var(--dsw-radius-xs, 3px) 0 0;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #888888);
  border: 1px solid transparent;
  border-bottom: none;
  cursor: pointer;
}

.dsh-pio-env-tab:hover {
  color: var(--dsw-alias-label-primary, #cccccc);
  background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.03));
}

.dsh-pio-env-tab.active {
  color: var(--dsw-alias-label-primary, #ffffff);
  background: var(--dsw-alias-bg-layer-1, #1e1e1e);
  border-color: var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.12));
  border-bottom: 1px solid var(--dsw-alias-bg-layer-1, #1e1e1e);
  margin-bottom: -1px;
}

/* --- Library Card --- */
.dsh-pio-lib-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 8px;
  background: var(--dsw-alias-bg-layer-2, #202020);
  border: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));
  border-radius: var(--dsw-radius-xs, 4px);
  font-size: 11px;
}

.dsh-pio-lib-card .lib-name {
  font-family: var(--dsh-font-family-code-default, monospace);
  font-weight: 600;
  color: var(--dsw-alias-brand-primary, #10b981);
}

/* --- Modal Overlay & Dialog (Responsive & Centered) --- */
.dsh-pio-modal-wrapper {
  position: absolute;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(2px);
  padding: 12px;
  box-sizing: border-box;
}

.dsh-pio-modal-backdrop {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.dsh-pio-modal-dialog {
  position: relative;
  z-index: 2;
  background: var(--dsw-alias-bg-layer-2, #1e1e1e);
  border: 1px solid var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.16));
  border-radius: var(--dsw-radius-sm, 6px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75);
  width: 520px;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.dsh-pio-modal-header {
  padding: 8px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--dsw-alias-bg-layer-1, rgba(255, 255, 255, 0.02));
  flex-shrink: 0;
  color: var(--dsw-alias-label-primary, #ffffff);
}

.dsh-pio-modal-body {
  padding: 12px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--dsw-alias-label-primary, #cccccc);
}

.dsh-pio-modal-footer {
  padding: 8px 12px;
  border-top: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
}

/* --- Directory Picker Component Styles --- */
.dsh-pio-dir-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  transition: background 0.15s, border-color 0.15s;
}
.dsh-pio-dir-item:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.12);
}
.dsh-pio-dir-item.selected {
  background: rgba(78, 201, 176, 0.12);
  border-color: rgba(78, 201, 176, 0.4);
}
.dsh-pio-dir-item.is-pio {
  border-left: 3px solid #e67e22;
}

/* --- Media Queries for Narrow Widths / Sidebar --- */
@media (max-width: 720px) {
  .dsh-pio-topbar {
    padding: 3px 6px;
    gap: 4px;
  }
  .dsh-pio-topbar-left,
  .dsh-pio-topbar-right {
    gap: 4px;
  }
  .dsh-pio-topbar-right .dsh-pio-btn span {
    display: none;
  }
  .dsh-pio-topbar-right .dsh-pio-btn {
    padding: 3px 5px;
  }
  .dsh-pio-tab-item {
    padding: 4px 6px;
    font-size: 10px;
  }
  .dsh-pio-form-grid,
  .dsh-pio-form-row-2col {
    grid-template-columns: 1fr;
  }
}
`;


    function installUiStyles() {
      if (typeof document === 'undefined') return;
      const STYLE_ID = 'dsh-platformio-styles';
      let el = document.getElementById(STYLE_ID);
      if (!el) {
        el = document.createElement('style');
        el.id = STYLE_ID;
        document.head.appendChild(el);
      }
      el.textContent = PIO_STYLES;
    }

    // ==========================================
    // 2. Clean SVG Icons (Zero Emojis)
    // ==========================================
    /**
 * Clean SVG icons for PlatformIO IDE plugin
 * Pure SVG vectors - ZERO emojis used
 */

function createIcons(React) {
  const h = React.createElement;

  function svg(pathD, viewBox = "0 0 16 16", fillRule = null) {
    return function Icon(props) {
      const size = props.size || 14;
      const style = {
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...props.style
      };
      return h('svg', {
        width: size,
        height: size,
        viewBox: viewBox,
        fill: 'currentColor',
        style,
        className: props.className
      }, h('path', { d: pathD, fillRule: fillRule || undefined }));
    };
  }

  // Checkmark / Build
  const Build = svg("M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z");

  // Arrow / Upload
  const Upload = svg("M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z");

  // Terminal / Serial
  const Serial = svg("M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2zm2.5 3a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5zm-4 4.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z");

  // Reload / Reset
  const Reset = svg("M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6 6 0 1 1 2.08 7.5a.5.5 0 0 1 .982.198 5 5 0 1 0 4.938-4.698z");

  // Trash / Clean
  const Clean = svg("M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z");

  // Chip / Hardware
  const Chip = svg("M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h.5A2.5 2.5 0 0 1 14 4.5v.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v.5a2.5 2.5 0 0 1-2.5 2.5H11v1.5a.5.5 0 0 1-1 0V14H9v1.5a.5.5 0 0 1-1 0V14H7v1.5a.5.5 0 0 1-1 0V14H5.5A2.5 2.5 0 0 1 3 11.5V11H1.5a.5.5 0 0 1 0-1H3V9H1.5a.5.5 0 0 1 0-1H3V7H1.5a.5.5 0 0 1 0-1H3V5H1.5a.5.5 0 0 1 0-1H3v-.5A2.5 2.5 0 0 1 5.5 1H6V.5A.5.5 0 0 1 6.5 0h.5zM4 4.5A1.5 1.5 0 0 1 5.5 3h5A1.5 1.5 0 0 1 12 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 11.5v-7zM5 5h6v6H5V5z");

  // Refresh / Sync
  const Refresh = svg("M13.683 1a6.002 6.002 0 0 1-1.353 7.828l-1.06-1.06A4.5 4.5 0 0 0 8 3.5 4.5 4.5 0 0 0 3.5 8 4.5 4.5 0 0 0 8 12.5c1.868 0 3.473-1.135 4.168-2.75l1.41.516A6.002 6.002 0 0 1 8 14 6 6 0 0 1 2 8a6 6 0 0 1 6-6c1.528 0 2.923.57 3.985 1.515L13.683 1z");

  // Stop / Terminate
  const Stop = svg("M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z");

  // Send
  const Send = svg("M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11zM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07zm-1.442-.916L13.424 1.87 2.193 6.603l3 2.55z");

  // Project Folder
  const Project = svg("M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h4.672a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2.5a2 2 0 0 1-2-2V3.87zm1 1.13V13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5H2a1 1 0 0 0-.46.11zM2.5 2a1 1 0 0 0-1 1v.058c.15-.038.307-.058.46-.058H9.828a3 3 0 0 1 2.122-.879l-.828-.828A1 1 0 0 0 10.414 1H2.5z");
  const Folder = Project;

  // Arrow Up / Level Up
  const ArrowUp = svg("M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z");

  // Home
  const Home = svg("M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z");

  // Hard Drive / Disk
  const HardDrive = svg("M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm0 1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm10.5 7a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1zm-2 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z");

  // History / Recent
  const History = svg("M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z");

  // Plus / New
  const Plus = svg("M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z");

  // Library / Package
  const Library = svg("M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09A1 1 0 0 1 0 12.162V3.5a.5.5 0 0 1 .314-.464L7.443.184z");

  // Search
  const Search = svg("M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z");

  // Config / Gear
  const Config = svg("M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z");

  // Code / Compiler DB
  const Code = svg("M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z");

  // Chevron Down
  const ChevronDown = svg("M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z");

  // Chevron Right
  const ChevronRight = svg("M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z");

  // Close / Delete / Cross
  const Close = svg("M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z");

  // Check
  const Check = svg("M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z");

  // Edit / Pencil
  const Edit = svg("M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z");

  // Save / Disk
  const Save = svg("M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z");

  // Alert / Warning Triangle
  const Alert = svg("M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z");

  // Info Circle
  const Info = svg("M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z");

  // PlatformIO Alien Logo
  function PioLogo(props) {
    const size = props.size || 14;
    return h('svg', {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: props.color || "#e67e22",
      style: { display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...props.style }
    }, h('path', {
      d: "M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8l7.2 3.6-7.2 3.6-7.2-3.6L12 4.8zm-8 4.6l7 3.5v7.2l-7-3.5V9.4zm16 7.2l-7 3.5v-7.2l7-3.5v7.2z"
    }));
  }

  const iconsMap = {
    Build,
    Upload,
    Serial,
    Reset,
    Clean,
    Chip,
    Refresh,
    Stop,
    Send,
    Project,
    Folder,
    ArrowUp,
    Home,
    HardDrive,
    History,
    Plus,
    Library,
    Search,
    Config,
    Settings: Config,
    Code,
    ChevronDown,
    ChevronRight,
    Close,
    Check,
    Edit,
    Save,
    Alert,
    Warning: Alert,
    Info,
    PioLogo
  };

  return new Proxy(iconsMap, {
    get(target, prop) {
      if (prop in target) return target[prop];
      console.warn('[dsh-pio] Icon not found, using Info fallback:', prop);
      return Info;
    }
  });
}

    const Icons = createIcons(React);

    // ==========================================
    // 3. Views
    // ==========================================
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

function createPioWorkbenchComponent(React, Icons) {
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
      dir: '',
      inPlace: false
    });
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [isAddEnvOpen, setIsAddEnvOpen] = useState(false);
    const [newEnvForm, setNewEnvForm] = useState({
      name: 'esp32-s3',
      board: 'esp32-s3-devkitc-1',
      framework: 'arduino',
      platform: 'espressif32'
    });

    // Directory Selector & Filesystem Browser State
    const [isDirPickerOpen, setIsDirPickerOpen] = useState(false);
    const [dirPickerMode, setDirPickerMode] = useState('switch-workspace'); // 'switch-workspace' | 'new-project-dir'
    const [dirPickerData, setDirPickerData] = useState({
      current: '',
      parent: null,
      directories: [],
      drives: [],
      favorites: [],
      recentProjects: [],
      isPio: false
    });
    const [dirPickerPathInput, setDirPickerPathInput] = useState('');
    const [dirPickerSelected, setDirPickerSelected] = useState('');
    const [dirPickerLoading, setDirPickerLoading] = useState(false);

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
        let activeSessionCwd = '';
        try {
          // Detect active session working directory from DSH GUI state if available
          const pathSegments = window.location.pathname.split('/');
          const sIdx = pathSegments.indexOf('session');
          const sessionId = sIdx !== -1 ? pathSegments[sIdx + 1] : null;
          if (sessionId) {
            activeSessionCwd = `?sessionId=${encodeURIComponent(sessionId)}`;
          }
        } catch (e) {}

        const res = await fetch(`/api/pio/info${activeSessionCwd}`);
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

    // Open Directory Selector & Filesystem Browser
    const openDirPicker = useCallback(async (mode = 'switch-workspace', initialPath = '') => {
      setDirPickerMode(mode);
      setIsDirPickerOpen(true);
      const startPath = initialPath || projectInfo?.dir || '';
      setDirPickerPathInput(startPath);
      setDirPickerSelected(startPath);
      setDirPickerLoading(true);
      try {
        const query = startPath ? `?dir=${encodeURIComponent(startPath)}` : '';
        const res = await fetch(`/api/pio/fs/browse${query}`);
        if (res.ok) {
          const data = await res.json();
          setDirPickerData(data);
          setDirPickerPathInput(data.current || '');
          setDirPickerSelected(data.current || '');
        }
      } catch (e) {
        console.warn('[dsh-pio] browse directory error:', e);
      } finally {
        setDirPickerLoading(false);
      }
    }, [projectInfo]);

    // Navigate to a specific path in Directory Selector
    const navigateToDir = useCallback(async (targetPath) => {
      if (!targetPath) return;
      setDirPickerLoading(true);
      try {
        const res = await fetch(`/api/pio/fs/browse?dir=${encodeURIComponent(targetPath)}`);
        if (res.ok) {
          const data = await res.json();
          setDirPickerData(data);
          setDirPickerPathInput(data.current || '');
          setDirPickerSelected(data.current || '');
        }
      } catch (e) {
        console.warn('[dsh-pio] navigate dir error:', e);
      } finally {
        setDirPickerLoading(false);
      }
    }, []);

    // Confirm Directory Selection
    const handleConfirmDirPicker = useCallback(async () => {
      const chosenPath = dirPickerSelected || dirPickerPathInput;
      if (!chosenPath) return;

      if (dirPickerMode === 'new-project-dir') {
        setNewProjectForm(prev => ({
          ...prev,
          dir: chosenPath
        }));
        setIsDirPickerOpen(false);
        return;
      }

      // Default: switch workspace
      setIsDirPickerOpen(false);
      await handleSwitchWorkspace(chosenPath);
    }, [dirPickerSelected, dirPickerPathInput, dirPickerMode, handleSwitchWorkspace]);

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
                    const currentDir = projectInfo?.dir || projectInfo?.projectPath || '';
                    const parentDir = currentDir.includes('\\')
                      ? currentDir.substring(0, currentDir.lastIndexOf('\\'))
                      : (currentDir.includes('/') ? currentDir.substring(0, currentDir.lastIndexOf('/')) : currentDir);
                    setNewProjectForm(prev => ({
                      name: 'esp32-app-' + Math.floor(100 + Math.random() * 900),
                      board: projectInfo?.board || prev.board || 'esp32doit-devkit-v1',
                      framework: projectInfo?.framework || prev.framework || 'arduino',
                      dir: projectInfo?.isPio ? (parentDir || currentDir) : currentDir,
                      inPlace: !projectInfo?.isPio
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
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '12px' } },
              h('span', { style: { color: '#888' } }, '当前工程:'),
              h('select', {
                className: 'dsh-pio-select',
                style: { flex: 1, minWidth: '220px', maxWidth: '380px', fontFamily: 'monospace' },
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
                onClick: () => openDirPicker('switch-workspace', projectInfo?.dir),
                title: '自定义浏览并选择工程目录'
              }, h(Icons.Folder, { size: 11 }), '打开目录...'),
              h('button', {
                className: 'dsh-pio-btn',
                onClick: refreshProjects,
                title: '扫描工作区 PlatformIO 工程'
              }, h(Icons.Refresh, { size: 10 }), '扫描')
            ),

            // Non-PIO Project Guide Banner
            (!projectInfo?.isPio && projectInfo?.dir) ? h('div', {
              style: {
                marginTop: '12px',
                padding: '10px 14px',
                borderRadius: '6px',
                background: 'rgba(243, 156, 18, 0.1)',
                border: '1px solid rgba(243, 156, 18, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }
            },
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                h(Icons.Alert, { size: 16, style: { color: '#f39c12', flexShrink: 0 } }),
                h('div', { style: { fontSize: '12px', color: '#ddd' } },
                  h('strong', { style: { color: '#f39c12' } }, '当前目录未检测到 platformio.ini 配置文件。'),
                  h('div', { style: { fontSize: '11px', color: '#aaa', marginTop: '2px' } },
                    `目录 [${projectInfo.dir}] 尚未初始化为嵌入式项目。您可以直接在此目录初始化，或选择已有的工程目录。`
                  )
                )
              ),
              h('div', { style: { display: 'flex', gap: '8px', flexShrink: 0 } },
                h('button', {
                  className: 'dsh-pio-btn',
                  style: { height: '26px', padding: '0 10px', fontSize: '11px' },
                  onClick: () => openDirPicker('switch-workspace', projectInfo?.dir),
                  title: '选择电脑上其他已有工程目录'
                }, h(Icons.Folder, { size: 11 }), '选择已有工程...'),
                h('button', {
                  className: 'dsh-pio-btn dsh-pio-btn-primary',
                  style: { height: '26px', padding: '0 12px', fontSize: '11px' },
                  onClick: () => {
                    setNewProjectForm(prev => ({
                      ...prev,
                      dir: projectInfo.dir,
                      inPlace: true
                    }));
                    setIsNewProjectOpen(true);
                  }
                }, h(Icons.Plus, { size: 11 }), '在此目录初始化工程')
              )
            ) : null
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
              h('div', { style: { display: 'flex', gap: '6px' } },
                h('input', {
                  type: 'text',
                  className: 'dsh-pio-input',
                  style: { flex: 1 },
                  value: newProjectForm.dir,
                  onChange: (e) => setNewProjectForm(prev => ({ ...prev, dir: e.target.value })),
                  placeholder: '目标目录，留空默认为当前工作区'
                }),
                h('button', {
                  type: 'button',
                  className: 'dsh-pio-btn',
                  onClick: () => openDirPicker('new-project-dir', newProjectForm.dir || projectInfo?.dir),
                  title: '浏览并选择目录'
                }, h(Icons.Folder, { size: 11 }), '浏览...')
              ),
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' } },
                h('label', { style: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#ccc', cursor: 'pointer' } },
                  h('input', {
                    type: 'checkbox',
                    checked: !!newProjectForm.inPlace,
                    onChange: (e) => setNewProjectForm(prev => ({ ...prev, inPlace: e.target.checked }))
                  }),
                  '直接在目标目录下初始化 (不创建子文件夹)'
                )
              ),
              h('div', { style: { fontSize: '10px', color: 'var(--dsw-alias-label-secondary, #888)', marginTop: '4px' } },
                '生成路径: ' + (newProjectForm.inPlace
                  ? (newProjectForm.dir || '当前目录')
                  : `${newProjectForm.dir ? (newProjectForm.dir.endsWith('\\') || newProjectForm.dir.endsWith('/') ? newProjectForm.dir : newProjectForm.dir + '\\') : ''}${newProjectForm.name || ''}`)
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

    // Render Directory Selector & Filesystem Browser Modal
    const renderDirPickerModal = () => {
      const isSwitch = dirPickerMode === 'switch-workspace';
      const title = isSwitch ? '选择 PlatformIO 工程目录 / 工作区' : '选择新工程目标目录';
      const desc = isSwitch
        ? '选择任意包含 platformio.ini 的工程文件夹，或选择任意工作区目录进行工程管理。'
        : '浏览并选择用于存放新工程的文件夹。';

      return h('div', { className: 'dsh-pio-modal-wrapper' },
        h('div', { className: 'dsh-pio-modal-backdrop', onClick: () => setIsDirPickerOpen(false) }),
        h('div', {
          className: 'dsh-pio-modal-dialog',
          style: { width: '640px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' },
          onClick: (e) => e.stopPropagation()
        },
          h('div', { className: 'dsh-pio-modal-header' },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              h(Icons.Folder, { size: 16, style: { color: '#e67e22' } }),
              h('span', { style: { fontWeight: 600, fontSize: '13px' } }, title)
            ),
            h('button', {
              className: 'dsh-pio-btn',
              style: { border: 'none', background: 'transparent', padding: '2px 4px' },
              onClick: () => setIsDirPickerOpen(false)
            }, h(Icons.Close, { size: 14 }))
          ),

          h('div', { className: 'dsh-pio-modal-body', style: { padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' } },
            h('div', { style: { fontSize: '12px', color: '#aaa' } }, desc),

            // Top: Path navigation bar (Up button, text input, Go button)
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
              h('button', {
                className: 'dsh-pio-btn',
                disabled: !dirPickerData.parent || dirPickerLoading,
                onClick: () => navigateToDir(dirPickerData.parent),
                title: dirPickerData.parent ? `上一级: ${dirPickerData.parent}` : '无上一级'
              }, h(Icons.ArrowUp, { size: 12 }), '上一级'),
              h('input', {
                type: 'text',
                className: 'dsh-pio-input',
                style: { flex: 1, fontFamily: 'Consolas, monospace', fontSize: '12px' },
                value: dirPickerPathInput,
                onChange: (e) => {
                  setDirPickerPathInput(e.target.value);
                  setDirPickerSelected(e.target.value);
                },
                onKeyDown: (e) => {
                  if (e.key === 'Enter') {
                    navigateToDir(dirPickerPathInput);
                  }
                },
                placeholder: '输入或粘贴绝对路径...'
              }),
              h('button', {
                className: 'dsh-pio-btn',
                disabled: dirPickerLoading || !dirPickerPathInput,
                onClick: () => navigateToDir(dirPickerPathInput),
                title: '跳转至输入路径'
              }, '前往')
            ),

            // Quick Access Chips: Drives & Favorites
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' } },
                h('span', { style: { fontSize: '11px', color: '#888', marginRight: '4px' } }, '磁盘:'),
                (dirPickerData.drives || []).map(drive =>
                  h('button', {
                    key: drive,
                    className: 'dsh-pio-btn',
                    style: { padding: '2px 8px', fontSize: '11px', height: '22px' },
                    onClick: () => navigateToDir(drive)
                  }, h(Icons.HardDrive, { size: 10 }), drive)
                ),
                h('span', { style: { fontSize: '11px', color: '#888', marginLeft: '6px', marginRight: '4px' } }, '快捷位置:'),
                (dirPickerData.favorites || []).map(fav =>
                  h('button', {
                    key: fav.name,
                    className: 'dsh-pio-btn',
                    style: { padding: '2px 8px', fontSize: '11px', height: '22px' },
                    onClick: () => navigateToDir(fav.path),
                    title: fav.path
                  }, fav.name)
                )
              ),

              // Recent PlatformIO Projects (if any)
              (dirPickerData.recentProjects && dirPickerData.recentProjects.length > 0) ? h('div', {
                style: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }
              },
                h('span', { style: { fontSize: '11px', color: '#e67e22', display: 'flex', alignItems: 'center', gap: '4px' } },
                  h(Icons.History, { size: 10 }), '扫描到的工程:'
                ),
                dirPickerData.recentProjects.slice(0, 6).map(rp =>
                  h('button', {
                    key: rp.path,
                    className: 'dsh-pio-btn',
                    style: {
                      padding: '2px 8px',
                      fontSize: '11px',
                      height: '22px',
                      borderColor: 'rgba(230, 126, 34, 0.4)',
                      background: 'rgba(230, 126, 34, 0.08)'
                    },
                    onClick: () => {
                      setDirPickerPathInput(rp.path);
                      setDirPickerSelected(rp.path);
                      navigateToDir(rp.path);
                    },
                    title: rp.path
                  }, rp.name)
                )
              ) : null
            ),

            // Directory status notice (e.g. if current is PIO)
            dirPickerData.isPio ? h('div', {
              style: {
                padding: '6px 10px',
                borderRadius: '4px',
                background: 'rgba(46, 204, 113, 0.12)',
                border: '1px solid rgba(46, 204, 113, 0.3)',
                color: '#2ecc71',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }
            },
              h(Icons.Check, { size: 12 }),
              h('span', null, '检测到 platformio.ini 配置文件，当前目录是有效的 PlatformIO 工程！')
            ) : null,

            // Subdirectories list box
            h('div', {
              style: {
                border: '1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.1))',
                borderRadius: '4px',
                background: 'rgba(0, 0, 0, 0.2)',
                height: '240px',
                overflowY: 'auto',
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }
            },
              dirPickerLoading ? h('div', { style: { padding: '20px', textAlign: 'center', color: '#888', fontSize: '12px' } }, '正在读取目录...')
              : (dirPickerData.directories && dirPickerData.directories.length > 0)
                ? dirPickerData.directories.map(item => {
                    const isSelected = dirPickerSelected === item.path;
                    return h('div', {
                      key: item.path,
                      className: `dsh-pio-dir-item ${isSelected ? 'selected' : ''} ${item.isPio ? 'is-pio' : ''}`,
                      onClick: () => {
                        setDirPickerSelected(item.path);
                        setDirPickerPathInput(item.path);
                      },
                      onDoubleClick: () => navigateToDir(item.path),
                      title: `双击进入: ${item.path}`
                    },
                      h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 } },
                        h(Icons.Folder, { size: 14, style: { color: item.isPio ? '#e67e22' : '#888', flexShrink: 0 } }),
                        h('span', {
                          style: {
                            fontSize: '12px',
                            fontWeight: item.isPio ? 600 : 400,
                            color: item.isPio ? '#f39c12' : '#e0e0e0',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }
                        }, item.name),
                        item.isPio ? h('span', {
                          style: {
                            fontSize: '9px',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            background: 'rgba(230, 126, 34, 0.2)',
                            color: '#e67e22',
                            border: '1px solid rgba(230, 126, 34, 0.4)'
                          }
                        }, 'PIO 工程') : null
                      ),
                      h('div', { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
                        h('button', {
                          type: 'button',
                          className: 'dsh-pio-btn',
                          style: { padding: '2px 6px', fontSize: '10px', height: '20px' },
                          onClick: (e) => {
                            e.stopPropagation();
                            navigateToDir(item.path);
                          },
                          title: '进入子目录'
                        }, '进入', h(Icons.ChevronRight, { size: 10 }))
                      )
                    );
                  })
                : h('div', { style: { padding: '20px', textAlign: 'center', color: '#666', fontSize: '12px' } }, '当前目录下无子文件夹')
            ),

            // Selection info display
            h('div', { style: { fontSize: '11px', color: '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
              h('span', null, '选中路径: ', h('code', { style: { color: '#4ec9b0', fontFamily: 'monospace' } }, dirPickerSelected || dirPickerPathInput || dirPickerData.current || '(无)')),
              h('span', { style: { color: '#777', fontSize: '10px' } }, '提示: 可双击文件夹直接进入')
            )
          ),

          // Footer buttons
          h('div', { className: 'dsh-pio-modal-footer' },
            h('button', {
              className: 'dsh-pio-btn',
              onClick: () => setIsDirPickerOpen(false)
            }, '取消'),
            h('button', {
              className: 'dsh-pio-btn dsh-pio-btn-primary',
              disabled: dirPickerLoading || (!dirPickerSelected && !dirPickerPathInput && !dirPickerData.current),
              onClick: handleConfirmDirPicker
            }, isSwitch ? '打开此工程 / 目录' : '选择此目录')
          )
        )
      );
    };

    return h('div', { className: 'dsh-pio-workbench', style: { position: 'relative' } },
      renderTopBar(),
      isPySelectorOpen ? renderPySelectorModal() : null,
      isNewProjectOpen ? renderNewProjectModal() : null,
      isAddEnvOpen ? renderAddEnvModal() : null,
      isDirPickerOpen ? renderDirPickerModal() : null,
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


    const PioWorkbenchView = createPioWorkbenchComponent(React, Icons);

    const PLUGIN_ID = "dsh-platformio";
    const TAB_KIND = "dsh-platformio";

    // ==========================================
    // 4. Plugin Injection & Lifecycle
    // ==========================================
    const inject = [
      "slots",
      "sidebarRightTabs",
      "sidebarRight"
    ];

    function apply(ctx) {
      installUiStyles();

      // Helper to register tab into dsh-better-sidebar (Bottom Panel & Sidebar)
      function registerInBetterSidebar(service) {
        if (!service || service.getTab('pio')) return;
        try {
          service.registerTab({
            id: 'pio',
            title: () => 'PlatformIO',
            description: () => 'PlatformIO: 固件编译、烧录、调试与串口监视器',
            icon: (size) => React.createElement(Icons.PioLogo, { size: size || 14 }),
            order: 25,
            bottomOnly: false,
            createTab: () => ({
              tab: {
                id: 'pio',
                type: 'pio',
                title: 'PlatformIO',
                meta: {}
              }
            }),
            single: true,
            component: (tabProps) => React.createElement(PioWorkbenchView, { ...tabProps, ctx })
          });
        } catch (err) {
          console.warn('[dsh-pio] registerTab in betterSidebar failed:', err);
        }
      }

      // Check immediate service
      const directBsb = ctx.get ? ctx.get('betterSidebar') : ctx.betterSidebar;
      if (directBsb) {
        registerInBetterSidebar(directBsb);
      }

      // Also register via ctx.inject when available
      if (typeof ctx.inject === 'function') {
        try {
          ctx.inject(['betterSidebar'], (injected) => {
            const svc = injected.get ? injected.get('betterSidebar') : injected.betterSidebar;
            if (svc) registerInBetterSidebar(svc);
          });
        } catch (e) {}
      }

      // 1. Right Sidebar Tab & Guide
      try {
        if (!ctx.sidebarRightTabs?.ids?.has(PLUGIN_ID)) {
          ctx.effect(() => ctx.sidebarRightTabs.register({
            id: PLUGIN_ID,
            kind: TAB_KIND,
            title: () => "PlatformIO",
            guide: [{
              id: "open",
              order: 30,
              title: () => "PlatformIO IDE",
              description: () => "ESP32 固件编译、烧录、调试与串口监视器",
              icon: (props) => React.createElement(Icons.PioLogo, props)
            }]
          }), "dsh-pio: sidebar tab");
        }
      } catch (err) {
        console.warn('[dsh-pio] sidebarRightTabs.register:', err);
      }

      // 2. Right Sidebar Tab Content & Title
      ["dsh-platformio", "ds-platformio", "dsh-pio", "pio", "platformio"].forEach(key => {
        try {
          ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({
            name: "sidebar.right.pane.tab",
            key
          }, (slotProps) => React.createElement(PioWorkbenchView, { ...slotProps, ctx }))), "dsh-platformio: tab body " + key);

          ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab.title", () => ctx.slots.register({
            name: "sidebar.right.pane.tab.title",
            key
          }, () => React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } },
            React.createElement(Icons.PioLogo, { size: 14 }),
            React.createElement('span', null, 'PlatformIO')
          ))), "dsh-platformio: tab title " + key);
        } catch (err) {
          console.warn('[dsh-platformio] slots register sidebar tab:', err);
        }
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.PioWorkbenchView = PioWorkbenchView;
    exports.Icons = Icons;

    return module.exports;
  }

  // Register in ModuleLoader with idempotent guards
  if (!window.__dsh_platformio_registered__) {
    window.__dsh_platformio_registered__ = true;
    try {
      window.__ModuleLoader__.load({ id: "dsh-platformio", factory });
    } catch (e) {
      console.warn('[dsh-platformio] ModuleLoader load dsh-platformio:', e);
    }
    try {
      window.__ModuleLoader__.load({ id: "ds-platformio", factory });
    } catch (e) {}
    try {
      window.__ModuleLoader__.load({ id: "dsh-pio", factory });
    } catch (e) {}
  }
})();
