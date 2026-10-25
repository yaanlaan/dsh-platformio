import fs from 'node:fs';
import path from 'node:path';

const rootDir = import.meta.dirname || path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));

const stylesRaw = fs.readFileSync(path.join(rootDir, 'src/styles.js'), 'utf8');
const stylesContent = stylesRaw.replaceAll('export const ', 'const ');

const iconsRaw = fs.readFileSync(path.join(rootDir, 'src/icons.js'), 'utf8');
const iconsContent = iconsRaw
  .replaceAll('export function ', 'function ')
  .replaceAll('export const ', 'const ');

const workbenchViewRaw = fs.readFileSync(path.join(rootDir, 'src/pio-workbench-view.js'), 'utf8');
const workbenchContent = workbenchViewRaw
  .replaceAll('export function ', 'function ')
  .replaceAll('export const ', 'const ');

const clientBundle = `// DeepSeek Harness ds-platformio Plugin - Client Bundle (Zero Emojis, Native Bottom Panel & Sidebar)
(function() {
  function factory(require) {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    const React = require("react");

    // ==========================================
    // 1. UI Styles
    // ==========================================
    ${stylesContent}

    function installUiStyles() {
      if (typeof document === 'undefined') return;
      const STYLE_ID = 'ds-platformio-styles';
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
    ${iconsContent}
    const Icons = createIcons(React);

    // ==========================================
    // 3. Views
    // ==========================================
    ${workbenchContent}

    const PioWorkbenchView = createPioWorkbenchComponent(React, Icons);

    const PLUGIN_ID = "ds-platformio";
    const TAB_KIND = "ds-platformio";

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
      ["ds-platformio", "dsh-pio", "pio", "platformio"].forEach(key => {
        try {
          ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({
            name: "sidebar.right.pane.tab",
            key
          }, (slotProps) => React.createElement(PioWorkbenchView, { ...slotProps, ctx }))), "ds-platformio: tab body " + key);

          ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab.title", () => ctx.slots.register({
            name: "sidebar.right.pane.tab.title",
            key
          }, () => React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } },
            React.createElement(Icons.PioLogo, { size: 14 }),
            React.createElement('span', null, 'PlatformIO')
          ))), "ds-platformio: tab title " + key);
        } catch (err) {
          console.warn('[ds-platformio] slots register sidebar tab:', err);
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
  if (!window.__ds_platformio_registered__) {
    window.__ds_platformio_registered__ = true;
    try {
      window.__ModuleLoader__.load({ id: "ds-platformio", factory });
    } catch (e) {
      console.warn('[ds-platformio] ModuleLoader load ds-platformio:', e);
    }
    try {
      window.__ModuleLoader__.load({ id: "dsh-pio", factory });
    } catch (e) {}
  }
})();
`;

const libDir = path.join(rootDir, 'lib');
if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, { recursive: true });
}

const outPath = path.join(libDir, 'client.js');
fs.writeFileSync(outPath, clientBundle, 'utf8');
console.log('Successfully built ' + outPath + ' (' + (clientBundle.length / 1024).toFixed(1) + ' KB)');
