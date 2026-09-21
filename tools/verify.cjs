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
  check("A1 项目卡片数 = 4（2026-09-21 晚收敛为 4 个真实项目）", cards.length === 4, cards.length);
  const nums = [...doc.querySelectorAll(".card-num")].map((e) => e.textContent.trim());
  check("A2 卡片编号 01-04", nums.join(",") === "01,02,03,04", nums.join(","));
  const first = cards[0];
  check("A3 首卡是 SoulBuddy（真实项目，排第一）",
    first.querySelector("h3").textContent.includes("SoulBuddy"),
    first.querySelector("h3").textContent);
  check("A4 首卡标签含「桌面」", first.querySelector(".card-tag").textContent.includes("桌面"), first.querySelector(".card-tag").textContent);
  check("A5 首卡时间 2026.09", first.querySelector(".card-period").textContent.includes("2026.09"), first.querySelector(".card-period").textContent);
  check("A6 第二张卡是 AI 足球预测平台",
    cards[1].querySelector("h3").textContent.includes("AI 足球预测平台"),
    cards[1].querySelector("h3").textContent);
  check("A7 第三张卡是马拉松赛事追踪小程序",
    cards[2].querySelector("h3").textContent.includes("马拉松赛事追踪小程序"),
    cards[2].querySelector("h3").textContent);
  check("A8 第四张卡是 rush-hour 汽车华容道",
    cards[3].querySelector("h3").textContent.includes("rush-hour"),
    cards[3].querySelector("h3").textContent);
  // 2026-09-21 晚删除的 4 个占位项目，防回归
  const leftovers = ["企业知识库", "多 Agent 数据分析助手", "LLM 网关与推理加速平台", "智能客服工单助手"]
    .filter((k) => doc.body.textContent.includes(k));
  check("A9 页面已无占位项目残留（4 个已删）", leftovers.length === 0,
    leftovers.length ? leftovers.join(" / ") : "0 处");

  /* ============ B. 详情页：真实链接按钮 ============ */
  await setHash("#/work/wc-prediction");
  const h2 = doc.querySelector("#detail-content h2");
  check("B1 详情标题", h2 && h2.textContent.includes("AI 足球预测平台"), h2 && h2.textContent);
  const hl = doc.querySelectorAll("#detail-content .list li");
  check("B2 亮点条目 = 5", hl.length === 5, hl.length);
  check("B3 技术栈 chips = 12", doc.querySelectorAll("#detail-content .chip").length === 12, doc.querySelectorAll("#detail-content .chip").length);
  const acts = doc.querySelectorAll("#detail-content .detail-actions a");
  check("B4 有两个真实按钮（非死链）", acts.length === 2, acts.length);
  check("B5 在线体验 -> 线上 Pages 站",
    acts[0] && acts[0].getAttribute("href") === "https://andyxu1234.github.io/world-cup-prediction/", acts[0] && acts[0].getAttribute("href"));
  check("B6 查看源码 -> GitHub 仓库",
    acts[1] && acts[1].getAttribute("href") === REPO_WC, acts[1] && acts[1].getAttribute("href"));
  check("B7 外链带 rel=noopener", acts[1] && acts[1].getAttribute("rel") === "noopener");

  // 2026-09-21 晚：4 个项目全部配了线上详情页与源码仓库，不再有「无链接项目」
  const badActs = [];
  for (const w of window.eval("WORKS")) {
    await setHash("#/work/" + w.id);
    const as = [...doc.querySelectorAll("#detail-content .detail-actions a")];
    if (as.length !== 2 || as.some((a) => !/^https?:\/\//.test(a.getAttribute("href") || "")))
      badActs.push(w.id + "=" + as.length);
  }
  check("B8 四个项目详情均渲染两个真实外链按钮（无死链 / 无站内相对路径）",
    badActs.length === 0, badActs.length ? badActs.join(",") : "4 个项目 × 2 个按钮");
  await setHash("#/");

  /* ============ C. 简历下载按钮 ============ */
  await setHash("#/");
  const dl = doc.getElementById("resume-dl");
  check("C1 默认(zh)指向 resume.md", dl.getAttribute("href") === "resume.md", dl.getAttribute("href"));
  check("C2 下载文件名带中文", (dl.getAttribute("download") || "").includes("简历"), dl.getAttribute("download"));
  click(doc.querySelector('.nav-links [data-set-lang="en"]'));
  await wait(150);
  check("C3 切 EN 后指向 resume-en.md", dl.getAttribute("href") === "resume-en.md", dl.getAttribute("href"));
  check("C4 EN 下载名为英文", (dl.getAttribute("download") || "").includes("Resume"), dl.getAttribute("download"));
  check("C5 切 EN 后卡片仍为 4", doc.querySelectorAll(".card").length === 4, doc.querySelectorAll(".card").length);
  check("C8 EN 第三卡为 Marathon Race Tracker",
    doc.querySelectorAll(".card h3")[2].textContent.includes("Marathon Race Tracker"),
    doc.querySelectorAll(".card h3")[2].textContent);
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

  /* ============ F. 站内 demo 目录已退役 ============
     2026-09-21 晚：4 个项目的详情全部指向各自线上 Pages 站，
     projects/（旧足球 demo 页 + 截图/图标资源）已删除，本组改为「退役 + 无残留引用」护栏。 */
  check("F1 projects/ 目录已删除（站内 demo 页与截图资源不再随站点发布）",
    !fs.existsSync(path.join(ROOT, "projects")));
  const projRefs = ["index.html", "resume.md", "resume-en.md", "tools/build-resume.cjs"]
    .filter((f) => {
      const p = path.join(ROOT, f);
      return fs.existsSync(p) && /projects\//.test(fs.readFileSync(p, "utf8"));
    });
  check("F2 全站无 projects/ 引用残留（含简历生成器取值路径）",
    projRefs.length === 0, projRefs.length ? projRefs.join(", ") : "4 个文件已扫描");

  /* ============ G. 简历文件 ============ */
  for (const [f, musts] of [
    ["resume.md", ["SoulBuddy", "AI 足球预测平台", "马拉松赛事追踪小程序", "rush-hour"]],
    ["resume-en.md", ["SoulBuddy", "AI Football Prediction", "Marathon Race Tracker", "rush-hour"]],
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
  const rzHeads = rzh.match(/^### \d+\. /gm) || [];
  check("G7 简历「项目经历」恰好 4 条（占位项目已随 WORKS 一并移除）",
    rzHeads.length === 4, rzHeads.length + " 条");

  /* ============ H. 卡片直达线上演示页 ============
     注：原 H4–H10（站内 demo 页概览注入 / 资源 / 返回入口）随 projects/ 一并于 2026-09-21 晚退役，
     编号 H11 起沿用，保留空号以免历史记录错位。 */
  const zh = (v) => (v && typeof v === "object" ? v.zh : v);
  const WORKS = window.eval("WORKS");
  // 一律按 id 取项目，不按索引——否则新增项目会让这些断言整体错位
  const w0 = WORKS.find((w) => w.id === "wc-prediction");
  const wSb = WORKS.find((w) => w.id === "soul-buddy");

  check("H0 soul-buddy 排在第一位且指向线上文档站",
    WORKS[0].id === "soul-buddy" && /^https:\/\/andyxu1234\.github\.io\/soul_buddy\/$/.test((wSb && wSb.detailUrl) || ""),
    WORKS[0].id + " -> " + ((wSb && wSb.detailUrl) || "(无)"));

  check("H1 wc-prediction detailUrl 指向线上 Pages 站（站内 demo 页已弃用）",
    !!w0 && w0.detailUrl === "https://andyxu1234.github.io/world-cup-prediction/", (w0 && w0.detailUrl) || "(未配置)");

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

  const noUrl = WORKS.filter((w) => !w.detailUrl || !w.codeUrl);
  check("H3 四个项目全部配齐 detailUrl + codeUrl（无半成品占位）",
    WORKS.length === 4 && noUrl.length === 0,
    WORKS.map((w) => w.id).join(",") + " / 缺链接: " + (noUrl.map((w) => w.id).join(",") || "无"));
  await setHash("#/");

  check("H11 soul-buddy 源码链接指向新账号仓库",
    (wSb && wSb.codeUrl) === REPO_SB, (wSb && wSb.codeUrl) || "(无)");

  check("H12 soul-buddy 详情字段完整（6 条亮点 / 12 项技术栈）",
    !!wSb && (zh(wSb.highlights) || []).length === 6 && (wSb.stack || []).length === 12,
    wSb ? `${(zh(wSb.highlights) || []).length} 条亮点 / ${(wSb.stack || []).length} 项技术栈` : "缺失");

  // 第三个项目：马拉松 —— 查看详情/在线体验都直跳 GitHub Pages 站，不走站内 hash 详情
  const wMa = WORKS.find((w) => w.id === "marathon");
  check("H13 marathon 排在第三位且 detailUrl 指向 GitHub Pages 站",
    WORKS[2].id === "marathon" && wMa.detailUrl === "https://andyxu1234.github.io/marathon/",
    WORKS[2].id + " -> " + ((wMa && wMa.detailUrl) || "(无)"));
  check("H14 marathon 源码链接指向新仓库、字段完整（6 条亮点 / 13 项技术栈）",
    !!wMa && wMa.codeUrl === GH + "/marathon" &&
      (zh(wMa.highlights) || []).length === 6 && (wMa.stack || []).length === 13,
    wMa ? `${wMa.codeUrl} / ${(zh(wMa.highlights) || []).length} 条亮点 / ${(wMa.stack || []).length} 项技术栈` : "缺失");

  // 第四个项目：rush-hour 汽车华容道 —— 同样直跳 GitHub Pages 站，不进站内 hash 详情
  const wRh = WORKS.find((w) => w.id === "rush-hour");
  check("H15 rush-hour 排在第四位且 detailUrl 指向 GitHub Pages 站",
    WORKS.length === 4 && WORKS[3].id === "rush-hour" &&
      wRh.detailUrl === "https://andyxu1234.github.io/rush-hour/",
    WORKS[3].id + " -> " + ((wRh && wRh.detailUrl) || "(无)"));
  check("H16 rush-hour 源码链接指向新仓库、字段完整（6 条亮点 / 11 项技术栈）",
    !!wRh && wRh.codeUrl === GH + "/rush-hour" &&
      (zh(wRh.highlights) || []).length === 6 && (wRh.stack || []).length === 11,
    wRh ? `${wRh.codeUrl} / ${(zh(wRh.highlights) || []).length} 条亮点 / ${(wRh.stack || []).length} 项技术栈` : "缺失");
  check("H17 四个项目全部是 andyxu1234 账号下的线上演示页 + 真实仓库",
    WORKS.length === 4 && WORKS.every((w) =>
      /^https:\/\/andyxu1234\.github\.io\/.+/.test(w.detailUrl) &&
      /^https:\/\/github\.com\/andyxu1234\/.+/.test(w.codeUrl)),
    WORKS.map((w) => w.id).join(","));

  /* ============ I. 旧用户名清理（防回归） ============ */
  const scanTargets = [
    "index.html",
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

  // 页面里所有 github.com 链接的 owner 必须是当前账号（旧名混进链接会被这条兜住）
  const idxOwners = [...new Set([...html.matchAll(/https:\/\/github\.com\/([^"'/\s>]+)/g)].map((m) => m[1].split("/")[0]))];
  check("I2 页面内所有 GitHub 链接 owner 均为当前账号",
    idxOwners.length > 0 && idxOwners.every((o) => o === "andyxu1234"),
    `${idxOwners.length} 个 owner: ${idxOwners.join(" / ")}`);

  /* ============ J. 首屏基本信息（对齐真实简历口径） ============ */
  const tx = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : "");
  await setHash("#/");
  await wait(80);

  check("J1 首屏主标题为姓名（zh）", tx(doc.querySelector(".hero h1")) === "徐振宇", tx(doc.querySelector(".hero h1")));
  check("J2 姓名在首屏主体（已不在基本信息表内）",
    !!doc.querySelector(".hero-head .hero-intro h1") &&
      !doc.querySelector(".hero .profile .me") && !doc.querySelector(".hero-top"),
    "hero-intro h1=" + tx(doc.querySelector(".hero-head .hero-intro h1")) +
      " / .profile .me=" + !!doc.querySelector(".hero .profile .me"));

  const pfPairs = [...doc.querySelectorAll(".profile div")].map((d) => [tx(d.querySelector("dt")), tx(d.querySelector("dd"))]);
  const expectPairs = [
    ["性别", "男"], ["年龄", "31 岁（1994.10）"], ["学历", "本科 · 山东大学"], ["专业", "电子信息科学与技术"],
    ["工作年限", "10 年"], ["现居", "上海"], ["电话", "13951008016"], ["邮箱", "13951008016@163.com"],
  ];
  check("J3 基本信息 8 项顺序与取值全对（姓名已上移到首屏主体）",
    JSON.stringify(pfPairs) === JSON.stringify(expectPairs),
    pfPairs.map((p) => p.join("=")).join(" / "));

  const telA = doc.querySelector('.profile a[href^="tel:"]');
  const mailA = doc.querySelector('.profile a[href^="mailto:"]');
  check("J4 电话/邮箱可直接拨打或发信",
    !!telA && telA.getAttribute("href") === "tel:13951008016" && !!mailA && mailA.getAttribute("href") === "mailto:13951008016@163.com",
    (telA ? telA.getAttribute("href") : "-") + " | " + (mailA ? mailA.getAttribute("href") : "-"));

  check("J5 关于区正文收敛为 2 段", doc.querySelectorAll(".about-grid p").length === 2,
    doc.querySelectorAll(".about-grid p").length + " 段");
  const aboutTxt = tx(doc.querySelector(".about-grid"));
  check("J6 关于区写明 Java→Python 转型与真实履历",
    aboutTxt.includes("花旗") && aboutTxt.includes("Java") && aboutTxt.includes("Python"),
    aboutTxt.slice(0, 40) + "…");

  const statTxt = [...doc.querySelectorAll(".stat")].map((s) => tx(s.querySelector("b")) + " " + tx(s.querySelector("span"))).join(" | ");
  check("J7 数据条无编造的 AI 年限/项目数", !/3年|5年|10\+/.test(statTxt), statTxt);

  const headTitle = (html.match(/<title>([^<]*)<\/title>/) || [, ""])[1];
  check("J8 页面标题含真实姓名", headTitle.includes("徐振宇"), headTitle);

  click(doc.querySelector('.nav-links [data-set-lang="en"]'));
  await wait(150);
  check("J9 EN 首屏姓名切为拉丁名", tx(doc.querySelector(".hero h1")) === "Zhenyu Xu", tx(doc.querySelector(".hero h1")));
  check("J10 EN 基本信息标签已本地化",
    tx(doc.querySelector(".profile dt")) === "Gender" &&
      tx(doc.querySelectorAll(".profile div")[2].querySelector("dt")) === "Education" &&
      tx(doc.querySelectorAll(".profile div")[1].querySelector("dt")) === "Age",
    tx(doc.querySelector(".profile dt")));
  click(doc.querySelector('[data-set-lang="zh"]'));
  await wait(150);

  const placeholders = ["andy.dev@example.com", "andy-ai-dev"];
  const phFiles = ["index.html", "resume.md", "resume-en.md", "tools/build-resume.cjs"];
  const phLeft = phFiles.filter((f) => {
    const p = path.join(ROOT, f);
    return fs.existsSync(p) && placeholders.some((k) => fs.readFileSync(p, "utf8").includes(k));
  });
  check("J11 全站与简历无占位邮箱/微信残留",
    phLeft.length === 0,
    phLeft.length ? phLeft.join(", ") : `已扫描 ${phFiles.length} 个文件`);

  check("J12 状态行已下移到首屏主体（顶栏已移除）",
    !doc.querySelector(".hero .hero-top") && tx(doc.querySelector(".hero .status")).includes("正在看机会"),
    tx(doc.querySelector(".hero .status")));

  const hIntro = doc.querySelector(".hero-head .hero-intro");
  check("J13 姓名 + 拉丁名副行 + 证件照同处首屏主体（名在状态行之上）",
    !!hIntro && !!doc.querySelector(".hero-head .portrait img") &&
      !!hIntro.querySelector("h1") && !!hIntro.querySelector(".hero-name-sub") &&
      !!(hIntro.querySelector("h1").compareDocumentPosition(hIntro.querySelector(".hero-status")) & window.Node.DOCUMENT_POSITION_FOLLOWING),
    "intro: h1 → name-sub → status ／ 右侧 portrait");
  check("J14 ZH 姓名副行为拉丁名", tx(doc.querySelector(".hero-name-sub")) === "Zhenyu Xu",
    tx(doc.querySelector(".hero-name-sub")));

  // 2026-09-21 晚：项目区收敛为 4 个真实项目后，数据条 / 关于区口径随之对齐。
  // 标签刻意用「已上线项目」而非「AI 应用」——4 个里马拉松、rush-hour 不是 AI 应用，改成 4 个 AI 应用即为失实。
  const statEls = [...doc.querySelectorAll(".stat")];
  check("J15 数据条第 3 条为「4个 · 已上线项目」",
    statEls.length === 4 &&
      tx(statEls[2].querySelector("b")) === "4个" && tx(statEls[2].querySelector("span")) === "已上线项目",
    statTxt);
  const I18N = window.eval("I18N");
  check("J16 关于区已写「四个…项目」且中英口径一致",
    aboutTxt.includes("四个") && I18N.en.stat3_n === "4" && /four projects/.test(I18N.en.about_p2 || ""),
    `zh 含「四个」=${aboutTxt.includes("四个")} / en.stat3_n=${I18N.en.stat3_n}`);

  /* ============ K. 技术栈：表格 + 首屏一句话技术栈 ============ */
  const stackRows = [...doc.querySelectorAll(".stack-table tr")].map((tr) => [
    tx(tr.querySelector("th")), tx(tr.querySelector("td")),
  ]);
  const expectStack = [
    ["语言与运行时", "Python 3.11+（类型注解 / asyncio）"],
    ["Web 与 API", "FastAPI、Uvicorn、Pydantic v2"],
    ["Agent 与编排", "LangChain、LangGraph、AutoGen、自研状态机"],
    ["模型与网关", "OpenAI 兼容 API、vLLM / Ollama、提示词与工具 Schema 治理"],
    ["检索与向量", "Milvus / Qdrant / Weaviate、Elasticsearch（BM25）、混合检索、bge-reranker 重排"],
    ["数据与缓存", "PostgreSQL、Redis（会话 / 缓存 / 限流计数）"],
    ["异步与消息", "Celery、Kafka、RabbitMQ"],
    ["可观测", "OpenTelemetry、LangSmith / Langfuse、结构化日志"],
    ["部署与工程", "Docker、Kubernetes、GitHub Actions / GitLab CI"],
  ];
  check("K1 技术栈以表格呈现（卡片网格已废弃）",
    !!doc.querySelector("table.stack-table") && doc.querySelectorAll(".skill-card").length === 0,
    "tr=" + stackRows.length + " / .skill-card=" + doc.querySelectorAll(".skill-card").length);
  check("K2 技术栈 9 组分组与取值全对",
    JSON.stringify(stackRows) === JSON.stringify(expectStack),
    stackRows.length + " 组");
  const stackEl = doc.querySelector("#skills .stack-line");
  const stackTxt = tx(stackEl);
  check("K3 技能区一句话技术栈已渲染且含关键栈",
    !!stackEl && ["Python", "FastAPI", "LangGraph", "Redis", "Docker"].every((k) => stackTxt.includes(k)),
    stackTxt.slice(0, 56) + "…");
  const skillsHeadEl = doc.querySelector("#skills .sec-head");
  const skillsSubEl = doc.querySelector("#skills .sec-head .sub");
  const skillsWrapEl = doc.querySelector("#skills .stack-wrap");
  const stackTableEl = doc.querySelector("#skills .stack-table");
  check("K4 一句话技术栈贴在技能区副标题正下方（标题组内、技术栈表格之前），关于区已无残留",
    !!stackEl && !!skillsHeadEl && !!skillsSubEl && !!skillsWrapEl && !!stackTableEl &&
      !!stackEl.closest(".sec-head") && stackEl.previousElementSibling === skillsSubEl &&
      !!(stackEl.compareDocumentPosition(skillsWrapEl) & window.Node.DOCUMENT_POSITION_FOLLOWING) &&
      !doc.querySelector("#about .stack-line") && !doc.querySelector(".hero .hero-stack"),
    "skills_sub → stack-line → stack-wrap(table)；about 区干净");

  // 生成器靠 .stack-table 取技能，结构一变会静默丢内容，故用简历产物反查
  const rzText = fs.readFileSync(path.join(ROOT, "resume.md"), "utf8");
  const skillBlock = (rzText.match(/## 技能\n\n([\s\S]*?)\n\n## /) || [, ""])[1];
  const skillLines = skillBlock.split("\n").filter((l) => l.trim().startsWith("- "));
  check("K5 简历「技能」章节与页面表格同源，9 条无丢失",
    skillLines.length === expectStack.length &&
      skillLines.every((l, i) => l.includes(expectStack[i][0]) && l.includes(expectStack[i][1])),
    skillLines.length + " 条");

  click(doc.querySelector('.nav-links [data-set-lang="en"]'));
  await wait(150);
  check("K6 EN 技术栈表格与技能区技术栈行均已本地化",
    tx(doc.querySelector(".stack-table th")) === "Language & Runtime" &&
      tx(doc.querySelector("#skills .stack-line")).startsWith("Python · FastAPI"),
    tx(doc.querySelector(".stack-table th")));

  // CSS 源码级断言：jsdom 对 clamp() 与媒体查询级联支持不完整，这类规则用正则查更可靠
  const cssSrc = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const stackRule = (cssSrc.match(/\.stack-line\{[^}]*\}/) || [""])[0];
  check("K7 一句话技术栈桌面端强制单行（white-space:nowrap、已去掉 max-width:70ch）",
    /white-space:\s*nowrap/.test(stackRule) && !/max-width/.test(stackRule),
    stackRule.replace(/\s+/g, " ").slice(0, 76));
  check("K8 窄屏（<=960px）放开换行，避免 nowrap 撑破标题区",
    /@media\(max-width:960px\)\{[\s\S]*?\.stack-line\{white-space:normal;\}/.test(cssSrc) &&
      !/@media\(max-width:860px\)\{[\s\S]*?\.stack-line\{white-space:normal;\}/.test(cssSrc),
    "media 960 → .stack-line{white-space:normal}（860 块内必须没有）");
  click(doc.querySelector('[data-set-lang="zh"]'));
  await wait(150);

  /* ============ L. 首屏证件照 ============ */
  const pimg = doc.querySelector(".hero .portrait img");
  const picPath = path.join(ROOT, "picture.jpg");
  const picOk = fs.existsSync(picPath) && fs.statSync(picPath).size > 5000;
  check("L1 首屏照片已渲染且指向真实存在的文件",
    !!pimg && pimg.getAttribute("src") === "picture.jpg" && picOk,
    (pimg ? pimg.getAttribute("src") : "-") + " / " + (picOk ? fs.statSync(picPath).size + "B" : "文件缺失"));
  check("L2 照片声明宽高，避免加载抖动（CLS）",
    !!pimg && pimg.getAttribute("width") === "400" && pimg.getAttribute("height") === "556",
    pimg ? pimg.getAttribute("width") + "x" + pimg.getAttribute("height") : "-");
  const pBlock = doc.querySelector(".hero .profile-block");
  check("L3 照片在首屏上半部、基本信息表之前",
    !!doc.querySelector(".hero-head > .portrait") && !!pBlock &&
      !!(pimg.compareDocumentPosition(pBlock) & window.Node.DOCUMENT_POSITION_FOLLOWING),
    "hero-head .portrait → profile-block");

  click(doc.querySelector('.nav-links [data-set-lang="en"]'));
  await wait(150);
  const altEn = doc.querySelector(".hero .portrait img").getAttribute("alt");
  check("L4 EN 照片 alt 已本地化", /Zhenyu Xu/.test(altEn || ""), altEn);
  check("L5 EN 姓名副行切为中文名（中英互补）", tx(doc.querySelector(".hero-name-sub")) === "徐振宇",
    tx(doc.querySelector(".hero-name-sub")));
  click(doc.querySelector('[data-set-lang="zh"]'));
  await wait(150);
  const altZh = doc.querySelector(".hero .portrait img").getAttribute("alt");
  check("L6 ZH 照片 alt 回到中文", /徐振宇/.test(altZh || ""), altZh);
  check("L7 ZH 姓名副行回到拉丁名", tx(doc.querySelector(".hero-name-sub")) === "Zhenyu Xu",
    tx(doc.querySelector(".hero-name-sub")));

  /* ============ M. 经历（2026-09-21 换成简历里的真实履历） ============ */
  const tlItems = [...doc.querySelectorAll(".timeline li")].map((li) => ({
    period: tx(li.querySelector(".tl-period")),
    role: tx(li.querySelector(".tl-role")),
    org: tx(li.querySelector(".tl-org")),
    desc: tx(li.querySelector(".tl-desc")),
  }));
  const expectExp = [
    ["2025.09 – 至今", "Java 开发工程师", "Wipro"],
    ["2020.05 – 2025.08", "Java 开发工程师 / Tech Leader", "花旗集团"],
    ["2017.09 – 2019.05", "Java 开发工程师", "苏宁软件技术"],
    ["2016.07 – 2017.08", "Java 开发工程师", "中软国际"],
    ["2012.09 – 2016.06", "电子信息科学与技术 · 本科", "山东大学"],
  ];
  check("M1 时间线 5 段（4 段工作 + 1 段教育，倒序），时间/职位/公司全对",
    JSON.stringify(tlItems.map((e) => [e.period, e.role, e.org])) === JSON.stringify(expectExp),
    tlItems.map((e) => e.org).join(" → "));
  check("M2 经历区已无占位信息（某互联网公司 / 某软件公司 / 某大学）",
    !/某互联网公司|某软件公司|某大学/.test(doc.body.textContent),
    (doc.body.textContent.match(/某互联网公司|某软件公司|某大学/g) || []).length + " 处");
  check("M3 前两段含真实业务要点（SCB 市场数据 / 批发信贷 + 巴塞尔合规）",
    /SCB/.test(tlItems[0].desc) && /批发信贷|Wholesale/.test(tlItems[1].desc) && /巴塞尔/.test(tlItems[1].desc),
    tlItems[1].desc.slice(0, 36) + "…");
  check("M4 教育段无编造描述（原「多次获校级奖学金」为杜撰，简历仅一行学历）",
    tlItems.length === 5 && tlItems[4].desc === "",
    "教育 desc = " + JSON.stringify(tlItems[4] ? tlItems[4].desc : "(缺失)"));
  // 紧凑化：段间空白 = padding-bottom + margin-bottom，旧值各 26–38px，叠加达 76px
  const tlRule = (cssSrc.match(/\.timeline li\{[^}]*\}/) || [""])[0];
  check("M5 经历段间距已收紧（padding/margin 各降到 14–18px）",
    /1\.9vw/.test(tlRule) && !/3\.6vw/.test(tlRule),
    tlRule.replace(/\s+/g, " ").slice(0, 98));
  check("M6 全局模块间距已收紧（section 上下留白 52–84px → 22–38px，二轮再收紧）",
    /section\{padding:clamp\(22px,3\.2vw,38px\) 0;scroll-margin-top/.test(cssSrc) &&
      !/section\{padding:clamp\(52px,7\.5vw,84px\)/.test(cssSrc) &&
      !/section\{padding:clamp\(30px,4\.4vw,52px\)/.test(cssSrc),
    "section{padding:clamp(22px,3.2vw,38px) 0}");
  check("M7 简历「经历」章节与页面同源（真实公司已同步、无占位残留）",
    ["Wipro", "花旗集团", "苏宁软件技术", "中软国际", "山东大学"].every((k) => rzText.includes(k)) &&
      !/某互联网公司|某软件公司|某大学/.test(rzText),
    "resume.md 经历已同源");

  // 模块间距（2026-09-21 用户反馈「每一个模块之间的留白太大」）
  const heroPadRule = (cssSrc.match(/\.hero\{padding:[^}]*\}/) || [""])[0];
  check("M8 首屏上下留白已收紧（导航→首屏 24–40px、首屏→关于区 18–28px）",
    /3\.4vw/.test(heroPadRule) && /2\.4vw/.test(heroPadRule) && !/9vw/.test(heroPadRule) && !/4\.4vw/.test(heroPadRule),
    heroPadRule.replace(/\s+/g, " "));
  check("M9 #experience 专用留白覆盖已移除（全局已覆盖，避免两套近似值并存）",
    !/#experience\{padding-bottom/.test(cssSrc), "无 #experience{padding-bottom");
  // 二轮收紧：标题组下沿 / 数据条上沿 / 页脚 / 详情页上下
  const secHeadRule = (cssSrc.match(/\.sec-head\{[^}]*\}/) || [""])[0];
  const statsRule = (cssSrc.match(/\.stats-row\{[^}]*\}/) || [""])[0];
  const footerRule = (cssSrc.match(/footer\{[^}]*\}/) || [""])[0];
  const detailWrapRule = (cssSrc.match(/\.detail-wrap\{[^}]*\}/) || [""])[0];
  check("M10 二轮收紧已生效（标题组下沿 20–32 / 数据条 26–40 / 页脚 26 / 详情页 22–36+34–54）",
    /margin-bottom:clamp\(20px,3vw,32px\)/.test(secHeadRule) &&
      /margin-top:clamp\(26px,3\.6vw,40px\)/.test(statsRule) &&
      /padding:26px 0/.test(footerRule) &&
      /padding-top:clamp\(22px,3\.4vw,36px\);padding-bottom:clamp\(34px,4\.6vw,54px\)/.test(detailWrapRule),
    "sec-head / stats-row / footer / detail-wrap 均已收紧");

  const pass = results.filter((r) => r.pass).length;
  console.log("\n=== 验证 ===");
  results.forEach((r) => console.log((r.pass ? "  PASS  " : "  FAIL  ") + r.n + (r.e ? "   [" + r.e + "]" : "")));
  console.log("\n结果: " + pass + "/" + results.length + " 通过\n");
  process.exit(pass === results.length ? 0 : 1);
})();
