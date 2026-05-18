const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const fs = require('fs');

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "FF0050" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "00F2EA" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } }
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    children: [
      // 封面
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Software Engineer as System Thinker", bold: true, size: 44 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Lessons from TikTok Architecture", size: 28, color: "00F2EA" })]
      }),
      new Paragraph({}),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "TikTok抖音系统架构实践演讲稿", size: 22, color: "888888" })]
      }),
      new Paragraph({}),

      // 开场
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "开场 Introduction", bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "English", color: "FF0050" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Good morning/afternoon everyone. Today, I want to share with you my insights on Software Engineer as System Thinker, using TikTok's architecture as our case study. Building a platform that serves over one billion users worldwide has taught us invaluable lessons about system design, integration, and thinking beyond individual components.", size: 24 })]
      }),
      new Paragraph({}),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文", color: "00F2EA" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "大家好。今天我想和大家分享我对\"软件工程师作为系统思考者\"的理解，我们将以TikTok抖音的系统架构作为案例研究。构建一个服务全球超过10亿用户的平台，教会了我们关于系统设计、集成和超越单个组件思考的宝贵经验。", size: 24 })]
      }),
      new Paragraph({}),

      // TikTok架构概览
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "一、TikTok系统架构 TikTok System Architecture", bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "English", color: "FF0050" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Let me introduce TikTok's overall system architecture. It's a massive distributed system serving billions of users with extremely low latency requirements.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "The architecture consists of four main layers: The Client Layer includes the Mobile App for iOS and Android, Short Video Player with smooth playback, Feed UI for infinite scrolling, and User Interaction handlers. The Gateway Layer provides API Gateway for request routing, Load Balancing across server clusters, Rate Limiting to prevent abuse, and Authentication services. The Service Layer contains Video Service for upload and transcoding, User Service for profiles and following, Recommendation Engine powered by AI, and Search Service for content discovery. The Data Layer uses MySQL for structured data, Redis for caching, Kafka for message queuing, and Object Storage for video files.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "The scale is staggering: over 1 billion users, 100 million+ daily active users, 10 million+ videos uploaded daily, operating across 200+ countries, with response times under 200 milliseconds and 99.9% uptime requirement.", size: 24 })]
      }),
      new Paragraph({}),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文", color: "00F2EA" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "让我介绍TikTok的整体系统架构。这是一个服务数十亿用户的超大规模分布式系统，要求极低的延迟。架构由四个主要层次组成：表现层包括iOS和Android移动应用、支持流畅播放的短视频播放器、无限滚动的信息流界面、以及用户交互模块。网关层提供API网关、跨服务器集群的负载均衡、限流机制和认证服务。服务层包含视频服务、用户服务、AI推荐的推荐引擎和搜索服务。数据层使用MySQL、Redis、Kafka和对象存储。规模令人惊叹：超过10亿用户、1亿以上日活用户、每日1000万以上视频上传、运营覆盖200多个国家、响应时间低于200毫秒、99.9%的正常运行时间要求。", size: 24 })]
      }),
      new Paragraph({}),

      // 软件作为集成技术（更新版）
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "二、软件作为集成技术 Software as Integrating Technology", bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "English", color: "FF0050" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Software is the core of technology integration in TikTok. It connects multiple complex systems into one unified platform. Let me show you the detailed integration flow and the complexity of each component.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Integration Flow: When a user opens the app, the Mobile App connects through the CDN Network for content delivery, then through the API Gateway for routing, to Microservices for business logic, and finally to the Big Data Platform for analytics and AI processing.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Now, let me dive deep into the Big Data Platform, which is the heart of TikTok's intelligence:", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "The Big Data Platform consists of four major components:", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "First, Hadoop/Hive for Data Lake Storage. This stores petabytes of user behavior data, video metadata, and engagement metrics. It's the foundation for all batch processing and historical analysis.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Second, Flink/Spark for Real-time Processing. These stream processing engines analyze millions of events per second, enabling real-time analytics, live dashboard updates, and immediate pattern detection.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Third, Kafka for Event Streaming. This is the backbone of TikTok's event-driven architecture, handling over 10 million events per second during peak times.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Fourth, TensorFlow for ML Training. This powers the recommendation models, content understanding, and user behavior prediction systems.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Four Key Integration Mechanisms:", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "First, CDN Integration with 3000+ edge nodes worldwide, achieving less than 50ms latency for 95% of users. Videos are cached at geographic Points of Presence, with adaptive bitrate streaming for optimal quality.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Second, Microservices Architecture with 1000+ independent services. Services communicate via gRPC protocol, enabling independent deployment and scaling. Service mesh technology manages traffic routing, load balancing, and circuit breaking.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Third, Event-Driven Architecture with Kafka. This handles 10 million+ events per second. The pipeline processes: video upload triggers transcoding, transcoding completion triggers content indexing, user actions trigger engagement tracking, and all services stay synchronized through event streaming.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Fourth, AI/ML Pipeline processing petabyte-scale data for model training. The system performs real-time recommendation inference for each user request, automatic content moderation and tagging for uploaded videos, and user behavior prediction for personalized experience.", size: 24 })]
      }),
      new Paragraph({}),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文", color: "00F2EA" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "软件是TikTok技术集成的核心。它将多个复杂系统连接成一个统一的平台。让我向您展示详细的集成流程和每个组件的复杂性。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "集成流程：当用户打开应用时，移动应用通过CDN网络进行内容分发，然后通过API网关进行路由，到达微服务处理业务逻辑，最后到达大数据平台进行分析和AI处理。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "现在，让我深入了解大数据平台，这是TikTok智能的核心：", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "大数据平台由四个主要组件构成：", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "第一，Hadoop/Hive数据湖存储。存储PB级用户行为数据、视频元数据和参与度指标。它是所有批处理和历史分析的基础。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "第二，Flink/Spark实时处理。这些流处理引擎每秒分析数百万个事件，实现实时分析、实时仪表板更新和即时模式检测。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "第三，Kafka事件流。这是TikTok事件驱动架构的支柱，在高峰时段每秒处理超过1000万个事件。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "第四，TensorFlow ML训练。这为推荐模型、内容理解和用户行为预测系统提供动力。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "四个关键集成机制：", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "第一，CDN集成拥有全球3000多个边缘节点，为95%的用户实现低于50毫秒的延迟。视频按地理位置缓存在接入点，具有自适应码率流以获得最佳质量。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "第二，微服务架构拥有1000多个独立服务。服务通过gRPC协议通信，实现独立部署和扩展。服务网格技术管理流量路由、负载均衡和熔断。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "第三，Kafka事件驱动架构。每秒处理1000万以上事件。管道处理：视频上传触发转码、转码完成触发内容索引、用户操作触发参与度跟踪、所有服务通过事件流保持同步。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "第四，AI/ML管道处理PB级数据用于模型训练。系统为每个用户请求执行实时推荐推理、对上传视频进行自动内容审核和标记、以及用户行为预测以实现个性化体验。", size: 24 })]
      }),
      new Paragraph({}),

      // 为什么隔离失败
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "三、为什么隔离会失败 Why Isolation Fails", bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "English", color: "FF0050" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "In massive-scale systems like TikTok, isolation thinking leads to catastrophic failures. Let me share four critical problems:", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Problem One - Data Inconsistency: User likes a video but the like count doesn't update. This happens when the like service and counter service operate in isolation without proper synchronization via event-driven updates through Kafka with eventual consistency.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Problem Two - Recommendation Disconnect: A video gets millions of views but doesn't appear in recommendations. The ML model is trained on stale data, isolated from real-time feedback. Online learning with real-time feature pipeline is the solution.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Problem Three - Cache Stampede: Celebrity goes viral, cache expires, thousands of requests hit the database simultaneously. Cache warming and distributed rate limiting prevent this.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Problem Four - Region Partition: User travels, sees different recommendations. Regional services operate in isolation. Unified user profile with global consistency is required.", size: 24 })]
      }),
      new Paragraph({}),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文", color: "00F2EA" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "在TikTok这样的大规模系统中，隔离思维导致灾难性的故障。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "问题一：数据不一致。用户点赞但计数不更新。需要通过Kafka的事件驱动更新加最终一致性。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "问题二：推荐断开。视频有百万浏览但不在推荐中。模型用陈旧数据训练。实时特征管道的在线学习是解决方案。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "问题三：缓存雪崩。名人走红，缓存过期，数千请求同时冲击数据库。缓存预热和分布式限流防止此问题。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "问题四：区域分割。用户旅行看到不同推荐。区域服务独立运行。需要具有全局一致性的统一用户画像。", size: 24 })]
      }),
      new Paragraph({}),

      // 代码对比
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "四、代码层面分析 Code-Level Analysis", bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "English", color: "FF0050" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "The isolation approach uses direct database writes: query video, increment count in memory, save back. Problems: database bottleneck, blocking calls, no rate limiting, inconsistent counters.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "The system thinking approach uses multi-layered architecture: Redis for fast async writes, Kafka for event publishing to multiple consumers for search index update, recommendation refresh, and analytics pipeline.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Core differences: Storage (direct DB vs Redis+Kafka), Latency (blocking vs async), Scale (100 vs 100K concurrent), Consistency (eventual isolated vs event-driven sync).", size: 24 })]
      }),
      new Paragraph({}),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文", color: "00F2EA" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "隔离方法使用直接数据库写入：查询视频、内存中增加计数、保存回去。问题：数据库瓶颈、阻塞调用、无限流、计数器不一致。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "系统思维方法使用多层架构：Redis用于快速异步写入、Kafka用于发布事件给多个消费者进行搜索索引更新、推荐刷新和分析管道。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "核心差异：存储（直接DB vs Redis+Kafka）、延迟（阻塞 vs 异步）、规模（100 vs 10万并发）、一致性（孤立最终一致 vs 事件驱动同步）。", size: 24 })]
      }),
      new Paragraph({}),

      // 系统之系统
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "五、系统之系统 Systems of Systems", bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "English", color: "FF0050" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "TikTok is a complex ecosystem of three interdependent systems:", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Cloud Infrastructure: ByteDance cloud, global CDN, Kubernetes, multi-region data centers.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Software Systems: Video pipeline, ML platform, search engine, ad system.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Human Systems: 1B+ users, creators, advertisers, content moderators.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "AI System: Recommendation engine, content understanding, user profiling, real-time personalization.", size: 24 })]
      }),
      new Paragraph({}),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文", color: "00F2EA" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "TikTok是由三个相互依赖系统组成的复杂生态系统：云基础设施（字节跳动云、全球CDN、Kubernetes、多区域数据中心）、软件系统（视频管道、ML平台、搜索引擎、广告系统）、人类系统（10亿以上用户、创作者、广告商、内容审核员）、AI系统（推荐引擎、内容理解、用户画像、实时个性化）。", size: 24 })]
      }),
      new Paragraph({}),

      // 变化的影响
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "六、变化的影响 Impact of Change", bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "English", color: "FF0050" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "A single algorithm change cascades through the entire system: Algorithm change → Feature pipeline retraining → Data storage updates → API layer adjustments → Mobile app UI changes → Analytics recalculation → Advertiser ROI impact.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Impact assessment: Video Service (Critical), User Experience (Critical), Ads (Critical), Search (Medium), Analytics (Low).", size: 24 })]
      }),
      new Paragraph({}),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文", color: "00F2EA" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "单个算法变化波及整个系统：算法变化→特征管道重新训练→数据存储更新→API层调整→移动应用UI变化→分析重新计算→广告商ROI影响。影响评估：视频服务（关键）、用户体验（关键）、广告（关键）、搜索（中等）、分析（低）。", size: 24 })]
      }),
      new Paragraph({}),

      // 角色反思
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "七、角色反思 Role Reflection", bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "English", color: "FF0050" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Past Mindset vs System Thinking Mindset:", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Past: \"Write code, ship it\" vs System: \"Design for billions from day one\"", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Past: \"My service is independent\" vs System: \"Services are interdependent\"", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Past: \"Database can handle it\" vs System: \"Cache is fundamental\"", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Past: \"Debug in production\" vs System: \"Observe, measure, iterate\"", size: 24 })]
      }),
      new Paragraph({}),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文", color: "00F2EA" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "过去的思维 vs 系统思维：\"写代码发布\" vs \"从第一天就为数十亿设计\"；\"我的服务是独立的\" vs \"服务是相互依赖的\"；\"数据库能处理\" vs \"缓存是基础的\"；\"在生产调试\" vs \"观察、测量、迭代\"。", size: 24 })]
      }),
      new Paragraph({}),

      // 总结
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "八、总结 Key Takeaways", bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "English", color: "FF0050" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Five key lessons: First, Software is the core of integration connecting CDN, microservices, AI, and billions of users. Second, Isolation causes cascade failures like data inconsistency, cache stampede, and service disconnect. Third, TikTok exemplifies Systems of Systems requiring holistic design. Fourth, Every algorithm change cascades through pipeline, storage, APIs, apps, and revenue. Fifth, Engineer's role evolves from coder to system thinker designing for billions.", size: 24 })]
      }),
      new Paragraph({}),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文", color: "00F2EA" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "五个关键教训：第一，软件是集成的核心，连接CDN、微服务、AI和数十亿用户。第二，隔离导致连锁故障如数据不一致、缓存雪崩和服务断开。第三，TikTok是系统之系统的典型例子，需要整体设计。第四，每个算法变化波及管道、存储、API、应用和收入。第五，工程师的角色从程序员演变为为数十亿设计的系统思考者。", size: 24 })]
      }),
      new Paragraph({}),

      // 结语
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "结语 Conclusion", bold: true })]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "English", color: "FF0050" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Being a software engineer at scale means being a system thinker. Understanding these systems, anticipating their interactions, designing for failure, and thinking holistically—this is what enables us to build platforms that serve the world. Thank you for your attention. I'm happy to answer any questions.", size: 24 })]
      }),
      new Paragraph({}),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文", color: "00F2EA" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "在规模化系统中做软件工程师意味着成为系统思考者。理解这些系统、预见它们的交互、为失败而设计、整体思考——这使我们能够构建服务世界的平台。感谢大家的聆听，我很乐意回答任何问题。", size: 24 })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("d:/2026/集成/damai-ticket-project/TikTok_Speaker_Script_v2.docx", buffer);
  console.log("Word document created successfully!");
});
