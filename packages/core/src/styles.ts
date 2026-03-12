const LIGHT_VARS = `
  --bg-body:#f8f9fa;--bg-surface:#fff;--bg-elevated:#f0f0f0;--bg-code:#f6f8fa;
  --bg-code-header:#eef1f5;--bg-hover:#e0e0e0;--bg-fab:#f0f0f0;--bg-fab-hover:#e0e0e0;
  --bg-button:#e8e8e8;--bg-inverted:#111;--bg-inverted-hover:#333;
  --bg-inline-code:rgba(0,0,0,.07);--bg-drag:#e8f0ff;
  --text-heading:#111;--text-secondary:#333;--text-body:#555;--text-sub-heading:#444;
  --text-muted:#666;--text-faint:#888;--text-dimmed:#999;--text-dimmed-hover:#555;
  --text-ghost:#bbb;--text-input:#1a1a1a;--text-inline-code:#222;--text-inverted:#fff;
  --text-code:#334;--text-code-meta:#6b8cb5;--text-code-meta-hover:#4a6d90;
  --accent-purple:#8b5cf6;--accent-link:#0077cc;--accent-error:#dc3545;--accent-error-hover:#c82333;
  --accent-blue:#0969da;--accent-blue-hover:#0550ae;
  --border-subtle:rgba(0,0,0,.06);--border-light:rgba(0,0,0,.08);
  --border-medium:rgba(0,0,0,.1);--border-strong:rgba(0,0,0,.12);
  --border-accent:rgba(0,0,0,.15);--border-quote:#d0d0d0;--border-radio:#bbb;--border-button:#ccc;
  --surface-hover:rgba(0,0,0,.03);--surface-subtle:rgba(0,0,0,.02);
  --surface-selected:rgba(0,0,0,.05);--surface-handle:rgba(0,0,0,.1);
  --surface-quote-border:rgba(0,0,0,.2);
  --overlay-bg:rgba(0,0,0,.3);--overlay-outline:rgba(0,0,0,.2);--shadow-color:rgba(0,0,0,.1);
  --flash-start:rgba(139,92,246,.12);
  --copilot-dim-text:rgba(9,105,218,.6);--copilot-dim-border:rgba(9,105,218,.2);
  --copilot-dim-bg:rgba(9,105,218,.06);--copilot-dim-text-hover:rgba(9,105,218,.75);
  --copilot-dim-border-hover:rgba(9,105,218,.35);
  --copilot-dl-bg:rgba(9,105,218,.1);--copilot-dl-bg-hover:rgba(9,105,218,.15)`;

export const CSS_VARS = `
:root {
  --bg-body:#111;--bg-surface:#161616;--bg-elevated:#1a1a1a;--bg-code:#0d1117;
  --bg-code-header:#0a0e16;--bg-hover:#222;--bg-fab:#1e1e1e;--bg-fab-hover:#262626;
  --bg-button:#2a2a2a;--bg-inverted:#fff;--bg-inverted-hover:#e8e8e8;
  --bg-inline-code:rgba(255,255,255,.1);--bg-drag:#1a1a2e;
  --text-heading:#fff;--text-secondary:#ccc;--text-body:#999;--text-sub-heading:#aaa;
  --text-muted:#777;--text-faint:#555;--text-dimmed:#444;--text-dimmed-hover:#888;
  --text-ghost:#333;--text-input:#e0e0e0;--text-inline-code:#ddd;--text-inverted:#111;
  --text-code:#bbc;--text-code-meta:#3d5070;--text-code-meta-hover:#5a7da0;
  --accent-purple:#c792ea;--accent-link:#6cf;--accent-error:#f55;--accent-error-hover:#e55;
  --accent-blue:#388bfd;--accent-blue-hover:#1f6feb;
  --border-subtle:rgba(255,255,255,.06);--border-light:rgba(255,255,255,.07);
  --border-medium:rgba(255,255,255,.1);--border-strong:rgba(255,255,255,.13);
  --border-accent:rgba(255,255,255,.18);--border-quote:#333;--border-radio:#444;--border-button:#444;
  --surface-hover:rgba(255,255,255,.04);--surface-subtle:rgba(255,255,255,.02);
  --surface-selected:rgba(255,255,255,.07);--surface-handle:rgba(255,255,255,.1);
  --surface-quote-border:rgba(255,255,255,.25);
  --overlay-bg:rgba(0,0,0,.5);--overlay-outline:rgba(0,0,0,.4);--shadow-color:rgba(0,0,0,.6);
  --flash-start:rgba(199,146,234,.15);
  --copilot-dim-text:rgba(56,132,255,.55);--copilot-dim-border:rgba(56,132,255,.2);
  --copilot-dim-bg:rgba(56,132,255,.06);--copilot-dim-text-hover:rgba(56,132,255,.75);
  --copilot-dim-border-hover:rgba(56,132,255,.35);
  --copilot-dl-bg:rgba(56,132,255,.15);--copilot-dl-bg-hover:rgba(56,132,255,.22)
}
/* System theme: light when OS says so, unless forced dark */
@media(prefers-color-scheme:light){:root:not(.theme-dark){${LIGHT_VARS}}}
/* Forced light (VS Code light theme with autoDetect off) */
:root.theme-light{${LIGHT_VARS}}
`;

