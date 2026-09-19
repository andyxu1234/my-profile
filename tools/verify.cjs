const fs = require("node:fs");
const path = require("node:path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = "C:/andy/codebase/my-profile";
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

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
  check("A1 项目卡片数 = 5", cards.length === 5, cards.length);
  const nums = [...doc.querySelectorAll(".card-num")].map((e) => e.textContent.trim());
  check("A2 卡片编号 01-05", nums.join(",") === "01,02,03,04,05", nums.join(","));
  const first = cards[0];
  check("A3 首个卡片是 AI 足球预测平台",
    first.querySelector("h3").textContent.includes("AI 足球预测平台"),
    first.querySelector("h3").textContent);
  check("A4 首卡标签正确", first.querySelector(".card-tag").textContent.includes("全栈"), first.querySelector(".card-tag").textContent);
  check("A5 首卡时间 2026.04 – 2026.07", first.querySelector(".card-period").textContent.includes("2026.04"), first.querySelector(".card-period").textContent);

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
    acts[1] && acts[1].getAttribute("href") === "https://github.com/AndyXu-Citi/world-cup-prediction", acts[1] && acts[1].getAttribute("href"));
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
  check("C5 切 EN 后卡片仍为 5", doc.querySelectorAll(".card").length === 5, doc.querySelectorAll(".card").length);
  check("C6 EN 首卡标题为英文",
    doc.querySelector(".card h3").textContent.includes("AI Football Prediction"),
    doc.querySelector(".card h3").textContent);
  click(doc.querySelector('[data-set-lang="zh"]'));
  await wait(150);

  /* ============ D. GitHub 真实链接 ============ */
  const GH = "https://github.com/andyxu1234";
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
  for (const [f, must] of [["resume.md", "AI 足球预测平台"], ["resume-en.md", "AI Football Prediction"]]) {
    const p = path.join(ROOT, f);
    const ok = fs.existsSync(p);
    const t = ok ? fs.readFileSync(p, "utf8") : "";
    check(`G1 ${f} 存在且含新项目`, ok && t.includes(must), ok ? t.length + " chars" : "缺失");
  }
  const rzh = fs.readFileSync(path.join(ROOT, "resume.md"), "utf8");
  check("G2 简历含四大块", ["## 关于我", "## 经历", "## 技能", "## 项目经历"].every((h) => rzh.includes(h)));
  check("G3 简历不含相对路径链接", !/\]\(projects\//.test(rzh), (rzh.match(/\]\(projects\//g) || []).length);
  check("G4 简历含真实 GitHub 仓库", rzh.includes("https://github.com/AndyXu-Citi/world-cup-prediction"));

  const pass = results.filter((r) => r.pass).length;
  console.log("\n=== 验证 ===");
  results.forEach((r) => console.log((r.pass ? "  PASS  " : "  FAIL  ") + r.n + (r.e ? "   [" + r.e + "]" : "")));
  console.log("\n结果: " + pass + "/" + results.length + " 通过\n");
  process.exit(pass === results.length ? 0 : 1);
})();
