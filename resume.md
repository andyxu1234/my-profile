<!-- 本文件由 tools/build-resume.cjs 从 index.html 自动生成，请勿手改；改文案请改 index.html 后重跑脚本 -->

# 徐振宇（Andy）· AI 应用开发工程师

> 上海 · 中国
> ☎ 13951008016 ｜ ✉ 13951008016@163.com ｜ GitHub github.com/andyxu1234

## 基本信息

- **性别**：男
- **年龄**：31 岁（1994.10）
- **学历**：本科 · 山东大学
- **专业**：电子信息科学与技术
- **工作年限**：10 年
- **现居**：上海
- **电话**：13951008016
- **邮箱**：13951008016@163.com

## 关于我

10 年软件研发经验，先后在花旗集团、苏宁等企业负责批发信贷、支付决策等核心系统的研发与交付，作为小组长带过 9 人团队，熟悉金融级系统对稳定性、数据一致性与合规的要求。

目前正把主力语言从 Java 转向 Python，专注 LLM 应用的工程化落地：RAG 检索增强、Agent 与工具调用、多模型编排、打包与上线交付，已独立完成四个从 0 到 1 的项目。正在寻找 AI 应用开发工程师岗位。

**数据一览**：9人 团队管理规模 · 4家 服务过的企业 · 4个 已上线项目

## 经历

### Java 开发工程师 ｜ Wipro
`2025.09 – 至今`

服务于 SCB 的市场数据团队：整合内外部 Marketing Data，对外提供统一的数据访问 API。负责 MDS API 技术改造——访问日志写入 ClickHouse 并在 Grafana 做数据分析、实现历史数据迁移比对工具、推进 on-premise 到 AWS 的迁移。

### Java 开发工程师 / Tech Leader ｜ 花旗集团
`2020.05 – 2025.08`

负责批发信贷（Wholesale Lending）核心系统研发，覆盖贷款发起、审核、抵押品管理与贷后监控，并按巴塞尔协议Ⅲ等监管要求完成合规改造；作为 Tech Leader 把控项目风险与进度，带领小组完成端到端交付。

### Java 开发工程师 ｜ 苏宁软件技术
`2017.09 – 2019.05`

负责支付决策、代扣、单笔出款系统的需求开发与生产运维。支付决策以工厂模式 + 多线程 + 责任链实现，决策因子（优先级、渠道可用性、手续费等）支持动态配置。

### Java 开发工程师 ｜ 中软国际
`2016.07 – 2017.08`

华为电信业务线库存管理项目组：负责号码、SIM 卡、充值卡、终端等资源的分类管理与权限控制，覆盖入库、出库、调拨等流程。

### 电子信息科学与技术 · 本科 ｜ 山东大学
`2012.09 – 2016.06`

## 技能

- **语言与运行时**：Python 3.11+（类型注解 / asyncio）
- **Web 与 API**：FastAPI、Uvicorn、Pydantic v2
- **Agent 与编排**：LangChain、LangGraph、AutoGen、自研状态机
- **模型与网关**：OpenAI 兼容 API、vLLM / Ollama、提示词与工具 Schema 治理
- **检索与向量**：Milvus / Qdrant / Weaviate、Elasticsearch（BM25）、混合检索、bge-reranker 重排
- **数据与缓存**：PostgreSQL、Redis（会话 / 缓存 / 限流计数）
- **异步与消息**：Celery、Kafka、RabbitMQ
- **可观测**：OpenTelemetry、LangSmith / Langfuse、结构化日志
- **部署与工程**：Docker、Kubernetes、GitHub Actions / GitLab CI

## 项目经历

