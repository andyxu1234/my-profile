<!-- 本文件由 tools/build-resume.cjs 从 index.html 自动生成，请勿手改；改文案请改 index.html 后重跑脚本 -->

# Andy · AI 应用开发工程师

> 上海 · 中国
> ✉ andy.dev@example.com ｜ GitHub github.com/andyxu1234 ｜ 微信 andy-ai-dev

## 求职意向

- **意向岗位**：AI 应用开发工程师
- **工作经验**：5 年（3 年 AI 应用）
- **工作地点**：上海 · 可接受调配
- **当前状态**：在职，考虑新机会

## 关于我

我聚焦 LLM 应用的工程化落地：RAG 检索增强、Agent 与工具调用、Prompt 设计与评测体系，以及模型服务的性能与成本优化。我相信一个好的 AI 应用 = 70% 的工程 + 30% 的模型——检索质量、评测闭环和稳定性，往往比换一个更大的模型更能决定最终效果。

同时也是一名能独立交付的全栈工程师：Python/FastAPI 后端、React 前端、Docker 部署与监控，我可以独立完成从需求拆解、方案设计、开发到上线运维的全链路闭环。

目前正在寻找新的 AI 应用开发工程师机会。如果你也在做有意思的大模型应用，欢迎和我聊聊。

**数据一览**：5年 研发经验 · 3年 AI 应用开发 · 10+ 上线项目

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

- **LLM 应用开发**：Prompt Engineering · RAG（分块 · 混合检索 · 重排） · Agent & Function Calling · MCP · 结构化输出 · 评测与 Bad Case 闭环 · 微调（LoRA · SFT）
- **模型与服务**：OpenAI / DeepSeek / Qwen API · vLLM 部署 · 量化（GPTQ · AWQ） · Embedding & Rerank · Ollama
- **后端与数据**：Python · FastAPI · Node.js · MySQL · PostgreSQL · pgvector · Redis · Milvus · FAISS · Elasticsearch
- **前端与工程化**：React · Next.js · Vue 3 · TypeScript · Tailwind · Docker · Nginx · CI/CD · Git · Linux

## 项目经历