export const CSS = `${CSS_VARS}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%;color-scheme:light dark}
body{background:var(--bg-body);color:var(--text-body);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;overflow-x:hidden;
  text-rendering:optimizeLegibility}
.doc{max-width:580px;margin:0 auto;padding:60px 28px 160px}

/* Block hover */
.block{cursor:pointer;border-radius:6px;padding:3px 6px;margin:2px -6px;position:relative;transition:background .15s}
.block:hover{background:var(--surface-hover)}

/* Typography */
.el-h1{font-size:26px;font-weight:700;color:var(--text-heading);letter-spacing:-.4px;line-height:1.3;margin-top:28px}
.el-h2{font-size:12px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:1.3px;margin-top:36px}
.el-h3{font-size:14px;font-weight:600;color:var(--text-sub-heading);margin-top:18px}
.el-p{font-size:15px;color:var(--text-body);line-height:1.8;margin-top:8px;letter-spacing:.01em}
.el-li{font-size:15px;color:var(--text-secondary);line-height:1.8;padding-left:18px;position:relative;margin-top:5px}
.el-li::before{content:"●";position:absolute;left:0;color:var(--text-faint);font-size:7px;top:7px}
.el-ol{font-size:15px;color:var(--text-secondary);line-height:1.8;padding-left:18px;position:relative;margin-top:5px}
.el-ol::before{content:"–";position:absolute;left:2px;color:var(--text-faint);font-size:15px}
.el-quote{border-left:2px solid var(--border-quote);padding-left:16px;color:var(--text-sub-heading);font-style:italic;font-size:15px;line-height:1.8;margin-top:8px}

/* Images */
.doc img{max-width:100%;height:auto;border-radius:8px;margin-top:10px}

/* Code blocks */
.code-wrap{background:var(--bg-code);border:1px solid var(--border-subtle);border-radius:10px;overflow:hidden;margin-top:10px}
.code-header{background:var(--bg-code-header);padding:7px 14px;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center}
.code-lang{color:var(--text-code-meta);font-family:'Fira Code','JetBrains Mono',monospace;text-transform:uppercase;font-size:11px}
.code-copy{background:none;border:none;color:var(--text-code-meta);font-size:11px;cursor:pointer;font-family:inherit}
.code-copy:hover{color:var(--text-code-meta-hover)}
.code-body{padding:16px;font-size:13.5px;line-height:1.75;font-family:'Fira Code','JetBrains Mono',monospace;
  color:var(--text-code);overflow-x:auto;white-space:pre}

/* Shiki output styling */
.code-body pre{margin:0;padding:0;background:transparent!important}
.code-body code{font-family:inherit;font-size:inherit;line-height:inherit;background:transparent}
.code-body .shiki{background:transparent!important}

/* Shiki dual-theme: dark by default, light via media query or forced class */
.shiki,.shiki span{color:var(--shiki-dark)!important;background-color:transparent!important}
@media(prefers-color-scheme:light){:root:not(.theme-dark) .shiki,:root:not(.theme-dark) .shiki span{color:var(--shiki-light)!important}}
.theme-light .shiki,.theme-light .shiki span{color:var(--shiki-light)!important}

/* Mermaid diagrams */
.mermaid-body{padding:16px;display:flex;justify-content:center;overflow-x:auto}
.mermaid-body svg{max-width:100%;height:auto}

/* Annotation dot */
.ann-dot{position:absolute;left:-14px;top:50%;transform:translateY(-50%);width:7px;height:7px;border-radius:50%;background:var(--accent-purple)}
.code-wrap .ann-dot{left:-14px;top:14px;transform:none}

/* Inline markdown */
.doc strong{color:var(--text-heading);font-weight:600}
.doc code.inline{font-family:monospace;font-size:.87em;background:var(--bg-inline-code);color:var(--text-inline-code);padding:2px 6px;border-radius:3px}

/* ---- Question Blocks ---- */
.q-block{margin:16px -6px;border-radius:12px;overflow:hidden;transition:all .2s}
.q-block.unanswered{border:1px solid var(--border-strong);background:var(--surface-hover)}
.q-block.answered{border:1px solid var(--border-light);background:var(--surface-subtle);transition:background .15s}
.q-block.answered:hover{background:var(--surface-hover)}
.q-header{padding:14px 16px 10px;display:flex;gap:10px;align-items:flex-start}
.q-block.unanswered .q-header{border-bottom:1px solid var(--border-light)}
.q-icon{font-size:9px;color:var(--text-faint);text-transform:uppercase;letter-spacing:1px;font-family:monospace;flex-shrink:0;margin-top:3px}
.q-text{flex:1;font-size:15px;line-height:1.55}
.q-block.unanswered .q-text{color:var(--text-inline-code);font-weight:500}
.q-block.answered .q-text{color:var(--text-muted);font-weight:400}
.q-dismiss{font-size:18px;color:var(--text-dimmed);cursor:pointer;background:none;border:none;line-height:1;padding:0 2px;flex-shrink:0}
.q-dismiss:hover{color:var(--text-dimmed-hover)}
.q-body{padding:10px 16px 14px}

/* Answer summary */
.q-answer-row{padding:10px 16px 14px;display:flex;align-items:center;justify-content:space-between}
.q-answer-text{font-size:13.5px;color:var(--text-sub-heading)}
.q-edit-btn{font-size:11px;color:var(--text-dimmed);background:none;border:none;cursor:pointer;font-family:inherit}
.q-edit-btn:hover{color:var(--text-dimmed-hover)}

/* Open textarea */
.q-textarea{width:100%;background:transparent;border:none;border-bottom:1px solid var(--border-medium);
  color:var(--text-input);font-size:14px;font-family:inherit;resize:none;outline:none;padding:4px 0;line-height:1.6}

/* Choice / Checkbox options */
.q-option{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;
  border:1px solid var(--border-light);background:transparent;color:var(--text-sub-heading);margin-bottom:6px;transition:all .15s;font-size:14.5px}
.q-option.selected{border-color:var(--border-accent);background:var(--surface-selected);color:var(--text-heading)}
.q-radio{width:16px;height:16px;border-radius:50%;border:1.5px solid var(--border-radio);flex-shrink:0;display:flex;align-items:center;justify-content:center}
.q-option.selected .q-radio{border-color:var(--text-heading)}
.q-radio-inner{width:7px;height:7px;border-radius:50%;background:var(--text-heading);display:none}
.q-option.selected .q-radio-inner{display:block}
.q-check{width:16px;height:16px;border-radius:4px;border:1.5px solid var(--border-radio);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text-inverted)}
.q-option.selected .q-check{background:var(--text-heading);border-color:var(--text-heading)}
.q-other-input{width:100%;background:transparent;border:none;border-bottom:1px solid var(--border-medium);
  color:var(--text-input);font-size:13px;outline:none;padding:6px 0;margin-top:4px;font-family:inherit}

/* Submit btn inside question */
.q-submit{margin-top:10px;padding:8px 18px;border-radius:8px;border:none;font-size:13px;font-family:inherit;cursor:pointer;float:right}
.q-submit.active{background:var(--bg-inverted);color:var(--text-inverted)}
.q-submit.inactive{background:var(--border-subtle);color:var(--text-ghost);cursor:default}

/* Nudge */
.nudge{font-size:12.5px;color:var(--text-dimmed);text-align:center;border:1px solid var(--border-subtle);border-radius:10px;padding:14px 16px;margin-top:32px}

/* ---- FAB ---- */
.fab-stack{position:fixed;bottom:36px;right:24px;z-index:30;display:flex;flex-direction:column;gap:12px;align-items:center}
.fab-notes{width:44px;height:44px;border-radius:50%;background:var(--bg-elevated);border:1px solid var(--border-medium);
  color:var(--text-faint);font-size:16px;cursor:pointer;position:relative;display:flex;align-items:center;justify-content:center}
.fab-notes:hover{background:var(--bg-hover)}
.fab-badge{position:absolute;top:-3px;right:-3px;width:16px;height:16px;border-radius:50%;background:var(--bg-inverted);
  color:var(--text-inverted);font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center}
.fab-write{width:52px;height:52px;border-radius:50%;background:var(--bg-fab);border:1px solid var(--border-medium);
  color:var(--text-muted);font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.fab-write:hover{background:var(--bg-fab-hover)}

/* ---- Overlay ---- */
.overlay{position:fixed;inset:0;z-index:40;opacity:0;pointer-events:none;transition:opacity .3s}
.overlay.open{opacity:1;pointer-events:auto}

/* ---- Sheet ---- */
.sheet{position:fixed;bottom:0;left:0;right:0;z-index:50;background:var(--bg-surface);
  border-top:1px solid var(--border-light);border-radius:16px 16px 0 0;
  padding:20px 24px calc(env(safe-area-inset-bottom, 0px) + 28px);transform:translateY(110%);transition:transform .3s cubic-bezier(.32,.72,0,1);
  box-shadow:0 -8px 40px var(--shadow-color)}
.sheet.open{transform:translateY(0)}
.sheet-handle{width:32px;height:3px;background:var(--surface-handle);border-radius:2px;margin:0 auto 16px}
.sheet-ctx{font-size:12px;color:var(--text-sub-heading);font-style:italic;border-left:2px solid var(--surface-quote-border);
  padding-left:10px;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.sheet textarea{width:100%;background:transparent;border:none;color:var(--text-input);font-size:16px;line-height:1.6;
  resize:none;outline:none;font-family:inherit}
.sheet-send{margin-top:12px;margin-bottom:8px;float:right;width:40px;height:40px;border-radius:50%;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center}
.sheet-send.active{background:var(--bg-inverted);color:var(--text-inverted)}
.sheet-send.inactive{background:var(--border-subtle);color:var(--text-ghost);cursor:default}

/* ---- Notes Panel ---- */
.panel-overlay{position:fixed;inset:0;background:var(--overlay-bg);z-index:60;opacity:0;pointer-events:none;transition:opacity .3s}
.panel-overlay.open{opacity:1;pointer-events:auto}
.panel{position:fixed;top:0;right:0;bottom:0;width:min(340px,92vw);z-index:70;background:var(--bg-surface);
  border-left:1px solid var(--border-light);transform:translateX(100%);transition:transform .3s cubic-bezier(.32,.72,0,1);
  overflow-y:auto;display:flex;flex-direction:column}
.panel.open{transform:translateX(0)}
.panel-head{padding:52px 20px 16px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
.panel-title{font-size:13px;font-weight:600;color:var(--text-input)}
.panel-actions{display:flex;gap:12px;align-items:center}
.panel-export{font-size:11px;color:var(--text-faint);background:none;border:1px solid var(--border-medium);border-radius:6px;
  padding:4px 10px;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:5px;transition:all .2s}
.panel-export:hover{color:var(--text-sub-heading);border-color:var(--border-accent)}
.panel-export.copilot-dim{color:var(--copilot-dim-text);border-color:var(--copilot-dim-border);background:var(--copilot-dim-bg)}
.panel-export.copilot-dim:hover{color:var(--copilot-dim-text-hover);border-color:var(--copilot-dim-border-hover)}
.panel-export.copilot-active{color:#fff;border-color:var(--accent-blue);background:var(--accent-blue)}
.panel-export.copilot-active:hover{background:var(--accent-blue-hover)}
.panel-close{font-size:18px;color:var(--text-dimmed);background:none;border:none;cursor:pointer}
.panel-close:hover{color:var(--text-dimmed-hover)}
.panel-section{padding:0 20px 16px}
.panel-label{font-size:10px;color:var(--text-dimmed);text-transform:uppercase;font-family:monospace;letter-spacing:1px;margin-bottom:10px;margin-top:16px}
.panel-q-item{margin-bottom:14px;padding:6px 8px;border-radius:6px;transition:background .15s}
.panel-q-item:hover{background:var(--surface-hover)}
.panel-q-question{font-size:11px;color:var(--text-faint)}
.panel-q-answer{font-size:13.5px;color:var(--text-secondary)}
.panel-c-item{margin-bottom:14px;padding:6px 8px;border-radius:6px;transition:background .15s}
.panel-c-item:hover{background:var(--surface-hover)}
.panel-c-ctx{font-size:11px;color:var(--text-ghost);font-style:italic;border-left:2px solid var(--border-light);padding-left:8px;margin-bottom:3px}
.panel-c-note{font-size:13px;color:var(--text-secondary)}
.panel-c-label{font-size:10px;color:var(--text-dimmed);font-family:monospace;margin-bottom:3px}
.panel-footer{padding:16px 20px 28px;flex-shrink:0;margin-top:auto}
.panel-dl{width:100%;padding:12px;border-radius:10px;background:var(--bg-inverted);color:var(--text-inverted);border:none;
  font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:all .2s}
.panel-dl:hover{background:var(--bg-inverted-hover)}
.panel-dl.copilot-dim{background:var(--copilot-dl-bg);color:var(--copilot-dim-text);border:1px solid var(--copilot-dl-bg)}
.panel-dl.copilot-dim:hover{background:var(--copilot-dl-bg-hover);color:var(--copilot-dim-text-hover)}
.panel-dl.copilot-active{background:var(--accent-blue);color:#fff;border:none}
.panel-dl.copilot-active:hover{background:var(--accent-blue-hover)}
.panel-dl-cap{font-size:11px;color:var(--text-ghost);text-align:center;margin-top:6px}
.panel-empty{color:var(--text-ghost);font-size:13px;padding:40px 20px;text-align:center}

/* Toast */
.toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%) translateY(20px);
  background:var(--bg-hover);color:var(--text-secondary);font-size:13px;padding:8px 18px;border-radius:8px;opacity:0;
  transition:all .3s ease;pointer-events:none;z-index:80;border:1px solid var(--border-light)}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

/* Block highlight flash */
@keyframes flash{0%{background:var(--flash-start)}100%{background:transparent}}
.block-flash{animation:flash .8s ease-out}

/* Sheet hint */
.sheet-hint{font-size:11px;color:var(--text-dimmed);margin-top:6px;clear:both}

/* Progress bar */
.nudge-bar{height:3px;border-radius:2px;background:var(--border-subtle);margin-top:10px;overflow:hidden}
.nudge-bar-fill{height:100%;background:var(--accent-purple);border-radius:2px;transition:width .4s ease}

/* Delete button in panel */
.panel-delete{font-size:11px;color:var(--text-dimmed);background:none;border:none;cursor:pointer;float:right;margin-top:-2px}
.panel-delete:hover{color:var(--accent-error-hover)}

/* Scroll progress bar */
.scroll-progress{position:fixed;top:0;left:0;width:0%;height:3px;background:var(--accent-purple);z-index:90;transition:width .1s linear;border-radius:0 0 2px 0}

.outline{position:fixed;top:0;left:0;bottom:0;width:200px;z-index:20;padding:60px 16px 40px;
  overflow-y:auto;display:none}
.outline-item{display:block;font-size:12px;color:var(--text-dimmed);padding:4px 0;cursor:pointer;
  text-decoration:none;transition:color .15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.outline-item:hover{color:var(--text-sub-heading)}
.outline-item.active{color:var(--accent-purple)}
.outline-item.level-h1{font-weight:600;color:var(--text-muted);font-size:13px;margin-top:8px}
.outline-item.level-h2{padding-left:8px;margin-top:6px}
.outline-item.level-h3{padding-left:16px}

/* Mobile outline: overlay drawer */
.outline-toggle{position:fixed;top:16px;left:16px;z-index:25;width:36px;height:36px;border-radius:50%;
  background:var(--bg-elevated);border:1px solid var(--border-medium);color:var(--text-muted);font-size:14px;cursor:pointer;
  display:flex;align-items:center;justify-content:center}
.outline-toggle:hover{background:var(--bg-hover);color:var(--text-sub-heading)}
@media(max-width:1099px){
  .outline{background:var(--bg-surface);border-right:1px solid var(--border-light);z-index:75;
    transform:translateX(-100%);transition:transform .3s cubic-bezier(.32,.72,0,1);display:block}
  .outline.open{transform:translateX(0)}
}
@media(min-width:1100px){
  .outline{display:block}
  .outline-toggle{display:none}
  .doc{margin-left:200px}
}

.outline-overlay{position:fixed;inset:0;z-index:74;background:var(--overlay-outline);opacity:0;pointer-events:none;transition:opacity .3s}
.outline-overlay.open{opacity:1;pointer-events:auto}

/* ---- Desktop: panel always open ---- */
@media(min-width:800px){
  body{margin-right:340px}
  .panel{transform:translateX(0)}
  .panel-overlay{display:none!important}
  .panel-close{display:none}
  .fab-notes{display:none}
  .sheet{right:340px;border-radius:16px 0 0 0}
  .fab-stack{right:calc(340px + 24px)}
}
`;
