const fs = require("node:fs");
const path = require("node:path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = "C:/andy/codebase/my-profile";
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

// 真实账号与仓库地址集中在这里——账号改名时只改这一处
const GH = "https://github.com/andyxu1234";
const REPO_WC = GH + "/world-cup-prediction";
const REPO_SB = GH + "/soul_buddy";

const errors = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => { if (!/Not implemented/.test(e.message)) errors.push("jsdomError: " + e.message); });
vc.on("error", (m) => errors.push("console.error: " + m));

const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, url: "http://localhost/index.html", virtualConsole: vc });
const { window } = dom;
const doc = window.document;
window.Element.prototype.scrollIntoView = function () {};
window.scrollTo = function () {};

const results = [];
const check = (n, c, e) => results.push({ n, pass: !!c, e: e === undefined ? "" : String(e) });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const click = (el) => el.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
const setHash = async (h) => { window.location.hash = h; await wait(220); };

(async () => {
  await wait(450);

  /* ============ A. 主页：项目模块 ============ */
  const cards = doc.querySelectorAll(".card");
  check("A1 项目卡片数 = 6", cards.length === 6, cards.length);
  const nums = [...doc.querySelectorAll(".card-num")].map((e) => e.textContent.trim());
  check("A2 卡片编号 01-06", nums.join(",") === "01,02,03,04,05,06", nums.join(","));
  const first = cards[0];
  check("A3 首卡是 SoulBuddy（真实项目，排第一）",
    first.querySelector("h3").textContent.includes("SoulBuddy"),
    first.querySelector("h3").textContent);
  check("A4 首卡标签含「桌面」", first.querySelector(".card-tag").textContent.includes("桌面"), first.querySelector(".card-tag").textContent);
  check("A5 首卡时间 2026.09", first.querySelector(".card-period").textContent.includes("2026.09"), first.querySelector(".card-period").textContent);
  check("A6 第二张卡是 AI 足球预测平台",
    cards[1].querySelector("h3").textContent.includes("AI 足球预测平台"),
    cards[1].querySelector("h3").textContent);

  /* ============ B. 详情页：真实链接按钮 ============ */
  await setHash("#/work/wc-prediction");
  const h2 = doc.querySelector("#detail-content h2");
  check("B1 详情标题", h2 && h2.textContent.includes("AI 足球预测平台"), h2 && h2.textContent);
  const hl = doc.querySelectorAll("#detail-content .list li");
  check("B2 亮点条目 = 5", hl.length === 5, hl.length);
  check("B3 技术栈 chips = 12", doc.querySelectorAll("#detail-content .chip").length === 12, doc.querySelectorAll("#detail-content .chip").length);
  const acts = doc.querySelectorAll("#detail-content .detail-actions a");
  check("B4 有两个真实按钮（非死链）", acts.length === 2, acts.length);
  check("B5 在线体验 -> 站内 demo",
    acts[0] && acts[0].getAttribute("href") === "projects/world-cup-prediction.html", acts[0] && acts[0].getAttribute("href"));
  check("B6 查看源码 -> GitHub 仓库",
    acts[1] && acts[1].getAttribute("href") === REPO_WC, acts[1] && acts[1].getAttribute("href"));
  check("B7 外链带 rel=noopener", acts[1] && acts[1].getAttribute("rel") === "noopener");

  // 占位项目（无 url）不应渲染出死链按钮
  await setHash("#/work/rag-kb");
  check("B8 无链接的项目不渲染按钮",
    doc.querySelectorAll("#detail-content .detail-actions a").length === 0,
    doc.querySelectorAll("#detail-content .detail-actions a").length);

  /* ============ C. 简历下载按钮 ============ */
  await setHash("#/");
  const dl = doc.getElementById("resume-dl");
  check("C1 默认(zh)指向 resume.md", dl.getAttribute("href") === "resume.md", dl.getAttribute("href"));
  check("C2 下载文件名带中文", (dl.getAttribute("download") || "").includes("简历"), dl.getAttribute("download"));
  click(doc.querySelector('.nav-links [data-set-lang="en"]'));
  await wait(150);
  check("C3 切 EN 后指向 resume-en.md", dl.getAttribute("href") === "resume-en.md", dl.getAttribute("href"));
  check("C4 EN 下载名为英文", (dl.getAttribute("download") || "").includes("Resume"), dl.getAttribute("download"));
  check("C5 切 EN 后卡片仍为 6", doc.querySelectorAll(".card").length === 6, doc.querySelectorAll(".card").length);
  check("C6 EN 首卡标题为英文（SoulBuddy）",
    doc.querySelector(".card h3").textContent.includes("SoulBuddy"),
    doc.querySelector(".card h3").textContent);
  check("C7 EN 第二卡为 AI Football Prediction",
    doc.querySelectorAll(".card h3")[1].textContent.includes("AI Football Prediction"),
    doc.querySelectorAll(".card h3")[1].textContent);
  click(doc.querySelector('[data-set-lang="zh"]'));
  await wait(150);

  /* ============ D. GitHub 真实链接 ============ */
  const gh = doc.querySelector('.contact-cards a[href*="github.com"]');
  check("D1 GitHub 卡片指向真实账号", gh && gh.getAttribute("href") === GH, gh && gh.getAttribute("href"));
  check("D2 GitHub 文案已更新", gh && gh.textContent.includes("github.com/andyxu1234"));
  check("D3 footer GitHub 已更新",
    doc.querySelector("footer .socials a").getAttribute("href") === GH,
    doc.querySelector("footer .socials a").getAttribute("href"));
  const dead = [...doc.querySelectorAll('a[href="#"]')];
  check("D4 页面内不再有 href=# 的死链", dead.length === 0, dead.length + (dead.length ? " -> " + dead.map((a) => a.textContent.trim()).join(",") : ""));

  /* ============ E. 抽屉回归 ============ */
  const burger = doc.getElementById("burger"), drawer = doc.getElementById("drawer");
  click(burger); await wait(60);
  check("E1 抽屉展开", burger.getAttribute("aria-expanded") === "true");
  doc.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await wait(60);
  check("E2 ESC 关闭 + 解锁滚动", burger.getAttribute("aria-expanded") === "false" && doc.documentElement.style.overflow === "");

  check("E3 主页无未捕获 JS 错误", errors.length === 0, errors.join(" | "));

  /* ============ F. 搬迁后的 demo 页资源完整性 ============ */
  const demoPath = path.join(ROOT, "projects", "world-cup-prediction.html");
  check("F1 demo 页已就位", fs.existsSync(demoPath));
  const demo = fs.readFileSync(demoPath, "utf8");
  check("F2 无残留旧路径", !demo.includes("../client/") && !demo.includes("docs/screenshot/"));
  check("F3 lightbox 坏路径已修（img 与 onclick 前缀一致）",
    !/openLightbox\('docs\//.test(demo) && /openLightbox\('screenshot\//.test(demo));

  const refs = [...new Set([...demo.matchAll(/(?:src|href)="((?:aimodels|screenshot)\/[^"]+)"/g)].map((m) => m[1]))];
  const missing = refs.filter((r) => !fs.existsSync(path.join(ROOT, "projects", r)));
  check("F4 demo 引用的资源全部存在（无断图）", missing.length === 0, `${refs.length} 个引用, 缺失 ${missing.length}${missing.length ? ": " + missing.join(", ") : ""}`);

  const lbRefs = [...new Set([...demo.matchAll(/openLightbox\('([^']+)'\)/g)].map((m) => m[1]))];
  const lbMissing = lbRefs.filter((r) => !fs.existsSync(path.join(ROOT, "projects", r)));
  check("F5 lightbox 目标图全部存在", lbMissing.length === 0, `${lbRefs.length} 个目标, 缺失 ${lbMissing.length}`);

  const projectsSize = (function walk(p) {
    let t = 0;
    for (const f of fs.readdirSync(p, { withFileTypes: true })) {
      const fp = path.join(p, f.name);
      t += f.isDirectory() ? walk(fp) : fs.statSync(fp).size;
    }
    return t;
  })(path.join(ROOT, "projects"));
  check("F6 projects/ 体积 < 3MB", projectsSize < 3 * 1024 * 1024, (projectsSize / 1024 / 1024).toFixed(2) + " MB");

  /* ============ G. 简历文件 ============ */
  for (const [f, musts] of [
    ["resume.md", ["SoulBuddy", "AI 足球预测平台"]],
    ["resume-en.md", ["SoulBuddy", "AI Football Prediction"]],
  ]) {
    const p = path.join(ROOT, f);
    const ok = fs.existsSync(p);
    const t = ok ? fs.readFileSync(p, "utf8") : "";
    const hit = musts.filter((m) => t.includes(m));
    check(`G1 ${f} 含全部真实项目`, ok && hit.length === musts.length, ok ? `${hit.length}/${musts.length} 项` : "缺失");
  }
  const rzh = fs.readFileSync(path.join(ROOT, "resume.md"), "utf8");
  check("G2 简历含四大块", ["## 关于我", "## 经历", "## 技能", "## 项目经历"].every((h) => rzh.includes(h)));
  check("G3 简历不含相对路径链接", !/\]\(projects\//.test(rzh), (rzh.match(/\]\(projects\//g) || []).length);
  check("G4 简历含真实 GitHub 仓库", rzh.includes(REPO_WC), rzh.includes(REPO_WC) ? REPO_WC : "未找到");
  check("G6 简历不含旧用户名 AndyXu-Citi", !rzh.includes("AndyXu-Citi"), (rzh.match(/AndyXu-Citi/g) || []).length + " 处");
  check("G5 简历项目顺序：SoulBuddy 在前，足球预测在后",
    rzh.indexOf("### 1. SoulBuddy") !== -1 && rzh.indexOf("### 2. AI 足球预测平台") !== -1,
    "SoulBuddy@" + rzh.indexOf("### 1. SoulBuddy") + " / 足球@" + rzh.indexOf("### 2. AI 足球预测平台"));

  /* ============ H. 卡片直达演示页 + 概览内容同步 ============ */
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const zh = (v) => (v && typeof v === "object" ? v.zh : v);
  const WORKS = window.eval("WORKS");
  // 一律按 id 取项目，不按索引——否则新增项目会让这些断言整体错位
  const w0 = WORKS.find((w) => w.id === "wc-prediction");
  const wSb = WORKS.find((w) => w.id === "soul-buddy");
  const demoAbs2 = path.join(ROOT, String((w0 && w0.detailUrl) || ""));

  check("H0 soul-buddy 排在第一位且指向线上文档站",
    WORKS[0].id === "soul-buddy" && /^https:\/\/andyxu1234\.github\.io\/soul_buddy\/$/.test((wSb && wSb.detailUrl) || ""),
    WORKS[0].id + " -> " + ((wSb && wSb.detailUrl) || "(无)"));

  check("H1 wc-prediction 配置站内演示页 detailUrl 且文件存在",
    !!w0 && w0.detailUrl === "projects/world-cup-prediction.html" && fs.existsSync(demoAbs2), (w0 && w0.detailUrl) || "(未配置)");

  const whole = WORKS.filter((x) => x.detailUrl);
  const bad = [];
  for (const w of whole) {
    window.location.hash = "";
    await wait(40);
    try { window.openDetail(w.id); } catch (e) { /* jsdom 不实现整页导航，忽略 */ }
    await wait(40);
    const h = window.location.hash;
    if (!(h === "" || h === "#/")) bad.push(w.id + "=hash:" + h);
  }
  check("H2 带 detailUrl 的项目全部走整页跳转（含站外链接），不进 hash 详情视图",
    bad.length === 0, bad.length ? bad.join(",") : whole.map((x) => x.id).join(" + ") + " 共 " + whole.length + " 个");

  const plain = WORKS.find((w) => !w.detailUrl);
  if (plain) {
    window.openDetail(plain.id);
    await wait(60);
    check("H3 无 detailUrl 的项目仍进 hash 详情视图",
      window.location.hash === "#/work/" + plain.id, `${plain.id} -> hash=${window.location.hash}`);
  }
  await setHash("#/");

  const demo2 = fs.readFileSync(demoAbs2, "utf8");
  check("H4 demo 页概览标记完好、未被重复注入",
    (demo2.match(/OVERVIEW:START/g) || []).length === 1 &&
    (demo2.match(/OVERVIEW:END/g) || []).length === 1 &&
    (demo2.match(/class="overview-card/g) || []).length === 1,
    `START=${(demo2.match(/OVERVIEW:START/g) || []).length} card=${(demo2.match(/class="overview-card/g) || []).length}`);

  const ovBody = demo2.slice(demo2.indexOf("<!-- OVERVIEW:START -->"), demo2.indexOf("<!-- OVERVIEW:END -->"));
  check("H5 概览正文与主页数据一致（无内容漂移）",
    ovBody.includes(esc(zh(w0.summary))) && ovBody.includes(esc(zh(w0.desc))));

  const hlList = zh(w0.highlights) || [];
  const hlHit = hlList.filter((h) => ovBody.includes(esc(h))).length;
  check("H6 亮点条目全部同步", hlHit === hlList.length, `${hlHit}/${hlList.length}`);

  const stk = (w0.stack || []).filter((s) => ovBody.includes(esc(s))).length;
  check("H7 技术栈条目全部同步", stk === (w0.stack || []).length, `${stk}/${(w0.stack || []).length}`);

  check("H8 概览含源码按钮且不自引用本页",
    /ov-primary/.test(ovBody) && !ovBody.includes(String(w0.tryUrl)));

  const iBack = demo2.indexOf('class="nav-back"');
  const iLinks = demo2.indexOf('class="nav-links"');
  check("H9 demo 页返回入口存在，且在移动端不会被隐藏的 .nav-links 之外",
    /class="nav-back" href="\.\.\/index\.html"/.test(demo2) && iBack !== -1 && iLinks !== -1 && iBack < iLinks);

  check("H10 demo 页导航含项目概览锚点", demo2.includes('href="#overview"') && demo2.includes('id="overview"'));

  check("H11 soul-buddy 源码链接指向新账号仓库",
    (wSb && wSb.codeUrl) === REPO_SB, (wSb && wSb.codeUrl) || "(无)");

  check("H12 soul-buddy 详情字段完整（6 条亮点 / 12 项技术栈）",
    !!wSb && (zh(wSb.highlights) || []).length === 6 && (wSb.stack || []).length === 12,
    wSb ? `${(zh(wSb.highlights) || []).length} 条亮点 / ${(wSb.stack || []).length} 项技术栈` : "缺失");

  /* ============ I. 旧用户名清理（防回归） ============ */
  const scanTargets = [
    "index.html",
    "projects/world-cup-prediction.html",
    "resume.md",
    "resume-en.md",
    "tools/build-resume.cjs",
    "tools/sync-project-overview.cjs",
  ];
  const leftover = scanTargets.filter((f) => {
    const p = path.join(ROOT, f);
    return fs.existsSync(p) && fs.readFileSync(p, "utf8").includes("AndyXu-Citi");
  });
  check("I1 全站无旧用户名 AndyXu-Citi 残留",
    leftover.length === 0,
    leftover.length ? leftover.join(", ") : `已扫描 ${scanTargets.length} 个文件`);

  const repoOwners = [...demo2.matchAll(/https:\/\/github\.com\/([^"'/\s]+)\/world-cup-prediction/g)].map((m) => m[1]);
  check("I2 demo 页所有仓库链接 owner 均为新账号",
    repoOwners.length > 0 && repoOwners.every((o) => o === "andyxu1234"),
    `${repoOwners.length} 处链接，owner = ${[...new Set(repoOwners)].join(" / ")}`);

  const pass = results.filter((r) => r.pass).length;
  console.log("\n=== 验证 ===");
  results.forEach((r) => console.log((r.pass ? "  PASS  " : "  FAIL  ") + r.n + (r.e ? "   [" + r.e + "]" : "")));
  console.log("\n结果: " + pass + "/" + results.length + " 通过\n");
  process.exit(pass === results.length ? 0 : 1);
})();