### 1. AI 足球预测平台（世界杯 · 五大联赛）
`2026.04 – 2026.07` ｜ 独立开发（前端 / 后端 / AI 编排 / 部署） ｜ 全栈 · 多模型预测
[源码](https://github.com/AndyXu-Citi/world-cup-prediction)

让 10 个主流大模型同台预测比赛胜负与精确比分：LangGraph 编排并行调用 + 共识聚合 + 信心指数，配套人机投票、AI / 人类双维度排行榜，一套代码交付微信小程序 / Web / APK 多端。

从 0 到 1 独立完成全栈交付，项目已开源（MIT，79 次提交）。后端是 FastAPI + SQLAlchemy 2.0 异步服务（18 张业务表 / 50+ 端点 / 17 个 Alembic 迁移版本），通过 OfoxAI 统一网关接入 10 个国内外主流大模型，用 LangGraph StateGraph 编排 load_match → parallel_predict → validate → aggregate → summary 链路，把并行预测、失败重试与多模型异构输出的自适应解析收敛成一条可测的流水线；模型阵容由 ai_models 表驱动，增删启停无需改代码。数据侧接入 Highlightly 足球数据 API，APScheduler 跑 6 个 cron job（比赛同步 / 预测生成 / 积分榜 / 缓存刷新 / 赔率快照 / Telegram 推送），赛前赔率按 bookmaker + 市场 + 日期做追加式快照，为预测准确性评估提供对照基线。前端用 Taro 一套代码跨编译微信小程序与 H5，并推进去微信化，落地独立 Web 与 APK（WebView 壳）及手机号 / 邮箱登录。

**核心工作与亮点**

- 基于 LangGraph 编排多 Agent 预测链路（load_match → parallel_predict → validate → aggregate → summary）：并行调用 10 个模型，含失败重试、异构输出自适应解析与共识聚合（信心指数）
- 模型阵容数据库驱动（ai_models 表），模型增删改 / 启停无需改动代码，支撑阵容动态扩展
- AI / 人类双维度排行榜：独立统计胜负命中率与精确比分命中率，支持多联赛筛选与战绩追溯；并用「打脸合集」自动汇总高信心翻车案例
- 异步 SQLAlchemy 2.0 + asyncmy + TTLCache 本地缓存 + APScheduler 缓存预热；赛前赔率追加式快照（bookmaker / 市场 / 日期唯一约束）为准确性评估提供对照
- 多端工程化：Taro 一套代码跨编译微信小程序 / H5，推进去微信化落地独立 Web 与 APK（WebView 壳）；Docker Compose + Nginx 部署

**技术栈**：Taro 4.1 · React 18 · TypeScript · Zustand · FastAPI · SQLAlchemy 2.0 · MySQL 8.0 · LangGraph · OfoxAI · APScheduler · Docker Compose · Nginx

### 2. 企业知识库智能问答系统
`2025.02 – 至今` ｜ 架构设计与核心开发 ｜ RAG · 检索增强

面向企业内部资料的智能问答系统：多格式文档解析、混合检索加重排、答案引用溯源，服务数千名员工，是公司内部使用最频繁的 AI 工具之一。

从 0 到 1 完成架构设计与核心研发。接入 Wiki、PDF、飞书文档等数十万篇内部资料，针对“答非所问”与幻觉两大痛点，设计了“分块调优 + BM25/向量混合检索 + Rerank 重排”的多级检索链路，并以引用溯源和“无依据不回答”策略守住可信底线。同时建立了离线评测集与 Bad Case 回流机制，让检索与问答质量可以量化、可持续迭代。

**核心工作与亮点**

- 多级检索链路：分块策略调优、BM25 + 向量混合召回、Cross-Encoder 重排，回答准确率显著提升
- 答案引用溯源 + “无依据不回答”策略，可信可审计
- 流式输出、多轮对话与权限隔离，贴合企业真实场景
- 离线评测集 + Bad Case 回流机制，质量可量化、可持续迭代

**技术栈**：Python · FastAPI · LangChain · Milvus · Elasticsearch · Redis · React · vLLM

### 3. 多 Agent 数据分析助手
`2024.05 – 2025.01` ｜ 主导设计与开发 ｜ Agent · 智能体

用自然语言问数据：Agent 自动拆解问题、生成并自检 SQL、执行分析，最后输出图表与结论式报告，让业务同学无需写 SQL 也能自助分析。

面向业务同学的“随身数据分析师”。基于 Function Calling 与多 Agent 协作：规划 Agent 负责拆解问题与分析路径，Text2SQL Agent 结合 schema linking 生成 SQL 并自检修正，分析 Agent 完成归因、可视化与结论生成。所有 SQL 在只读沙箱中执行，配合白名单校验与超时熔断，保证数据安全。

**核心工作与亮点**

- 规划 / Text2SQL / 分析 多 Agent 协作流，复杂问题可拆解执行
- Schema linking + SQL 自检重试，生成准确率经评测集持续优化
- 只读沙箱 + SQL 白名单 + 超时熔断，安全可控
- 自动产出 ECharts 图表与结论式分析报告

**技术栈**：Python · LangGraph · Function Calling · MySQL · ECharts · Next.js · DeepSeek

### 4. LLM 网关与推理加速平台
`2023.11 – 2024.04` ｜ 从 0 到 1 主导建设 ｜ 模型服务 · MaaS

统一接入十余个大模型的内部网关：兼容 OpenAI 协议、多租户限流、语义缓存、故障降级与全链路成本观测，让上层应用像调用一个函数一样使用大模型。

随着内部 AI 应用增多，模型调用散落各处、成本与稳定性失控。我主导搭建了统一的 LLM 网关：兼容 OpenAI 协议让存量应用零成本迁移，基于 Embedding 相似度的语义缓存大幅降低重复问题成本，配合多模型降级路由、令牌桶限流与 Prometheus/Grafana 观测大盘，token 花费与调用质量一目了然。

**核心工作与亮点**

- 兼容 OpenAI 协议，一行配置切换或降级模型
- 语义缓存 + 多级缓存，重复问题成本大幅下降
- 多租户令牌桶限流与配额管理，保障核心业务稳定
- 全链路观测：调用日志、延迟分布与 Token 成本大盘

**技术栈**：Python · vLLM · Redis · Prometheus · Grafana · Docker · Nginx

### 5. 智能客服工单助手
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