### 1. SoulBuddy · 桌面 AI Coding Agent
`2026.09 – 至今` ｜ 独立开发（Electron 桌面端 / Python 内核 / 架构设计与评审） ｜ 桌面 Agent · Agent 运行时
[源码](https://github.com/andyxu1234/soul_buddy) ｜ [在线体验](https://andyxu1234.github.io/soul_buddy/)

一个「真能干活」的桌面 coding agent：Electron 桌面壳 + FastAPI 本地 sidecar + 真 LLM tool-calling loop，把权限门、审计链、上下文压缩与三层记忆做成一套可运行的完整 harness——不是演示，是能真的读写代码、执行命令的桌面助手。

从架构设计到交付独立完成，单月推进 P0–P5 全部里程碑：后端 13,175 行 Python、桌面端 7,724 行 TS/TSX，26 个测试文件 316 条用例。内核替换掉教学版「用正则匹配意图」的假 agent，改为真实模型的 tool-calling 循环，并通过归一化层（ToolSpec / ToolCall / ModelTurn）把 DeepSeek / Anthropic / OpenAI 收敛到同一套接口，provider 可切换。安全上把权限提升为顶层独立包，避免 MCP、skill 等新增执行路径绕过权限门；并针对「用户点一次允许就能 cat ~/.ssh/id_rsa」这一真实缺口，补上 bash 命令字符串内的路径扫描。桌面端 sidecar 采用本地 TCP + 随机端口 + 一次性 token + httpOnly cookie，token 只在 main 进程内流转、不落 stdout，preload 走 contextIsolated 只暴露安全封装。另交付 MkDocs 文档站（22 份模块文档 + 10 份架构文档），含设计评审识别出的 5 个架构缺陷与 9 份 ADR。

**核心工作与亮点**

- 真 LLM tool-calling loop 取代教学版的正则意图匹配；Provider 可切换（DeepSeek / Anthropic / OpenAI），经 ToolSpec / ToolCall / ModelTurn 归一化层统一到同一套工具协议
- 权限治理提升为顶层独立包（防 MCP / skill 等新执行路径绕过），并扫描 bash 命令字符串内的路径、对 hard_deny 做标准化后分段正则匹配，堵住 rm  -rf、RM -RF、echo x && rm -rf / 一类绕过手法
- 桌面端安全边界：sidecar 用本地 TCP + 随机端口 + 一次性 token + httpOnly cookie，token 只在 main 进程内流转（经 env 传递、不落 stdout）；preload 走 contextIsolated 仅暴露安全封装，不泄露 Node API
- 上下文层按 provider 窗口 ×0.75 触发压缩，截断 → 去重 → 剪枝 → 摘要四级降级链（摘要失败自动降级不抛）；PromptSegment 按预算拼装，丢弃了哪一段可解释
- 三层记忆（user 优先于 workspace 优先于 cloud）+ SQLite 派生索引：JSONL 是唯一真相，索引漂移时降级为 degraded 并支持从 JSONL 全量重建
- 交付 PyInstaller onefile 打包的 26.6MB sidecar exe，并用无 GUI 冒烟脚本直拉打包产物，端到端验证握手、同源托管与鉴权链路

**技术栈**：Electron · React 18 · TypeScript · electron-vite · FastAPI · Python · SQLAlchemy 2.0 · SQLite · SSE · MCP · PyInstaller · MkDocs

### 2. AI 足球预测平台（世界杯 · 五大联赛）
`2026.04 – 2026.07` ｜ 独立开发（前端 / 后端 / AI 编排 / 部署） ｜ 全栈 · 多模型预测
[源码](https://github.com/andyxu1234/world-cup-prediction) ｜ [在线体验](https://andyxu1234.github.io/world-cup-prediction/)

让 10 个主流大模型同台预测比赛胜负与精确比分：LangGraph 编排并行调用 + 共识聚合 + 信心指数，配套人机投票、AI / 人类双维度排行榜，一套代码交付微信小程序 / Web / APK 多端。

从 0 到 1 独立完成全栈交付，项目已开源（MIT，79 次提交）。后端是 FastAPI + SQLAlchemy 2.0 异步服务（18 张业务表 / 50+ 端点 / 17 个 Alembic 迁移版本），通过 OfoxAI 统一网关接入 10 个国内外主流大模型，用 LangGraph StateGraph 编排 load_match → parallel_predict → validate → aggregate → summary 链路，把并行预测、失败重试与多模型异构输出的自适应解析收敛成一条可测的流水线；模型阵容由 ai_models 表驱动，增删启停无需改代码。数据侧接入 Highlightly 足球数据 API，APScheduler 跑 6 个 cron job（比赛同步 / 预测生成 / 积分榜 / 缓存刷新 / 赔率快照 / Telegram 推送），赛前赔率按 bookmaker + 市场 + 日期做追加式快照，为预测准确性评估提供对照基线。前端用 Taro 一套代码跨编译微信小程序与 H5，并推进去微信化，落地独立 Web 与 APK（WebView 壳）及手机号 / 邮箱登录。

**核心工作与亮点**

- 基于 LangGraph 编排多 Agent 预测链路（load_match → parallel_predict → validate → aggregate → summary）：并行调用 10 个模型，含失败重试、异构输出自适应解析与共识聚合（信心指数）
- 模型阵容数据库驱动（ai_models 表），模型增删改 / 启停无需改动代码，支撑阵容动态扩展
- AI / 人类双维度排行榜：独立统计胜负命中率与精确比分命中率，支持多联赛筛选与战绩追溯；并用「打脸合集」自动汇总高信心翻车案例
- 异步 SQLAlchemy 2.0 + asyncmy + TTLCache 本地缓存 + APScheduler 缓存预热；赛前赔率追加式快照（bookmaker / 市场 / 日期唯一约束）为准确性评估提供对照
- 多端工程化：Taro 一套代码跨编译微信小程序 / H5，推进去微信化落地独立 Web 与 APK（WebView 壳）；Docker Compose + Nginx 部署

**技术栈**：Taro 4.1 · React 18 · TypeScript · Zustand · FastAPI · SQLAlchemy 2.0 · MySQL 8.0 · LangGraph · OfoxAI · APScheduler · Docker Compose · Nginx

### 3. 马拉松赛事追踪小程序
`2026.08 – 至今` ｜ 独立开发（小程序前端 / 服务端 / 数据管道 / 设计系统） ｜ 全栈 · 小程序
[源码](https://github.com/andyxu1234/marathon) ｜ [在线体验](https://andyxu1234.github.io/marathon/)

把「找赛事 → 判断要不要报名 → 盯报名 / 缴费 / 中签 → 沉淀个人战绩」这条散落在公众号与网页里的长链路，收进一个六个页面的小程序：全国赛事五维筛选、报名三维追踪、跑者排行榜与个人战绩统计。

从 0 到 1 独立完成全栈交付：前端用 Taro 4.1 + React 18 + TypeScript，一套代码编译微信小程序、抖音小程序与 H5；后端是 FastAPI + SQLAlchemy 2.0 异步服务（7 张业务表 / 26 个端点 / 7 个 Alembic 迁移版本），提供赛事列表与多维筛选、关注收藏、报名状态流转、跑者排行、个人战绩统计与配置字典六组接口。数据不靠人工整理，而是一条自建的赛事富化管道：抓取赛事列表卡片后用规则解析出结构化字段，再让 LLM 联网补全简介、路线、主办方、报名费等缺失信息并做二轮筛选，最后以赛事 ID 为增量键、关键卡片字段的 sha1 哈希判断内容是否变化，只对新增或变更的赛事重新富化，原始 / 富化 / 最终三态 JSON 全量留痕、可回溯审计；APScheduler 每天 06:30 定时运行，并支持手动触发与运行报告。产品上把报名状态拆成报名、缴费、中签三个独立维度，关注页用 chips 随手切换并反算开赛倒计时；跑者排行按比赛类型推算里程（全马 42.195 / 半马 21.0975 / 健康跑 5 / 越野 30 km）做四指标实时聚合。设计上自建「晨曦跑道」主题，珊瑚橙 × 青柠双主色与暖白纸面层级收敛为 SCSS token 自动注入每个样式文件，保证六个页面视觉语言一致；项目已在 GitHub Pages 上线介绍页。

**核心工作与亮点**

- 赛事数据富化管道：规则解析产出结构化字段，LLM 联网补全缺失信息后做二轮筛选；以赛事 ID 为增量键、关键卡片字段的 sha1 哈希判断内容是否变化，只重跑新增或变更的赛事
- 全链路可审计：原始卡片 / LLM 富化 / 二轮筛选三态 JSON 全量留痕，附来源 URL 与抓取时间；AI 只在规则解析失效时兜底，主链路保持确定性
- 报名 / 缴费 / 中签三维状态建模：三者独立落库并支持单场费用覆盖，同一张表承载完赛时间、参赛号码与 PB 标记，同时驱动关注页追踪、个人战绩与排行榜
- 跑者排行四指标实时聚合（总跑量 / 半马 PB / 全马 PB / 总花费），官方赛事与自定义赛事双数据源合并，按比赛类型推算里程并支持性别与年龄段筛选
- Taro 一套代码编译微信小程序 / 抖音小程序 / H5，登录按端分流（微信与抖音 code 换 openid 静默登录、H5 保留密码登录），并用构建产物修正脚本消除多端配置差异
- 五维筛选的枚举值全部由后端从真实数据聚合返回，避免「选了却没有结果」的空枚举；首页排序由报名状态、热门与推荐共同驱动

**技术栈**：Taro 4.1 · React 18 · TypeScript · Zustand · Sass · FastAPI · SQLAlchemy 2.0 · MySQL 8.0 · Alembic · APScheduler · httpx · JWT · BeautifulSoup4

### 4. rush-hour · 汽车华容道（H5 / 微信小游戏）
`2026.09 – 至今` ｜ 独立开发（玩法内核 / 渲染 / 双端构建 / 工程化） ｜ 双端游戏 · 关卡解谜
[源码](https://github.com/andyxu1234/rush-hour) ｜ [在线体验](https://andyxu1234.github.io/rush-hour/)

在 6×6 棋盘上把红车滑出右侧出口，步数越少越好：纯 TypeScript + Canvas 2D 手写的汽车华容道，不用任何游戏引擎，同一套内核同时编译出 H5 网页版与微信小游戏版，并配 BFS 最少步数求解器与求解器校验过的程序化关卡。

从 0 到 1 独立完成，技术栈刻意收敛到纯 TypeScript + Canvas 2D，不使用 Cocos / Laya 类引擎，玩法与渲染都由自己实现。内核零平台依赖，拆成 model / moves / solver / game / save 六个模块；棋盘状态一律由走子序列重放得出，于是「撤销 = 弹栈」「存档 = 存 moves」「将来服务端重放防作弊」三件事共用同一份数据，永远不会互相漂移。平台差异被冻结进一个 Platform 接口（画布 / 存储 / 网络 / 音频 / 分享），H5 侧用 DOM + localStorage + WebAudio、小游戏侧用 wx.*，双端复用率约 95%，并由 ESLint 强制 core 与 render 两层不得出现 window / document / wx / localStorage / eval —— 小游戏没有 DOM/BOM 且禁用 eval，这是同一套代码能编译到两端的硬前提。关卡不走人工摆放：Python 参考求解器生成，TS 求解器复算，L2 跨语言一致性校验逐关比对最少步数、可达状态数、最优路径数与难度分档（当前 34 关：教学 8 + 经典 26，构建期内联为常量）；求解器同时支撑剩余步数与最优下一步提示。质量门是一键 npm run check：双端类型检查 + 单测 + 双端构建 + 产物红线（H5 ≤ 350KB、产物不含 solution 字段、不含 eval / new Function、小游戏主包 ≤ 4MB）；e2e 用 Playwright 覆盖 3 种视口，触摸用例经 CDP 派发带抖动的真实手势。美术侧把 4.4MB 原始贴图抠掉被「画上去」的伪透明棋盘格、裁到内容包围盒再压缩到 124KB，且贴图始终是可选增强——任何一张加载失败自动回落矢量绘制，素材不可能让游戏跑不起来。另交付项目落地页，含可直接试玩的网页版，截图由 Playwright 驱动真实构建产物生成，部署前的冒烟检查会拦下 404 图片与起不来的试玩页。

**核心工作与亮点**

- 一套代码双端交付：纯 TypeScript + Canvas 2D 手写（不用 Cocos / Laya），同一内核编译到 H5 与微信小游戏，复用率约 95%；平台能力全部经冻结的 Platform 接口注入，ESLint 强制 core / render 两层禁触 window / document / wx / localStorage / eval
- 走子序列是唯一事实来源：棋盘状态一律由 moves 重放得出，撤销＝弹栈、存档＝存 moves、将来服务端重放防作弊共用一份数据，永不漂移
- BFS 求解器 + 程序化关卡：Python 参考求解器生成、TS 求解器复算，L2 跨语言校验逐关比对最少步数 / 可达状态数 / 最优路径数 / 难度分档（34 关：教学 8 + 经典 26）；同一求解器提供剩余步数与最优下一步提示
- 输入手感按真机校准：轻点容差由 4px 提到 18px 并改欧氏距离判定，修掉 onMove 无条件清空基线导致结算弹窗按钮在真机点不动的问题；e2e 用 CDP 派发带 2px 抖动的真实触摸手势做回归
- 一键质量门：双端类型检查 + 单测 + 双端构建 + 产物红线（H5 ≤ 350KB、不含 solution 字段、不含 eval / new Function、小游戏主包 ≤ 4MB）；Playwright e2e 覆盖 smoke / gameplay / drag / touch，共 3 种视口
- 素材流水线：4.4MB 原始贴图 → 抠除被「画上去」的伪透明棋盘格（含车身阴影与棋盘格混合产生的中灰残留）+ 裁包围盒 + 压缩 → 124KB；贴图是可选增强，加载失败自动回落矢量绘制

**技术栈**：TypeScript · Canvas 2D · Vite · esbuild · npm workspaces · Vitest · Playwright · ESLint · Python · 微信小游戏 · GitHub Actions

---

_本文件由个人主页内容自动生成（个人主页：index.html）_