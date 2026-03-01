export const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
body{background:#111;color:#999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;overflow-x:hidden;
  text-rendering:optimizeLegibility}
.doc{max-width:580px;margin:0 auto;padding:60px 28px 160px}

/* Block hover */
.block{cursor:pointer;border-radius:6px;padding:3px 6px;margin:2px -6px;position:relative;transition:background .15s}
.block:hover{background:rgba(255,255,255,.04)}

/* Typography */
.el-h1{font-size:26px;font-weight:700;color:#fff;letter-spacing:-.4px;line-height:1.3;margin-top:28px}
.el-h2{font-size:12px;font-weight:600;color:#777;text-transform:uppercase;letter-spacing:1.3px;margin-top:36px}
.el-h3{font-size:14px;font-weight:600;color:#aaa;margin-top:18px}
.el-p{font-size:15px;color:#999;line-height:1.8;margin-top:8px;letter-spacing:.01em}
.el-li{font-size:15px;color:#ccc;line-height:1.8;padding-left:18px;position:relative;margin-top:5px}
.el-li::before{content:"●";position:absolute;left:0;color:#555;font-size:7px;top:7px}
.el-ol{font-size:15px;color:#ccc;line-height:1.8;padding-left:18px;position:relative;margin-top:5px}
.el-ol::before{content:"–";position:absolute;left:2px;color:#555;font-size:15px}
.el-quote{border-left:2px solid #333;padding-left:16px;color:#aaa;font-style:italic;font-size:15px;line-height:1.8;margin-top:8px}

/* Images */
.doc img{max-width:100%;height:auto;border-radius:8px;margin-top:10px}

/* Code blocks */
.code-wrap{background:#0d1117;border:1px solid rgba(255,255,255,.06);border-radius:10px;overflow:hidden;margin-top:10px}
.code-header{background:#0a0e16;padding:7px 14px;border-bottom:1px solid rgba(255,255,255,.05);display:flex;justify-content:space-between;align-items:center}
.code-lang{color:#3d5070;font-family:'Fira Code','JetBrains Mono',monospace;text-transform:uppercase;font-size:11px}
.code-copy{background:none;border:none;color:#3d5070;font-size:11px;cursor:pointer;font-family:inherit}
.code-copy:hover{color:#5a7da0}
.code-body{padding:16px;font-size:13.5px;line-height:1.75;font-family:'Fira Code','JetBrains Mono',monospace;
  color:#bbc;overflow-x:auto;white-space:pre}

/* Shiki output styling */
.code-body pre{margin:0;padding:0;background:transparent!important}
.code-body code{font-family:inherit;font-size:inherit;line-height:inherit;background:transparent}
.code-body .shiki{background:transparent!important}

/* Mermaid diagrams */
.mermaid-body{padding:16px;display:flex;justify-content:center;overflow-x:auto}
.mermaid-body svg{max-width:100%;height:auto}

/* Annotation dot */
.ann-dot{position:absolute;left:-14px;top:50%;transform:translateY(-50%);width:7px;height:7px;border-radius:50%;background:#c792ea}
.code-wrap .ann-dot{left:-14px;top:14px;transform:none}

/* Inline markdown */
.doc strong{color:#fff;font-weight:600}
.doc code.inline{font-family:monospace;font-size:.87em;background:rgba(255,255,255,.1);color:#ddd;padding:2px 6px;border-radius:3px}

/* ---- Question Blocks ---- */
.q-block{margin:16px -6px;border-radius:12px;overflow:hidden;transition:all .2s}
.q-block.unanswered{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.04)}
.q-block.answered{border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);transition:background .15s}
.q-block.answered:hover{background:rgba(255,255,255,.05)}
.q-header{padding:14px 16px 10px;display:flex;gap:10px;align-items:flex-start}
.q-block.unanswered .q-header{border-bottom:1px solid rgba(255,255,255,.07)}
.q-icon{font-size:9px;color:#555;text-transform:uppercase;letter-spacing:1px;font-family:monospace;flex-shrink:0;margin-top:3px}
.q-text{flex:1;font-size:15px;line-height:1.55}
.q-block.unanswered .q-text{color:#ddd;font-weight:500}
.q-block.answered .q-text{color:#666;font-weight:400}
.q-dismiss{font-size:18px;color:#444;cursor:pointer;background:none;border:none;line-height:1;padding:0 2px;flex-shrink:0}
.q-dismiss:hover{color:#888}
.q-body{padding:10px 16px 14px}

/* Answer summary */
.q-answer-row{padding:10px 16px 14px;display:flex;align-items:center;justify-content:space-between}
.q-answer-text{font-size:13.5px;color:#aaa}
.q-edit-btn{font-size:11px;color:#444;background:none;border:none;cursor:pointer;font-family:inherit}
.q-edit-btn:hover{color:#888}

/* Open textarea */
.q-textarea{width:100%;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,.1);
  color:#e0e0e0;font-size:14px;font-family:inherit;resize:none;outline:none;padding:4px 0;line-height:1.6}

/* Choice / Checkbox options */
.q-option{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;
  border:1px solid rgba(255,255,255,.07);background:transparent;color:#aaa;margin-bottom:6px;transition:all .15s;font-size:14.5px}
.q-option.selected{border-color:rgba(255,255,255,.18);background:rgba(255,255,255,.07);color:#fff}
.q-radio{width:16px;height:16px;border-radius:50%;border:1.5px solid #444;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.q-option.selected .q-radio{border-color:#fff}
.q-radio-inner{width:7px;height:7px;border-radius:50%;background:#fff;display:none}
.q-option.selected .q-radio-inner{display:block}
.q-check{width:16px;height:16px;border-radius:4px;border:1.5px solid #444;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;color:#111}
.q-option.selected .q-check{background:#fff;border-color:#fff}
.q-other-input{width:100%;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,.1);
  color:#e0e0e0;font-size:13px;outline:none;padding:6px 0;margin-top:4px;font-family:inherit}

/* Submit btn inside question */
.q-submit{margin-top:10px;padding:8px 18px;border-radius:8px;border:none;font-size:13px;font-family:inherit;cursor:pointer;float:right}
.q-submit.active{background:#fff;color:#111}
.q-submit.inactive{background:rgba(255,255,255,.06);color:#333;cursor:default}

/* Nudge */
.nudge{font-size:12.5px;color:#444;text-align:center;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:14px 16px;margin-top:32px}

/* ---- FAB ---- */
.fab-stack{position:fixed;bottom:36px;right:24px;z-index:30;display:flex;flex-direction:column;gap:12px;align-items:center}
.fab-notes{width:44px;height:44px;border-radius:50%;background:#1a1a1a;border:1px solid rgba(255,255,255,.1);
  color:#555;font-size:16px;cursor:pointer;position:relative;display:flex;align-items:center;justify-content:center}
.fab-notes:hover{background:#222}
.fab-badge{position:absolute;top:-3px;right:-3px;width:16px;height:16px;border-radius:50%;background:#fff;
  color:#111;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center}
.fab-write{width:52px;height:52px;border-radius:50%;background:#1e1e1e;border:1px solid rgba(255,255,255,.12);
  color:#777;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.fab-write:hover{background:#262626}

/* ---- Overlay ---- */
.overlay{position:fixed;inset:0;z-index:40;opacity:0;pointer-events:none;transition:opacity .3s}
.overlay.open{opacity:1;pointer-events:auto}

/* ---- Sheet ---- */
.sheet{position:fixed;bottom:0;left:0;right:0;z-index:50;background:#171717;
  border-top:1px solid rgba(255,255,255,.07);border-radius:16px 16px 0 0;
  padding:20px 24px calc(env(safe-area-inset-bottom, 0px) + 28px);transform:translateY(110%);transition:transform .3s cubic-bezier(.32,.72,0,1);
  box-shadow:0 -8px 40px rgba(0,0,0,.6)}
.sheet.open{transform:translateY(0)}
.sheet-handle{width:32px;height:3px;background:rgba(255,255,255,.1);border-radius:2px;margin:0 auto 16px}
.sheet-ctx{font-size:12px;color:#aaa;font-style:italic;border-left:2px solid rgba(255,255,255,.25);
  padding-left:10px;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.sheet textarea{width:100%;background:transparent;border:none;color:#e0e0e0;font-size:16px;line-height:1.6;
  resize:none;outline:none;font-family:inherit}
.sheet-send{margin-top:12px;margin-bottom:8px;float:right;width:40px;height:40px;border-radius:50%;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center}
.sheet-send.active{background:#fff;color:#111}
.sheet-send.inactive{background:rgba(255,255,255,.06);color:#333;cursor:default}

/* ---- Notes Panel ---- */
.panel-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:60;opacity:0;pointer-events:none;transition:opacity .3s}
.panel-overlay.open{opacity:1;pointer-events:auto}
.panel{position:fixed;top:0;right:0;bottom:0;width:min(340px,92vw);z-index:70;background:#161616;
  border-left:1px solid rgba(255,255,255,.07);transform:translateX(100%);transition:transform .3s cubic-bezier(.32,.72,0,1);
  overflow-y:auto;display:flex;flex-direction:column}
.panel.open{transform:translateX(0)}
.panel-head{padding:52px 20px 16px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
.panel-title{font-size:13px;font-weight:600;color:#e0e0e0}
.panel-actions{display:flex;gap:12px;align-items:center}
.panel-export{font-size:11px;color:#555;background:none;border:1px solid rgba(255,255,255,.1);border-radius:6px;
  padding:4px 10px;cursor:pointer;font-family:inherit}
.panel-export:hover{color:#aaa;border-color:rgba(255,255,255,.2)}
.panel-close{font-size:18px;color:#444;background:none;border:none;cursor:pointer}
.panel-close:hover{color:#888}
.panel-section{padding:0 20px 16px}
.panel-label{font-size:10px;color:#444;text-transform:uppercase;font-family:monospace;letter-spacing:1px;margin-bottom:10px;margin-top:16px}
.panel-q-item{margin-bottom:14px;padding:6px 8px;border-radius:6px;transition:background .15s}
.panel-q-item:hover{background:rgba(255,255,255,.04)}
.panel-q-question{font-size:11px;color:#555;margin-bottom:3px}
.panel-q-answer{font-size:13.5px;color:#ccc}
.panel-c-item{margin-bottom:14px;padding:6px 8px;border-radius:6px;transition:background .15s}
.panel-c-item:hover{background:rgba(255,255,255,.04)}
.panel-c-ctx{font-size:11px;color:#3a3a3a;font-style:italic;border-left:2px solid rgba(255,255,255,.08);padding-left:8px;margin-bottom:3px}
.panel-c-note{font-size:13px;color:#ccc}
.panel-c-label{font-size:10px;color:#444;font-family:monospace;margin-bottom:3px}
.panel-footer{padding:16px 20px 28px;flex-shrink:0;margin-top:auto}
.panel-dl{width:100%;padding:12px;border-radius:10px;background:#fff;color:#111;border:none;
  font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
.panel-dl:hover{background:#e8e8e8}
.panel-dl-cap{font-size:11px;color:#333;text-align:center;margin-top:6px}
.panel-empty{color:#333;font-size:13px;padding:40px 20px;text-align:center}

/* Toast */
.toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%) translateY(20px);
  background:#222;color:#ccc;font-size:13px;padding:8px 18px;border-radius:8px;opacity:0;
  transition:all .3s ease;pointer-events:none;z-index:80;border:1px solid rgba(255,255,255,.08)}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

/* Block highlight flash */
@keyframes flash{0%{background:rgba(199,146,234,.15)}100%{background:transparent}}
.block-flash{animation:flash .8s ease-out}

/* Sheet hint */
.sheet-hint{font-size:11px;color:#444;margin-top:6px;clear:both}

/* Progress bar */
.nudge-bar{height:3px;border-radius:2px;background:rgba(255,255,255,.06);margin-top:10px;overflow:hidden}
.nudge-bar-fill{height:100%;background:#c792ea;border-radius:2px;transition:width .4s ease}

/* Delete button in panel */
.panel-delete{font-size:11px;color:#444;background:none;border:none;cursor:pointer;float:right;margin-top:-2px}
.panel-delete:hover{color:#e55}

/* Scroll progress bar */
.scroll-progress{position:fixed;top:0;left:0;width:0%;height:3px;background:#c792ea;z-index:90;transition:width .1s linear;border-radius:0 0 2px 0}

.outline{position:fixed;top:0;left:0;bottom:0;width:200px;z-index:20;padding:60px 16px 40px;
  overflow-y:auto;display:none}
.outline-item{display:block;font-size:12px;color:#444;padding:4px 0;cursor:pointer;
  text-decoration:none;transition:color .15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.outline-item:hover{color:#aaa}
.outline-item.active{color:#c792ea}
.outline-item.level-h1{font-weight:600;color:#666;font-size:13px;margin-top:8px}
.outline-item.level-h2{padding-left:8px;margin-top:6px}
.outline-item.level-h3{padding-left:16px}

/* Mobile outline: overlay drawer */
.outline-toggle{position:fixed;top:16px;left:16px;z-index:25;width:36px;height:36px;border-radius:50%;
  background:#1a1a1a;border:1px solid rgba(255,255,255,.1);color:#666;font-size:14px;cursor:pointer;
  display:flex;align-items:center;justify-content:center}
.outline-toggle:hover{background:#222;color:#aaa}
@media(max-width:1099px){
  .outline{background:#161616;border-right:1px solid rgba(255,255,255,.07);z-index:75;
    transform:translateX(-100%);transition:transform .3s cubic-bezier(.32,.72,0,1);display:block}
  .outline.open{transform:translateX(0)}
}
@media(min-width:1100px){
  .outline{display:block}
  .outline-toggle{display:none}
  .doc{margin-left:200px}
}

.outline-overlay{position:fixed;inset:0;z-index:74;background:rgba(0,0,0,.4);opacity:0;pointer-events:none;transition:opacity .3s}
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
