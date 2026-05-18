const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const fs = require('fs');

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 24 }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "1E40AF" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "059669" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // 标题
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Software Engineer as System Thinker", bold: true, size: 44 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "大麦网票务系统实践演讲稿", size: 24, color: "64748B" })]
      }),
      new Paragraph({}),

      // 开场
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "开场 Introduction", bold: true })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "英文 English", color: "1E40AF" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Good morning/afternoon everyone. Today, I want to share with you my insights on Software Engineer as System Thinker, using our Damai Ticket System as a practical case study.", size: 24 })]
      }),
      new Paragraph({}),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文 Chinese", color: "059669" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "大家好。今天我想和大家分享我在软件工程实践中对\"软件工程师作为系统思考者\"这一角色的理解，我们将以大麦网票务系统作为实际案例来进行探讨。这个项目让我深刻认识到，作为软件工程师，我们不仅仅是写代码，更需要理解整个系统的运作。", size: 24 })]
      }),
      new Paragraph({}),

      // 系统架构
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "一、大麦网系统架构 Damai System Architecture", bold: true })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "英文 English", color: "1E40AF" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Let me first introduce the overall architecture of Damai Ticket System. It's a typical three-tier architecture:", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "The Frontend layer uses Vue.js for user interface, including the AI Assistant called \"Maimei\" and Seat Map visualization. The Backend layer is built with Spring Boot, exposing REST APIs for business logic processing. The Data layer uses MySQL for persistent storage, handling transactions and caching.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "The key integration points are: REST API for frontend-backend communication, DeepSeek AI API for smart customer service, transaction consistency for orders and seats, optimistic locking for concurrency control, and Alibaba Cloud infrastructure including ECS, MySQL, and OSS.", size: 24 })]
      }),
      new Paragraph({}),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文 Chinese", color: "059669" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "首先介绍大麦网票务系统的整体架构。这是一个典型的三层架构：表现层使用Vue.js构建用户界面，包括AI助手\"麦麦\"和座位图可视化；业务层使用Spring Boot，通过REST API处理业务逻辑；数据层使用MySQL进行持久化存储，处理事务和缓存。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "关键技术集成点包括：REST API实现前后端通信、DeepSeek AI API提供智能客服、事务一致性确保订单与座位同步、乐观锁实现并发控制，以及阿里云基础设施包括ECS服务器、MySQL数据库和OSS对象存储。", size: 24 })]
      }),
      new Paragraph({}),

      // 软件作为集成技术
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "二、软件作为集成技术 Software as Integrating Technology", bold: true })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "英文 English", color: "1E40AF" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Software is the core of technology integration. In Damai, when a user browses shows, the Vue.js frontend sends HTTP requests with JSON data to the Spring Boot backend. The backend processes business logic and queries MySQL database. Meanwhile, the AI Controller integrates with DeepSeek API to provide intelligent recommendations.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Four key mechanisms make this integration work:", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "First, REST API handles data exchange between frontend and backend using JSON format.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Second, MyBatis-Plus provides ORM mapping, connecting Java objects to database tables automatically.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Third, @Transactional annotation ensures atomic operations, making order creation and seat locking work as one indivisible unit.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Fourth, AI integration via AIController calls DeepSeek API, enabling the smart customer service feature.", size: 24 })]
      }),
      new Paragraph({}),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文 Chinese", color: "059669" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "软件是技术集成的核心。在大麦网中，当用户浏览演出时，Vue.js前端发送带有JSON数据的HTTP请求到Spring Boot后端。后端处理业务逻辑并查询MySQL数据库。同时，AI控制器集成DeepSeek API提供智能推荐。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "四个关键机制使这种集成成为可能：REST API使用JSON格式处理前后端数据交换；MyBatis-Plus提供ORM映射，自动连接Java对象与数据库表；@Transactional注解确保原子操作，使订单创建和座位锁定作为一个不可分割的单元工作；AI集成通过AIController调用DeepSeek API，实现智能客服功能。", size: 24 })]
      }),
      new Paragraph({}),

      // 为什么隔离失败
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "三、为什么隔离会失败 Why Isolation Fails", bold: true })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "英文 English", color: "1E40AF" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Isolation thinking leads to system failures. In Damai, we encountered four critical problems that taught us the importance of system thinking:", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Problem One - Overselling (Race Condition): Two users grabbing the last ticket simultaneously. The isolation approach uses Read-then-Write: first query seat status, then update. Without proper locking, both orders succeed, resulting in double-booking. This is why we need optimistic locking with conditional updates.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Problem Two - Data Inconsistency: Order created but seat status not updated. When operations are not wrapped in a transaction, we get inconsistent states: orders exist but seats still show as available. The solution is @Transactional ensuring both operations succeed or fail together.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Problem Three - API Contract Mismatch: Frontend expects seat tied to showId with proper validation. Backend missing this check causes seats bound to wrong shows. System thinking requires understanding how data flows across modules.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Problem Four - UX Fragmentation: Backend returns data but frontend doesn't know how to display it properly. AI assistant becomes out of sync with actual orders. This breaks the user experience and erodes trust in the system.", size: 24 })]
      }),
      new Paragraph({}),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文 Chinese", color: "059669" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "隔离思维导致系统故障。在大麦网中，我们遇到了四个关键问题，教会了我们系统思维的重要性：", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "问题一：超卖（竞态条件）。两个用户同时抢购最后一张票。隔离方法使用\"先查后写\"：先查询座位状态，再更新。没有正确的锁定机制，两个订单都会成功，导致重复预订。这就是为什么我们需要带条件更新的乐观锁。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "问题二：数据不一致。订单创建但座位状态未更新。当操作不在事务中时，我们会得到不一致的状态：订单存在但座位仍显示为可用。解决方案是@Transactional确保两个操作一起成功或失败。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "问题三：API契约不匹配。前端期望座位与showId绑定并有适当的验证。后端缺少这个检查会导致座位被错误绑定到其他演出。系统思维需要理解数据如何跨模块流动。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "问题四：用户体验断裂。后端返回数据但前端不知道如何正确显示。AI助手与实际订单不同步。这破坏了用户体验并损害了对系统的信任。", size: 24 })]
      }),
      new Paragraph({}),

      // 系统之系统
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "四、系统之系统 Systems of Systems", bold: true })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "英文 English", color: "1E40AF" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Damai is not just a software application; it's a complex ecosystem consisting of three interdependent systems:", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Cloud Platform: This includes Alibaba ECS servers hosting our application, MySQL cloud database for data persistence, OSS object storage for uploaded files like venue images, and load balancers distributing traffic across multiple server instances.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Application Systems: The software layer comprises Spring Boot backend handling business logic, Vue.js frontend providing user interface, RESTful APIs enabling communication, and AI Assistant integrating DeepSeek for smart customer service.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Human Systems: The people layer includes users who are ticket buyers, administrators managing shows and orders, AI assistant \"Maimei\" serving as customer service, and DevOps teams maintaining the infrastructure.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "The complete interaction flow demonstrates this integration: User browses shows on their device → Vue.js frontend requests API → Spring Boot processes request → Queries MySQL for seat availability → Returns data to frontend → AI provides personalized recommendations based on user preferences.", size: 24 })]
      }),
      new Paragraph({}),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文 Chinese", color: "059669" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "大麦网不仅仅是一个软件应用，它是一个由三个相互依赖的系统组成的复杂生态系统：", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "云平台：包括托管应用程序的阿里云ECS服务器、用于数据持久化的MySQL云数据库、用于存储场地图片等上传文件的OSS对象存储、以及在多个服务器实例间分配流量的负载均衡器。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "应用系统：软件层包括处理业务逻辑的Spring Boot后端、提供用户界面的Vue.js前端、实现通信的RESTful API、以及集成DeepSeek提供智能客服的AI助手。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "人类系统：人员层包括购票用户、管理演出和订单的管理员、作为客服的AI助手\"麦麦\"、以及维护基础设施的运维团队。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "完整的交互流程展示了这种集成：用户在设备上浏览演出→Vue.js前端请求API→Spring Boot处理请求→查询MySQL获取座位可用性→返回数据到前端→AI根据用户偏好提供个性化推荐。", size: 24 })]
      }),
      new Paragraph({}),

      // 变化的影响
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "五、变化的影响 Impact of Change", bold: true })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "英文 English", color: "1E40AF" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "In Damai, every small change can trigger cascading effects throughout the system. Let me illustrate with the seat state machine, which is a perfect example of how changes ripple through the entire system.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Seat has three states: Available (status=0) means the seat can be purchased, Locked (status=2) means someone has it in their cart but hasn't paid yet, and Sold (status=1) means payment completed.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "State transitions happen in specific ways: When a user places an order, the seat transitions from Available to Locked. When payment succeeds, it goes from Locked to Sold. When the user cancels or the lock times out, it returns from Locked to Available.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "The impact of state changes is far-reaching: Frontend needs real-time seat color updates so users see accurate availability. Order table must always be in sync with seat status. AI assistant must filter by seat status when answering queries. Admin panel needs linked seat management capabilities.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Let me show you a real cascading effect: Suppose we need to add a \"zone\" field to the seat table. This single change would cascade: Seat initialization logic needs to be updated, price calculation might be affected, frontend seat map UI needs changes, and AI recommendation logic would need a complete rewrite.", size: 24 })]
      }),
      new Paragraph({}),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文 Chinese", color: "059669" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "在大麦网中，每一个小的变化都可能引发整个系统的连锁反应。让我用座位状态机来说明，这完美展示了变化如何影响整个系统。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "座位有三种状态：可用（status=0）表示座位可以购买，锁定（status=2）表示有人在购物车中但未付款，已售（status=1）表示付款完成。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "状态转换有特定的方式：当用户下单时，座位从可用转为锁定。当支付成功时，从锁定转为已售。当用户取消或锁定超时后，从锁定返回可用。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "状态变化的影响是深远的：前端需要实时座位颜色更新，让用户看到准确的可用性。订单表必须始终与座位状态同步。AI助手回答查询时必须按座位状态过滤。管理员面板需要联动的座位管理功能。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "让我展示一个真实的级联效应：假设我们需要给座位表添加一个\"区域\"字段。这个单一变化会级联：座位初始化逻辑需要更新，价格计算可能受影响，前端座位图UI需要变更，AI推荐逻辑需要完全重写。", size: 24 })]
      }),
      new Paragraph({}),

      // 角色反思
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "六、角色反思 Role Reflection", bold: true })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "英文 English", color: "1E40AF" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "The Damai project was a transformative experience that changed my understanding of what it means to be a software engineer. Before this project, my mindset was:", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "\"Controller done equals job done.\" I thought writing the endpoint was sufficient. \"Fill database fields as-is.\" I just mapped fields without understanding their relationships. \"Give frontend what it asks for.\" I didn't consider the broader implications. \"Bug comes, patch it.\" I treated problems in isolation. \"One change won't affect others.\" I underestimated dependencies. \"I only care about my module.\" I ignored cross-cutting concerns.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "After this project, my mindset shifted to system thinking: \"First draw the complete data flow diagram to understand the whole picture.\" \"Consider concurrency and transactions from the start, not as an afterthought.\" \"Analyze cascading impacts before making changes.\" \"Understand cross-module dependencies.\" \"Optimize globally, not just locally.\" \"Every change has stakeholders who need to be informed.\"", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "The key insight is: Technology is just the means, understanding the system is the core skill. The tools and frameworks we use are important, but what truly matters is our ability to see the big picture, anticipate problems, and design solutions that work across the entire system.", size: 24 })]
      }),
      new Paragraph({}),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文 Chinese", color: "059669" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "大麦网项目是一次改变性的体验，改变了我对软件工程师这一角色的理解。在这个项目之前，我的思维是：", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "\"Controller写完就完事了。\"我以为写完端点就够了。\"数据库字段照着填。\"我只是映射字段而不理解它们的关系。\"前端要什么我给什么。\"我不考虑更广泛的影响。\"Bug来了就打补丁。\"我把问题割裂处理。\"一个变化不会影响其他。\"我低估了依赖关系。\"我只关心我的模块。\"我忽视了横切关注点。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "这个项目之后，我的思维转变为系统思考：\"先画完整的数据流图，理解全貌。\"\"从一开始就要考虑并发和事务，而不是事后补救。\"\"修改前分析级联影响。\"\"理解跨模块依赖。\"\"从全局优化而非局部。\"\"每个变化都有需要通知的利益相关者。\"", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "关键洞察是：技术只是手段，理解系统才是核心能力。我们使用的工具和框架很重要，但真正重要的是我们看到全局、预见问题、设计跨整个系统运行的解决方案的能力。", size: 24 })]
      }),
      new Paragraph({}),

      // 总结
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "七、总结 Key Takeaways", bold: true })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "英文 English", color: "1E40AF" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Let me summarize five key lessons from this journey:", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "First, Software is the core of technology integration. It connects frontend, backend, database, and external services like AI into one unified system. Without software, these components would remain isolated.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Second, Isolation thinking leads to critical failures. Problems like overselling, data inconsistency, and API mismatches all stem from not thinking systemically. The solution is understanding the entire data flow and interactions.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Third, Damai exemplifies Systems of Systems. It's not just code; it's a complex ecosystem involving cloud infrastructure, multiple software applications, and human actors. Holistic thinking is essential.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Fourth, Every change has cascading effects. The seat state machine example shows how a simple field addition can ripple through initialization logic, pricing, UI, and AI features. System-wide evaluation before modification is essential.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Fifth, Our role as engineers must evolve. We are not just coders who write code; we are system thinkers who understand the whole. This is what makes us valuable.", size: 24 })]
      }),
      new Paragraph({}),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文 Chinese", color: "059669" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "让我总结这段旅程的五个关键教训：", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "第一，软件是技术集成的核心。它将前端、后端、数据库和AI等外部服务连接成一个统一的系统。没有软件，这些组件将保持隔离。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "第二，隔离思维导致关键故障。超卖、数据不一致、API契约不匹配等问题都源于没有系统性地思考。解决方案是理解整个数据流和交互。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "第三，大麦网是系统之系统的典型例子。它不仅仅是代码，是一个涉及云基础设施、多个软件应用和人类角色的复杂生态系统。整体思维至关重要。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "第四，每个变化都有连锁反应。座位状态机的例子表明，添加一个简单字段如何波及初始化逻辑、定价、用户界面和AI功能。修改前的系统范围评估至关重要。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "第五，我们作为工程师的角色必须演变。我们不仅仅是写代码的程序员，我们是理解整体的系统思考者。这才是我们的价值所在。", size: 24 })]
      }),
      new Paragraph({}),

      // 结束
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "结语 Conclusion", bold: true })]
      }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "英文 English", color: "1E40AF" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "In conclusion, being a software engineer means being a system thinker. The code we write exists within larger systems of databases, networks, users, and business processes. Understanding these systems, anticipating their interactions, and designing solutions that work holistically - this is what separates good engineers from great ones.", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Thank you for your attention. I'm happy to answer any questions about Damai or system thinking in software engineering.", size: 24 })]
      }),
      new Paragraph({}),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "中文 Chinese", color: "059669" })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "总而言之，成为一名软件工程师意味着成为一名系统思考者。我们写的代码存在于数据库、网络、用户和业务流程的更大系统中。理解这些系统，预见它们的交互，设计整体运作的解决方案——这就是优秀工程师与卓越工程师的区别。", size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: "感谢大家的聆听！我很乐意回答任何关于大麦网或软件工程系统思维的问题。", size: 24 })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("d:/2026/集成/damai-ticket-project/Speaker_Script_v2.docx", buffer);
  console.log("Word document created successfully!");
});
