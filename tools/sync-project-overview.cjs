/**
 * 把 index.html 里 WORKS 的项目详情（简介 / 正文 / 亮点 / 技术栈 / 源码链接）
 * 注入到对应项目演示页的 <!-- OVERVIEW:START --> ... <!-- OVERVIEW:END --> 标记之间。
 *
 * 为什么用脚本注入而不是直接写死：
 * 详情内容的数据源只有 index.html 一处。写死会在演示页产生第二份副本，
 * 改主页文案时必然漂移——这正是 build-resume.cjs 要解决的问题，同一套思路。
 *
 * 用法：
 *   cd C:/Users/20534/.workbuddy/binaries/node/workspace
 *   NODE_PATH=".../node_modules" node "C:/andy/codebase/my-profile/tools/sync-project-overview.cjs"
 */
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = "C:/andy/codebase/my-profile";
const ENTRY = path.join(ROOT, "index.html");
const START = "<!-- OVERVIEW:START -->";
const END = "<!-- OVERVIEW:END -->";

const html = fs.readFileSync(ENTRY, "utf8");
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => {
  if (!/Not implemented/.test(e.message)) console.error("[jsdom] " + e.message);
});

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  url: "http://localhost/index.html",
  virtualConsole: vc,
});
const { window } = dom;
window.Element.prototype.scrollIntoView = function () {};
window.scrollTo = function () {};

const WORKS = window.eval("WORKS");

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const zh = (v) => (v && typeof v === "object" ? v.zh ?? v.en ?? "" : v ?? "");

/** 渲染标记之间要插入的 HTML 片段 */
function render(w) {
  const out = [];
  out.push(`        <div class="overview-meta">`);
  out.push(`            <span class="is-accent">${esc(zh(w.tag))}</span>`);
  out.push(`            <span>${esc(zh(w.period))}</span>`);
  out.push(`            <span>${esc(zh(w.role))}</span>`);
  out.push(`        </div>`);
  out.push(``);
  out.push(`        <div class="overview-card animate-on-scroll">`);
  out.push(`            <p class="ov-lead">${esc(zh(w.summary))}</p>`);
  out.push(`            <p>${esc(zh(w.desc))}</p>`);
  out.push(`            <h3 class="overview-sub">核心工作与亮点</h3>`);
  out.push(`            <ul class="overview-list">`);
  for (const h of zh(w.highlights) || []) out.push(`                <li>${esc(h)}</li>`);
  out.push(`            </ul>`);
  out.push(`            <h3 class="overview-sub">技术栈</h3>`);
  out.push(`            <div class="overview-chips">`);
  for (const s of w.stack || []) out.push(`                <span>${esc(s)}</span>`);
  out.push(`            </div>`);
  // 只放绝对外链：tryUrl 指向的就是本页自身，放上去是自引用
  if (w.codeUrl && /^https?:/i.test(w.codeUrl)) {
    out.push(`            <div class="overview-actions">`);
    out.push(`                <a class="ov-primary" href="${esc(w.codeUrl)}" target="_blank" rel="noopener">查看源码 ↗</a>`);
    out.push(`            </div>`);
  }
  out.push(`        </div>`);
  return out.join("\n");
}

/** 在文件中替换标记之间的内容；返回是否成功 */
function inject(file, fragment) {
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) return { file, status: "missing" };
  let src = fs.readFileSync(abs, "utf8");

  const i = src.indexOf(START);
  const j = src.indexOf(END);
  if (i === -1 || j === -1) return { file, status: "no-markers" };
  if (j < i) return { file, status: "markers-out-of-order" };

  const before = src.slice(0, i + START.length);
  const after = src.slice(j);
  const next = before + "\n" + fragment + "\n        " + after;
  if (next === src) return { file, status: "unchanged" };

  fs.writeFileSync(abs, next, "utf8");
  return { file, status: "injected", bytes: Buffer.byteLength(fragment, "utf8") };
}

const targets = WORKS.filter((w) => typeof w.detailUrl === "string" && /\.html?$/i.test(w.detailUrl));
if (!targets.length) {
  console.log("WORKS 里没有带 detailUrl 的项目，无需注入。");
  process.exit(0);
}

console.log("注入结果：");
let failed = 0;
for (const w of targets) {
  const r = inject(w.detailUrl, render(w));
  const mark = r.status === "injected" || r.status === "unchanged" ? "  " : "!!";
  console.log(`${mark}${w.id.padEnd(16)} -> ${w.detailUrl}  [${r.status}${r.bytes ? ", " + r.bytes + " B" : ""}]`);
  if (r.status !== "injected" && r.status !== "unchanged") failed++;
}
if (failed) process.exitCode = 1;
