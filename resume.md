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

目前正把主力语言从 Java 转向 Python，专注 LLM 应用的工程化落地：RAG 检索增强、Agent 与工具调用、多模型编排、打包与上线交付，已独立完成两个从 0 到 1 的 AI 应用。正在寻找 AI 应用开发工程师岗位。

**数据一览**：9人 团队管理规模 · 4家 服务过的企业 · 2个 已上线 AI 应用

## 经历

### AI 应用开发工程师 ｜ 某互联网公司
`2023.02 – 至今`

主导企业级 RAG 知识库、多 Agent 数据分析与 LLM 网关等核心系统的架构设计与落地，服务数千名内部用户。

### 后端开发工程师 ｜ 某软件公司
`2021.07 – 2023.01`

负责业务中台与数据服务的后端研发，积累了扎实的分布式系统与服务化经验。

### 计算机科学与技术 · 本科 ｜ 某大学
`2017.09 – 2021.06`

主修后端与系统方向，多次获校级奖学金。

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
[源码](https://github.com/andyxu1234/world-cup-prediction)

让 10 个主流大模型同台预测比赛胜负与精确比分：LangGraph 编排并行调用 + 共识聚合 + 信心指数，配套人机投票、AI / 人类双维度排行榜，一套代码交付微信小程序 / Web / APK 多端。

从 0 到 1 独立完成全栈交付，项目已开源（MIT，79 次提交）。后端是 FastAPI + SQLAlchemy 2.0 异步服务（18 张业务表 / 50+ 端点 / 17 个 Alembic 迁移版本），通过 OfoxAI 统一网关接入 10 个国内外主流大模型，用 LangGraph StateGraph 编排 load_match → parallel_predict → validate → aggregate → summary 链路，把并行预测、失败重试与多模型异构输出的自适应解析收敛成一条可测的流水线；模型阵容由 ai_models 表驱动，增删启停无需改代码。数据侧接入 Highlightly 足球数据 API，APScheduler 跑 6 个 cron job（比赛同步 / 预测生成 / 积分榜 / 缓存刷新 / 赔率快照 / Telegram 推送），赛前赔率按 bookmaker + 市场 + 日期做追加式快照，为预测准确性评估提供对照基线。前端用 Taro 一套代码跨编译微信小程序与 H5，并推进去微信化，落地独立 Web 与 APK（WebView 壳）及手机号 / 邮箱登录。

**核心工作与亮点**

- 基于 LangGraph 编排多 Agent 预测链路（load_match → parallel_predict → validate → aggregate → summary）：并行调用 10 个模型，含失败重试、异构输出自适应解析与共识聚合（信心指数）
- 模型阵容数据库驱动（ai_models 表），模型增删改 / 启停无需改动代码，支撑阵容动态扩展
- AI / 人类双维度排行榜：独立统计胜负命中率与精确比分命中率，支持多联赛筛选与战绩追溯；并用「打脸合集」自动汇总高信心翻车案例
- 异步 SQLAlchemy 2.0 + asyncmy + TTLCache 本地缓存 + APScheduler 缓存预热；赛前赔率追加式快照（bookmaker / 市场 / 日期唯一约束）为准确性评估提供对照
- 多端工程化：Taro 一套代码跨编译微信小程序 / H5，推进去微信化落地独立 Web 与 APK（WebView 壳）；Docker Compose + Nginx 部署

**技术栈**：Taro 4.1 · React 18 · TypeScript · Zustand · FastAPI · SQLAlchemy 2.0 · MySQL 8.0 · LangGraph · OfoxAI · APScheduler · Docker Compose · Nginx

### 3. 企业知识库智能问答系统
`2025.02 – 至今` ｜ 架构设计与核心开发 ｜ RAG · 检索增强

面向企业内部资料的智能问答系统：多格式文档解析、混合检索加重排、答案引用溯源，服务数千名员工，是公司内部使用最频繁的 AI 工具之一。

从 0 到 1 完成架构设计与核心研发。接入 Wiki、PDF、飞书文档等数十万篇内部资料，针对“答非所问”与幻觉两大痛点，设计了“分块调优 + BM25/向量混合检索 + Rerank 重排”的多级检索链路，并以引用溯源和“无依据不回答”策略守住可信底线。同时建立了离线评测集与 Bad Case 回流机制，让检索与问答质量可以量化、可持续迭代。

**核心工作与亮点**

- 多级检索链路：分块策略调优、BM25 + 向量混合召回、Cross-Encoder 重排，回答准确率显著提升
- 答案引用溯源 + “无依据不回答”策略，可信可审计
- 流式输出、多轮对话与权限隔离，贴合企业真实场景
- 离线评测集 + Bad Case 回流机制，质量可量化、可持续迭代

**技术栈**：Python · FastAPI · LangChain · Milvus · Elasticsearch · Redis · React · vLLM

### 4. 多 Agent 数据分析助手
`2024.05 – 2025.01` ｜ 主导设计与开发 ｜ Agent · 智能体

用自然语言问数据：Agent 自动拆解问题、生成并自检 SQL、执行分析，最后输出图表与结论式报告，让业务同学无需写 SQL 也能自助分析。

面向业务同学的“随身数据分析师”。基于 Function Calling 与多 Agent 协作：规划 Agent 负责拆解问题与分析路径，Text2SQL Agent 结合 schema linking 生成 SQL 并自检修正，分析 Agent 完成归因、可视化与结论生成。所有 SQL 在只读沙箱中执行，配合白名单校验与超时熔断，保证数据安全。

**核心工作与亮点**

- 规划 / Text2SQL / 分析 多 Agent 协作流，复杂问题可拆解执行
- Schema linking + SQL 自检重试，生成准确率经评测集持续优化
- 只读沙箱 + SQL 白名单 + 超时熔断，安全可控
- 自动产出 ECharts 图表与结论式分析报告

**技术栈**：Python · LangGraph · Function Calling · MySQL · ECharts · Next.js · DeepSeek

### 5. LLM 网关与推理加速平台
`2023.11 – 2024.04` ｜ 从 0 到 1 主导建设 ｜ 模型服务 · MaaS

统一接入十余个大模型的内部网关：兼容 OpenAI 协议、多租户限流、语义缓存、故障降级与全链路成本观测，让上层应用像调用一个函数一样使用大模型。

随着内部 AI 应用增多，模型调用散落各处、成本与稳定性失控。我主导搭建了统一的 LLM 网关：兼容 OpenAI 协议让存量应用零成本迁移，基于 Embedding 相似度的语义缓存大幅降低重复问题成本，配合多模型降级路由、令牌桶限流与 Prometheus/Grafana 观测大盘，token 花费与调用质量一目了然。

**核心工作与亮点**

- 兼容 OpenAI 协议，一行配置切换或降级模型
- 语义缓存 + 多级缓存，重复问题成本大幅下降
- 多租户令牌桶限流与配额管理，保障核心业务稳定
- 全链路观测：调用日志、延迟分布与 Token 成本大盘

**技术栈**：Python · vLLM · Redis · Prometheus · Grafana · Docker · Nginx

### 6. 智能客服工单助手
`2023.03 – 2023.10` ｜ 核心开发 ｜ NLP 应用

面向客服团队的 AI 副驾驶：进线工单自动分类、摘要与话术推荐，“AI 起草 + 人工确认”的人机协作模式让首次响应时长大幅下降。

客服团队每天面对大量重复咨询。系统对进线工单自动完成意图分类、情绪识别与内容摘要，结合知识库生成推荐话术；复杂问题一键转人工，并自动附带完整上下文摘要。采用“AI 起草 + 人工确认”的协作模式，在提升效率的同时守住服务质量底线。

**核心工作与亮点**

- 意图分类 + 情绪识别 + 自动摘要的进线预处理
- 基于知识库的推荐话术，AI 起草、人工一键确认
- 转人工时自动附上下文摘要，交接零成本
- 上线后首次响应时长与平均处理时长显著下降

**技术栈**：Python · LoRA 微调 · RAG · FastAPI · Vue 3 · MySQL

---

_本文件由个人主页内容自动生成（个人主页：index.html）_