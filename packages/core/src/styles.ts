export const CSS = `
/* =========================================================
   VS Code 2026 Design Tokens — Dark (default) & Light
   CSS custom properties map to VS Code webview variables
   where available, with hardcoded Dark 2026 fallbacks.
   Light 2026 overrides are activated by .vscode-light
   (injected by VS Code) or [data-theme="light"].
   ========================================================= */
:root{
  --pr-bg:var(--vscode-editor-background,#1f1f1f);
  --pr-bg-2:var(--vscode-sideBar-background,#181818);
  --pr-bg-3:var(--vscode-editorWidget-background,#252526);
  --pr-fg:var(--vscode-editor-foreground,#cccccc);
  --pr-fg-2:var(--vscode-descriptionForeground,#8b8b8b);
  --pr-fg-3:#555555;
  --pr-h1:var(--vscode-foreground,#ffffff);
  --pr-accent:var(--vscode-textLink-foreground,#3794ff);
  --pr-border:var(--vscode-widget-border,#454545);
  --pr-border-subtle:rgba(255,255,255,0.07);
  --pr-hover:rgba(255,255,255,0.04);
  --pr-btn-bg:var(--vscode-button-background,#0078d4);
  --pr-btn-fg:var(--vscode-button-foreground,#ffffff);
  --pr-btn-hover:var(--vscode-button-hoverBackground,#026ec1);
  --pr-input-bg:var(--vscode-input-background,#313131);
  --pr-input-fg:var(--vscode-input-foreground,#cccccc);
  --pr-input-border:var(--vscode-input-border,rgba(255,255,255,0.1));
  --pr-code-bg:#1e1e1e;
  --pr-code-bg-2:#141414;
  --pr-code-border:rgba(255,255,255,0.06);
  --pr-progress:var(--vscode-progressBar-background,#0078d4);
  --pr-badge-bg:var(--vscode-badge-background,#0078d4);
  --pr-badge-fg:var(--vscode-badge-foreground,#ffffff);
  --pr-error:var(--vscode-errorForeground,#f14c4c);
  --pr-toast-bg:var(--vscode-notifications-background,#313131);
  --pr-toast-border:var(--vscode-notificationsBorder,rgba(255,255,255,0.08));
  --pr-overlay:rgba(0,0,0,0.5);
  --pr-shadow:rgba(0,0,0,0.6);
}

/* VS Code Light 2026 — activated by .vscode-light (VS Code injects this on body)
   or by [data-theme="light"] set by the web app theme toggle              */
.vscode-light,:root[data-theme="light"],[data-theme="light"]{
  --pr-bg:var(--vscode-editor-background,#ffffff);
  --pr-bg-2:var(--vscode-sideBar-background,#f3f3f3);
  --pr-bg-3:var(--vscode-editorWidget-background,#f0f0f0);
  --pr-fg:var(--vscode-editor-foreground,#1f1f1f);
  --pr-fg-2:var(--vscode-descriptionForeground,#717171);
  --pr-fg-3:#a0a0a0;
  --pr-h1:var(--vscode-foreground,#000000);
  --pr-accent:var(--vscode-textLink-foreground,#005fb8);
  --pr-border:var(--vscode-widget-border,#c8c8c8);
  --pr-border-subtle:rgba(0,0,0,0.08);
  --pr-hover:rgba(0,0,0,0.04);
  --pr-btn-bg:var(--vscode-button-background,#005fb8);
  --pr-btn-fg:var(--vscode-button-foreground,#ffffff);
  --pr-btn-hover:var(--vscode-button-hoverBackground,#0258a8);
  --pr-input-bg:var(--vscode-input-background,#ffffff);
  --pr-input-fg:var(--vscode-input-foreground,#1f1f1f);
  --pr-input-border:var(--vscode-input-border,rgba(0,0,0,0.2));
  --pr-code-bg:#f5f5f5;
  --pr-code-bg-2:#ebebeb;
  --pr-code-border:rgba(0,0,0,0.08);
  --pr-progress:var(--vscode-progressBar-background,#0090f1);
  --pr-badge-bg:var(--vscode-badge-background,#005fb8);
  --pr-badge-fg:var(--vscode-badge-foreground,#ffffff);
  --pr-error:var(--vscode-errorForeground,#e51400);
  --pr-toast-bg:var(--vscode-notifications-background,#f0f0f0);
  --pr-toast-border:var(--vscode-notificationsBorder,rgba(0,0,0,0.1));
  --pr-overlay:rgba(0,0,0,0.25);
  --pr-shadow:rgba(0,0,0,0.15);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
body{background:var(--pr-bg);color:var(--pr-fg);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;overflow-x:hidden;
  text-rendering:optimizeLegibility}
.doc{max-width:580px;margin:0 auto;padding:60px 28px 160px}

/* Block hover */
.block{cursor:pointer;border-radius:6px;padding:3px 6px;margin:2px -6px;position:relative;transition:background .15s}
.block:hover{background:var(--pr-hover)}

/* Typography */
.el-h1{font-size:26px;font-weight:700;color:var(--pr-h1);letter-spacing:-.4px;line-height:1.3;margin-top:28px}
.el-h2{font-size:12px;font-weight:600;color:var(--pr-fg-2);text-transform:uppercase;letter-spacing:1.3px;margin-top:36px}
.el-h3{font-size:14px;font-weight:600;color:var(--pr-fg);margin-top:18px}
.el-p{font-size:15px;color:var(--pr-fg-2);line-height:1.8;margin-top:8px;letter-spacing:.01em}
.el-li{font-size:15px;color:var(--pr-fg);line-height:1.8;padding-left:18px;position:relative;margin-top:5px}
.el-li::before{content:"●";position:absolute;left:0;color:var(--pr-fg-3);font-size:7px;top:7px}
.el-ol{font-size:15px;color:var(--pr-fg);line-height:1.8;padding-left:18px;position:relative;margin-top:5px}
.el-ol::before{content:"–";position:absolute;left:2px;color:var(--pr-fg-3);font-size:15px}
.el-quote{border-left:2px solid var(--pr-border);padding-left:16px;color:var(--pr-fg-2);font-style:italic;font-size:15px;line-height:1.8;margin-top:8px}

/* Images */
.doc img{max-width:100%;height:auto;border-radius:6px;margin-top:10px}

/* Code blocks */
.code-wrap{background:var(--pr-code-bg);border:1px solid var(--pr-code-border);border-radius:6px;overflow:hidden;margin-top:10px}
.code-header{background:var(--pr-code-bg-2);padding:7px 14px;border-bottom:1px solid var(--pr-code-border);display:flex;justify-content:space-between;align-items:center}
.code-lang{color:var(--pr-fg-3);font-family:'Cascadia Code','Fira Code','JetBrains Mono',monospace;text-transform:uppercase;font-size:11px}
.code-copy{background:none;border:none;color:var(--pr-fg-3);font-size:11px;cursor:pointer;font-family:inherit}
.code-copy:hover{color:var(--pr-fg-2)}
.code-body{padding:16px;font-size:13.5px;line-height:1.75;font-family:'Cascadia Code','Fira Code','JetBrains Mono',monospace;
  color:var(--pr-fg);overflow-x:auto;white-space:pre}

/* Shiki output styling */
.code-body pre{margin:0;padding:0;background:transparent!important}
.code-body code{font-family:inherit;font-size:inherit;line-height:inherit;background:transparent}
.code-body .shiki{background:transparent!important}

/* Mermaid diagrams */
.mermaid-body{padding:16px;display:flex;justify-content:center;overflow-x:auto}
.mermaid-body svg{max-width:100%;height:auto}

/* Annotation dot */
.ann-dot{position:absolute;left:-14px;top:50%;transform:translateY(-50%);width:7px;height:7px;border-radius:50%;background:var(--pr-accent)}
.code-wrap .ann-dot{left:-14px;top:14px;transform:none}

/* Inline markdown */
.doc strong{color:var(--pr-h1);font-weight:600}
.doc code.inline{font-family:'Cascadia Code','Fira Code',monospace;font-size:.87em;background:var(--pr-border-subtle);color:var(--pr-fg);padding:2px 6px;border-radius:3px}

/* ---- Question Blocks ---- */
.q-block{margin:16px -6px;border-radius:8px;overflow:hidden;transition:all .2s}
.q-block.unanswered{border:1px solid var(--pr-border);background:var(--pr-hover)}
.q-block.answered{border:1px solid var(--pr-border-subtle);background:transparent;transition:background .15s}
.q-block.answered:hover{background:var(--pr-hover)}
.q-header{padding:14px 16px 10px;display:flex;gap:10px;align-items:flex-start}
.q-block.unanswered .q-header{border-bottom:1px solid var(--pr-border-subtle)}
.q-icon{font-size:9px;color:var(--pr-fg-3);text-transform:uppercase;letter-spacing:1px;font-family:monospace;flex-shrink:0;margin-top:3px}
.q-text{flex:1;font-size:15px;line-height:1.55}
.q-block.unanswered .q-text{color:var(--pr-fg);font-weight:500}
.q-block.answered .q-text{color:var(--pr-fg-2);font-weight:400}
.q-dismiss{font-size:18px;color:var(--pr-fg-3);cursor:pointer;background:none;border:none;line-height:1;padding:0 2px;flex-shrink:0}
.q-dismiss:hover{color:var(--pr-fg-2)}
.q-body{padding:10px 16px 14px}

/* Answer summary */
.q-answer-row{padding:10px 16px 14px;display:flex;align-items:center;justify-content:space-between}
.q-answer-text{font-size:13.5px;color:var(--pr-fg-2)}
.q-edit-btn{font-size:11px;color:var(--pr-fg-3);background:none;border:none;cursor:pointer;font-family:inherit}
.q-edit-btn:hover{color:var(--pr-fg-2)}

/* Open textarea */
.q-textarea{width:100%;background:transparent;border:none;border-bottom:1px solid var(--pr-input-border);
  color:var(--pr-input-fg);font-size:14px;font-family:inherit;resize:none;outline:none;padding:4px 0;line-height:1.6}

/* Choice / Checkbox options */
.q-option{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:6px;cursor:pointer;
  border:1px solid var(--pr-border-subtle);background:transparent;color:var(--pr-fg-2);margin-bottom:6px;transition:all .15s;font-size:14.5px}
.q-option.selected{border-color:var(--pr-btn-bg);background:var(--pr-hover);color:var(--pr-fg)}
.q-radio{width:16px;height:16px;border-radius:50%;border:1.5px solid var(--pr-border);flex-shrink:0;display:flex;align-items:center;justify-content:center}
.q-option.selected .q-radio{border-color:var(--pr-btn-bg)}
.q-radio-inner{width:7px;height:7px;border-radius:50%;background:var(--pr-btn-bg);display:none}
.q-option.selected .q-radio-inner{display:block}
.q-check{width:16px;height:16px;border-radius:3px;border:1.5px solid var(--pr-border);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--pr-btn-fg)}
.q-option.selected .q-check{background:var(--pr-btn-bg);border-color:var(--pr-btn-bg)}
.q-other-input{width:100%;background:transparent;border:none;border-bottom:1px solid var(--pr-input-border);
  color:var(--pr-input-fg);font-size:13px;outline:none;padding:6px 0;margin-top:4px;font-family:inherit}

/* Submit btn inside question */
.q-submit{margin-top:10px;padding:8px 18px;border-radius:6px;border:none;font-size:13px;font-family:inherit;cursor:pointer;float:right}
.q-submit.active{background:var(--pr-btn-bg);color:var(--pr-btn-fg)}
.q-submit.active:hover{background:var(--pr-btn-hover)}
.q-submit.inactive{background:var(--pr-border-subtle);color:var(--pr-fg-3);cursor:default}

/* Nudge */
.nudge{font-size:12.5px;color:var(--pr-fg-3);text-align:center;border:1px solid var(--pr-border-subtle);border-radius:8px;padding:14px 16px;margin-top:32px}

/* ---- FAB ---- */
.fab-stack{position:fixed;bottom:36px;right:24px;z-index:30;display:flex;flex-direction:column;gap:12px;align-items:center}
.fab-notes{width:44px;height:44px;border-radius:50%;background:var(--pr-bg-2);border:1px solid var(--pr-border-subtle);
  color:var(--pr-fg-3);font-size:16px;cursor:pointer;position:relative;display:flex;align-items:center;justify-content:center}
.fab-notes:hover{background:var(--pr-bg-3)}
.fab-badge{position:absolute;top:-3px;right:-3px;width:16px;height:16px;border-radius:50%;background:var(--pr-badge-bg);
  color:var(--pr-badge-fg);font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center}
.fab-write{width:52px;height:52px;border-radius:50%;background:var(--pr-bg-3);border:1px solid var(--pr-border-subtle);
  color:var(--pr-fg-2);font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.fab-write:hover{background:var(--pr-bg-2)}

/* ---- Overlay ---- */
.overlay{position:fixed;inset:0;z-index:40;opacity:0;pointer-events:none;transition:opacity .3s}
.overlay.open{opacity:1;pointer-events:auto}

/* ---- Sheet ---- */
.sheet{position:fixed;bottom:0;left:0;right:0;z-index:50;background:var(--pr-bg-3);
  border-top:1px solid var(--pr-border-subtle);border-radius:8px 8px 0 0;
  padding:20px 24px calc(env(safe-area-inset-bottom, 0px) + 28px);transform:translateY(110%);transition:transform .3s cubic-bezier(.32,.72,0,1);
  box-shadow:0 -8px 40px var(--pr-shadow)}
.sheet.open{transform:translateY(0)}
.sheet-handle{width:32px;height:3px;background:var(--pr-border-subtle);border-radius:2px;margin:0 auto 16px}
.sheet-ctx{font-size:12px;color:var(--pr-fg-2);font-style:italic;border-left:2px solid var(--pr-border);
  padding-left:10px;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.sheet textarea{width:100%;background:transparent;border:none;color:var(--pr-input-fg);font-size:16px;line-height:1.6;
  resize:none;outline:none;font-family:inherit}
.sheet-send{margin-top:12px;margin-bottom:8px;float:right;width:40px;height:40px;border-radius:50%;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center}
.sheet-send.active{background:var(--pr-btn-bg);color:var(--pr-btn-fg)}
.sheet-send.active:hover{background:var(--pr-btn-hover)}
.sheet-send.inactive{background:var(--pr-border-subtle);color:var(--pr-fg-3);cursor:default}

/* ---- Notes Panel ---- */
.panel-overlay{position:fixed;inset:0;background:var(--pr-overlay);z-index:60;opacity:0;pointer-events:none;transition:opacity .3s}
.panel-overlay.open{opacity:1;pointer-events:auto}
.panel{position:fixed;top:0;right:0;bottom:0;width:min(340px,92vw);z-index:70;background:var(--pr-bg-2);
  border-left:1px solid var(--pr-border-subtle);transform:translateX(100%);transition:transform .3s cubic-bezier(.32,.72,0,1);
  overflow-y:auto;display:flex;flex-direction:column}
.panel.open{transform:translateX(0)}
.panel-head{padding:52px 20px 16px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
.panel-title{font-size:13px;font-weight:600;color:var(--pr-fg)}
.panel-actions{display:flex;gap:8px;align-items:center}
.panel-export{font-size:11px;color:var(--pr-fg-3);background:none;border:1px solid var(--pr-border-subtle);border-radius:6px;
  padding:4px 10px;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:5px;transition:all .2s}
.panel-export:hover{color:var(--pr-fg-2);border-color:var(--pr-border)}
.panel-export.copilot-dim{color:rgba(55,148,255,.6);border-color:rgba(55,148,255,.2);background:rgba(55,148,255,.06)}
.panel-export.copilot-dim:hover{color:rgba(55,148,255,.8);border-color:rgba(55,148,255,.4)}
.panel-export.copilot-active{color:var(--pr-btn-fg);border-color:var(--pr-btn-bg);background:var(--pr-btn-bg)}
.panel-export.copilot-active:hover{background:var(--pr-btn-hover)}
.panel-close{font-size:18px;color:var(--pr-fg-3);background:none;border:none;cursor:pointer}
.panel-close:hover{color:var(--pr-fg-2)}
.panel-section{padding:0 20px 16px}
.panel-label{font-size:10px;color:var(--pr-fg-3);text-transform:uppercase;font-family:monospace;letter-spacing:1px;margin-bottom:10px;margin-top:16px}
.panel-q-item{margin-bottom:14px;padding:6px 8px;border-radius:6px;transition:background .15s}
.panel-q-item:hover{background:var(--pr-hover)}
.panel-q-question{font-size:11px;color:var(--pr-fg-3);margin-bottom:3px}
.panel-q-answer{font-size:13.5px;color:var(--pr-fg)}
.panel-c-item{margin-bottom:14px;padding:6px 8px;border-radius:6px;transition:background .15s}
.panel-c-item:hover{background:var(--pr-hover)}
.panel-c-ctx{font-size:11px;color:var(--pr-fg-3);font-style:italic;border-left:2px solid var(--pr-border-subtle);padding-left:8px;margin-bottom:3px}
.panel-c-note{font-size:13px;color:var(--pr-fg)}
.panel-c-label{font-size:10px;color:var(--pr-fg-3);font-family:monospace;margin-bottom:3px}
.panel-footer{padding:16px 20px 28px;flex-shrink:0;margin-top:auto}
.panel-dl{width:100%;padding:12px;border-radius:8px;background:var(--pr-btn-bg);color:var(--pr-btn-fg);border:none;
  font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:all .2s}
.panel-dl:hover{background:var(--pr-btn-hover)}
.panel-dl.copilot-dim{background:rgba(55,148,255,.12);color:rgba(55,148,255,.65);border:1px solid rgba(55,148,255,.2)}
.panel-dl.copilot-dim:hover{background:rgba(55,148,255,.2);color:rgba(55,148,255,.8)}
.panel-dl.copilot-active{background:var(--pr-btn-bg);color:var(--pr-btn-fg);border:none}
.panel-dl.copilot-active:hover{background:var(--pr-btn-hover)}
.panel-dl-cap{font-size:11px;color:var(--pr-fg-3);text-align:center;margin-top:6px}
.panel-empty{color:var(--pr-fg-3);font-size:13px;padding:40px 20px;text-align:center}

/* Terminal / Clipboard icon buttons in header */
.panel-terminal,.panel-clipboard{font-size:11px;color:var(--pr-fg-3);background:none;border:1px solid var(--pr-border-subtle);border-radius:6px;
  padding:4px 8px;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:4px;transition:all .2s}
.panel-terminal:hover,.panel-clipboard:hover{color:var(--pr-fg);border-color:var(--pr-border)}
.panel-terminal.terminal-active,.panel-clipboard.clipboard-active{color:var(--pr-fg-2);border-color:var(--pr-border)}

/* Terminal / Clipboard full-width footer buttons */
.panel-dl-terminal,.panel-dl-clipboard{width:100%;padding:10px;border-radius:8px;background:none;color:var(--pr-fg-2);border:1px solid var(--pr-border-subtle);
  font-size:13px;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:all .2s;margin-top:8px}
.panel-dl-terminal:hover,.panel-dl-clipboard:hover{color:var(--pr-fg);border-color:var(--pr-border);background:var(--pr-hover)}

/* Toast */
.toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%) translateY(20px);
  background:var(--pr-toast-bg);color:var(--pr-fg);font-size:13px;padding:8px 18px;border-radius:6px;opacity:0;
  transition:all .3s ease;pointer-events:none;z-index:80;border:1px solid var(--pr-toast-border)}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

/* Block highlight flash */
@keyframes flash{0%{background:var(--pr-hover)}100%{background:transparent}}
.block-flash{animation:flash .8s ease-out}

/* Sheet hint */
.sheet-hint{font-size:11px;color:var(--pr-fg-3);margin-top:6px;clear:both}

/* Progress bar */
.nudge-bar{height:3px;border-radius:2px;background:var(--pr-border-subtle);margin-top:10px;overflow:hidden}
.nudge-bar-fill{height:100%;background:var(--pr-progress);border-radius:2px;transition:width .4s ease}

/* Delete button in panel */
.panel-delete{font-size:11px;color:var(--pr-fg-3);background:none;border:none;cursor:pointer;float:right;margin-top:-2px}
.panel-delete:hover{color:var(--pr-error)}

/* Scroll progress bar */
.scroll-progress{position:fixed;top:0;left:0;width:0%;height:2px;background:var(--pr-progress);z-index:90;transition:width .1s linear;border-radius:0 0 2px 0}

.outline{position:fixed;top:0;left:0;bottom:0;width:200px;z-index:20;padding:60px 16px 40px;
  overflow-y:auto;display:none}
.outline-item{display:block;font-size:12px;color:var(--pr-fg-3);padding:4px 0;cursor:pointer;
  text-decoration:none;transition:color .15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.outline-item:hover{color:var(--pr-fg-2)}
.outline-item.active{color:var(--pr-accent)}
.outline-item.level-h1{font-weight:600;color:var(--pr-fg-2);font-size:13px;margin-top:8px}
.outline-item.level-h2{padding-left:8px;margin-top:6px}
.outline-item.level-h3{padding-left:16px}

/* Mobile outline: overlay drawer */
.outline-toggle{position:fixed;top:16px;left:16px;z-index:25;width:36px;height:36px;border-radius:50%;
  background:var(--pr-bg-2);border:1px solid var(--pr-border-subtle);color:var(--pr-fg-3);font-size:14px;cursor:pointer;
  display:flex;align-items:center;justify-content:center}
.outline-toggle:hover{background:var(--pr-bg-3);color:var(--pr-fg-2)}
@media(max-width:1099px){
  .outline{background:var(--pr-bg-2);border-right:1px solid var(--pr-border-subtle);z-index:75;
    transform:translateX(-100%);transition:transform .3s cubic-bezier(.32,.72,0,1);display:block}
  .outline.open{transform:translateX(0)}
}
@media(min-width:1100px){
  .outline{display:block}
  .outline-toggle{display:none}
  .doc{margin-left:200px}
}

.outline-overlay{position:fixed;inset:0;z-index:74;background:var(--pr-overlay);opacity:0;pointer-events:none;transition:opacity .3s}
.outline-overlay.open{opacity:1;pointer-events:auto}

/* ---- Desktop: panel always open ---- */
@media(min-width:800px){
  body{margin-right:340px}
  .panel{transform:translateX(0)}
  .panel-overlay{display:none!important}
  .panel-close{display:none}
  .fab-notes{display:none}
  .sheet{right:340px;border-radius:8px 0 0 0}
  .fab-stack{right:calc(340px + 24px)}
}
`;
