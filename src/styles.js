/**
 * DeepSeek Harness PlatformIO Plugin - CSS Styles
 * Adaptive to DeepSeek Harness Light / Dark Themes & Responsive Widths
 * Zero Emojis - Professional VSCode/PlatformIO Experience
 */

export const PIO_STYLES = `
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
