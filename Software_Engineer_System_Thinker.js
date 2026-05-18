const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = 'Software Engineer as System Thinker';

// 配色
const C = {
  primary: "1E40AF", secondary: "3B82F6", accent: "F59E0B",
  light: "DBEAFE", bg: "F8FAFC", dark: "0F172A",
  text: "1E293B", muted: "64748B", success: "10B981", danger: "EF4444"
};

// ========== Slide 1: Title ==========
let slide1 = pres.addSlide();
slide1.background = { color: C.dark };

slide1.addShape(pres.shapes.OVAL, { x: -2, y: -2, w: 5, h: 5, fill: { color: C.primary, transparency: 70 } });
slide1.addShape(pres.shapes.OVAL, { x: 7, y: 3, w: 5, h: 5, fill: { color: C.secondary, transparency: 60 } });

slide1.addText("Software Engineer\nas System Thinker", {
  x: 0.5, y: 1.5, w: 9, h: 2,
  fontSize: 48, fontFace: "Arial Black", color: "FFFFFF", bold: true, align: "center", lineSpacingMultiple: 1.2
});

slide1.addText("Lessons from Damai Ticket System", {
  x: 0.5, y: 3.6, w: 9, h: 0.6,
  fontSize: 22, fontFace: "Calibri", color: C.light, align: "center"
});

slide1.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 4.5, w: 3, h: 0.5, fill: { color: C.accent } });
slide1.addText("Case Study Presentation", {
  x: 3.5, y: 4.5, w: 3, h: 0.5,
  fontSize: 14, fontFace: "Calibri", color: "FFFFFF", align: "center", valign: "middle", margin: 0
});

// ========== Slide 2: System Architecture ==========
let slide2 = pres.addSlide();
slide2.background = { color: C.bg };

slide2.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.primary } });
slide2.addText("Damai Ticket System Architecture", {
  x: 0.5, y: 0.15, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Arial Black", color: "FFFFFF", margin: 0
});

// 三层架构
const layers = [
  { y: 1.2, name: "Frontend", color: "10B981", items: ["Vue.js", "AI Assistant", "Seat Map UI"] },
  { y: 2.4, name: "Backend", color: C.secondary, items: ["Spring Boot", "REST API", "Business Logic"] },
  { y: 3.6, name: "Data", color: C.primary, items: ["MySQL", "Transactions", "Cache"] }
];

layers.forEach((layer) => {
  slide2.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: layer.y, w: 1.8, h: 1, fill: { color: layer.color } });
  slide2.addText(layer.name, {
    x: 0.5, y: layer.y, w: 1.8, h: 1,
    fontSize: 14, fontFace: "Calibri", color: "FFFFFF", bold: true, align: "center", valign: "middle", margin: 0
  });
  layer.items.forEach((item, i) => {
    slide2.addShape(pres.shapes.RECTANGLE, { x: 2.5, y: layer.y + 0.1 + i * 0.28, w: 1.8, h: 0.26, fill: { color: C.light } });
    slide2.addText(item, { x: 2.5, y: layer.y + 0.1 + i * 0.28, w: 1.8, h: 0.26, fontSize: 10, fontFace: "Calibri", color: C.text, align: "center", valign: "middle", margin: 0 });
  });
});

// 连接线
[1.7, 2.9, 4.1].forEach(y => {
  slide2.addShape(pres.shapes.LINE, { x: 4.5, y: y, w: 0.5, h: 0, line: { color: C.muted, width: 2 } });
});

// 右侧集成点
slide2.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 3.6, fill: { color: "FFFFFF" }, line: { color: C.light, width: 1 } });
slide2.addText("Key Integration Points", {
  x: 5.4, y: 1.3, w: 4, h: 0.4,
  fontSize: 14, fontFace: "Calibri", color: C.primary, bold: true
});

const integrations = [
  "Frontend ↔ Backend: REST API (JSON)",
  "Backend ↔ AI: DeepSeek API via SiliconFlow",
  "Order ↔ Seat: Transaction Consistency",
  "User ↔ System: State Machine Management",
  "Concurrency: Optimistic Locking + @Transactional",
  "Cloud: Alibaba ECS + MySQL + OSS"
];

slide2.addText(
  integrations.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < integrations.length - 1 } })),
  { x: 5.4, y: 1.8, w: 4, h: 2.8, fontSize: 12, fontFace: "Calibri", color: C.text }
);

// 底部
slide2.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 5, w: 9, h: 0.5, fill: { color: C.dark } });
slide2.addText("Software is the core of technology integration — connecting disparate systems into one unified whole", {
  x: 0.5, y: 5, w: 9, h: 0.5,
  fontSize: 12, fontFace: "Calibri", color: "FFFFFF", align: "center", valign: "middle", margin: 0
});

// ========== Slide 3: Software as Integrating Technology ==========
let slide3 = pres.addSlide();
slide3.background = { color: C.bg };

slide3.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.primary } });
slide3.addText("01  Software as Integrating Technology", {
  x: 0.5, y: 0.15, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Arial Black", color: "FFFFFF", margin: 0
});

// 完整流程图
slide3.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.1, w: 9, h: 2.2, fill: { color: "FFFFFF" }, line: { color: C.light, width: 1 } });

const techFlow = [
  { x: 0.8, name: "User\nBrowser", color: "10B981" },
  { x: 2.5, name: "Vue.js\nFrontend", color: "41B883" },
  { x: 4.2, name: "HTTP\nJSON", color: C.accent },
  { x: 5.9, name: "Spring Boot\nBackend", color: "6DB33F" },
  { x: 7.6, name: "MySQL\nDatabase", color: "00758F" }
];

techFlow.forEach((tech, i) => {
  slide3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: tech.x, y: 1.5, w: 1.5, h: 1.2, fill: { color: tech.color }, rectRadius: 0.1 });
  slide3.addText(tech.name, { x: tech.x, y: 1.5, w: 1.5, h: 1.2, fontSize: 11, fontFace: "Calibri", color: "FFFFFF", bold: true, align: "center", valign: "middle", margin: 0 });
  if (i < techFlow.length - 1) {
    slide3.addShape(pres.shapes.LINE, { x: tech.x + 1.5, y: 2.1, w: 0.4, h: 0, line: { color: C.muted, width: 2 } });
  }
});

// AI集成
slide3.addShape(pres.shapes.LINE, { x: 8.5, y: 2.7, w: 0, h: 0.4, line: { color: C.muted, width: 2 } });
slide3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.6, y: 3.1, w: 1.8, h: 0.8, fill: { color: "8B5CF6" }, rectRadius: 0.1 });
slide3.addText("DeepSeek API", { x: 7.6, y: 3.1, w: 1.8, h: 0.8, fontSize: 11, fontFace: "Calibri", color: "FFFFFF", bold: true, align: "center", valign: "middle", margin: 0 });

// 关键机制
slide3.addText("Key Integration Mechanisms in Damai:", {
  x: 0.5, y: 3.5, w: 9, h: 0.4,
  fontSize: 16, fontFace: "Calibri", color: C.dark, bold: true
});

const mechanisms = [
  { tech: "REST API", desc: "Frontend-Backend communication via JSON format" },
  { tech: "MyBatis-Plus", desc: "ORM mapping Java objects to database tables" },
  { tech: "@Transactional", desc: "Atomic operations ensuring order + seat consistency" },
  { tech: "AI Integration", desc: "AIController calls DeepSeek API for smart customer service" }
];

mechanisms.forEach((m, i) => {
  const y = 4 + i * 0.4;
  slide3.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: y, w: 1.8, h: 0.35, fill: { color: C.primary } });
  slide3.addText(m.tech, { x: 0.5, y: y, w: 1.8, h: 0.35, fontSize: 11, fontFace: "Calibri", color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
  slide3.addText(m.desc, { x: 2.5, y: y, w: 7, h: 0.35, fontSize: 12, fontFace: "Calibri", color: C.text, valign: "middle" });
});

// ========== Slide 4: Why Isolation Fails ==========
let slide4 = pres.addSlide();
slide4.background = { color: C.bg };

slide4.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.danger } });
slide4.addText("02  Why Isolation Fails", {
  x: 0.5, y: 0.15, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Arial Black", color: "FFFFFF", margin: 0
});

slide4.addText("Isolation thinking leads to system failures — concrete problems from Damai:", {
  x: 0.5, y: 1, w: 9, h: 0.4,
  fontSize: 14, fontFace: "Calibri", color: C.dark, bold: true
});

// 4个问题卡片
const problems = [
  {
    title: "Problem 1: Overselling (Race Condition)",
    scenario: "Two users grabbing the last ticket simultaneously",
    bad: "Check seat (available) → Create order → Two tickets sold!",
    good: "Optimistic lock: WHERE status=0 AND id=seatId → Only one succeeds"
  },
  {
    title: "Problem 2: Data Inconsistency",
    scenario: "Order created but seat status not updated",
    bad: "Update order table separately from seat table",
    good: "@Transactional wraps both: atomic success or rollback"
  },
  {
    title: "Problem 3: API Contract Mismatch",
    scenario: "Frontend expects seat tied to showId, backend missing validation",
    bad: "Seat could be bound to wrong show event",
    good: "Backend enforces: seat.showId == showId"
  },
  {
    title: "Problem 4: UX Fragmentation",
    scenario: "Backend returns order, frontend doesn't know how to display",
    bad: "AI assistant data out of sync with actual orders",
    good: "Unified state management + real-time updates"
  }
];

problems.forEach((p, i) => {
  const x = (i % 2) * 4.6 + 0.5;
  const y = Math.floor(i / 2) * 2.15 + 1.5;
  
  slide4.addShape(pres.shapes.RECTANGLE, { x: x, y: y, w: 4.4, h: 2, fill: { color: "FEF2F2" }, line: { color: "FECACA", width: 1 } });
  slide4.addShape(pres.shapes.RECTANGLE, { x: x, y: y, w: 4.4, h: 0.4, fill: { color: C.danger } });
  slide4.addText(p.title, { x: x + 0.1, y: y, w: 4.2, h: 0.4, fontSize: 11, fontFace: "Calibri", color: "FFFFFF", bold: true, valign: "middle", margin: 0 });
  
  slide4.addText("Scenario: " + p.scenario, { x: x + 0.1, y: y + 0.45, w: 4.2, h: 0.3, fontSize: 9, fontFace: "Calibri", color: C.danger, bold: true });
  slide4.addText("❌ " + p.bad, { x: x + 0.1, y: y + 0.75, w: 4.2, h: 0.5, fontSize: 9, fontFace: "Calibri", color: "991B1B" });
  slide4.addText("✓ " + p.good, { x: x + 0.1, y: y + 1.25, w: 4.2, h: 0.65, fontSize: 9, fontFace: "Calibri", color: "166534" });
});

// ========== Slide 5: Code Comparison ==========
let slide5 = pres.addSlide();
slide5.background = { color: C.bg };

slide5.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.danger } });
slide5.addText("02  Why Isolation Fails — Code-Level Analysis", {
  x: 0.5, y: 0.15, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Arial Black", color: "FFFFFF", margin: 0
});

// 错误代码
slide5.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1, w: 4.6, h: 3.3, fill: { color: "1E293B" } });
slide5.addText("❌ Isolation Thinking Code", {
  x: 0.5, y: 1.1, w: 4.2, h: 0.35,
  fontSize: 13, fontFace: "Calibri", color: C.danger, bold: true
});

const badCode = `// WRONG: Read-then-Write (race condition)
Seat seat = seatService.getById(seatId);
if(seat.getStatus() == 0) {
    seat.setStatus(2);  // lock
    seatService.update(seat);
    
    OrderInfo order = new OrderInfo();
    order.setSeatId(seatId);
    orderService.save(order);  // may fail!
}
→ Problem: Seat locked but order failed
→ Result: Seat stuck in limbo`;

slide5.addText(badCode, {
  x: 0.5, y: 1.5, w: 4.2, h: 2.7,
  fontSize: 9, fontFace: "Consolas", color: "D1D5DB"
});

// 正确代码
slide5.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1, w: 4.6, h: 3.3, fill: { color: "1E293B" } });
slide5.addText("✓ System Thinking Code", {
  x: 5.3, y: 1.1, w: 4.2, h: 0.35,
  fontSize: 13, fontFace: "Calibri", color: C.success, bold: true
});

const goodCode = `// CORRECT: Atomic operation + Transaction
@Transactional
public String create(...) {
    // Optimistic lock: conditional update
    boolean locked = seatService.update(
        new UpdateWrapper<Seat>()
            .set("status", 2)      // lock
            .eq("id", seatId)
            .eq("status", 0)       // must be available
    );
    if(!locked) return "Seat unavailable";
    
    OrderInfo order = new OrderInfo();
    order.setSeatId(seatId);
    orderService.save(order);
    // Transaction ensures atomicity
}
→ Result: Thread-safe, consistent`;

slide5.addText(goodCode, {
  x: 5.3, y: 1.5, w: 4.2, h: 2.7,
  fontSize: 9, fontFace: "Consolas", color: "D1D5DB"
});

// 关键差异表
slide5.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.4, w: 9.4, h: 1.1, fill: { color: "FFFFFF" }, line: { color: C.primary, width: 2 } });
slide5.addText("Core Differences", {
  x: 0.5, y: 4.45, w: 9, h: 0.3,
  fontSize: 12, fontFace: "Calibri", color: C.primary, bold: true
});

const diffs = [
  ["Pattern", "Read-then-Write", "Conditional Write"],
  ["Concurrency", "Unprotected", "Optimistic Lock"],
  ["Transaction", "Separate ops", "@Transactional"],
  ["Result", "Overselling", "Thread-safe"]
];

diffs.forEach((row, i) => {
  const x = 0.5 + i * 2.35;
  const bgColor = i === 0 ? C.light : (i % 2 === 0 ? "FEF2F2" : "FFFFFF");
  const textColor = i === 0 ? C.primary : C.text;
  slide5.addText(row[0], { x: x, y: 4.75, w: 2.2, h: 0.25, fontSize: 10, fontFace: "Calibri", color: textColor, bold: true });
  slide5.addText(row[1], { x: x, y: 5, w: 2.2, h: 0.2, fontSize: 9, fontFace: "Calibri", color: C.danger });
  slide5.addText(row[2], { x: x, y: 5.2, w: 2.2, h: 0.2, fontSize: 9, fontFace: "Calibri", color: C.success });
});

// ========== Slide 6: Systems of Systems ==========
let slide6 = pres.addSlide();
slide6.background = { color: C.bg };

slide6.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: "7C3AED" } });
slide6.addText("03  Systems of Systems", {
  x: 0.5, y: 0.15, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Arial Black", color: "FFFFFF", margin: 0
});

slide6.addText("Damai is a complex ecosystem: Cloud Platform + Application Systems + Human Systems", {
  x: 0.5, y: 1, w: 9, h: 0.4,
  fontSize: 14, fontFace: "Calibri", color: C.dark, bold: true
});

// 三个系统圈
const systems = [
  { x: 1, name: "☁️ Cloud\nPlatform", color: "FF9900", items: ["Alibaba ECS", "MySQL Cloud DB", "OSS Storage", "Load Balancer"] },
  { x: 4, name: "💻 Application\nSystems", color: C.secondary, items: ["Spring Boot", "Vue.js Frontend", "REST API", "AI Assistant"] },
  { x: 7, name: "👥 Human\nSystems", color: "10B981", items: ["Users (Buyers)", "Administrators", "AI \"Maimei\"", "DevOps"] }
];

systems.forEach((sys) => {
  slide6.addShape(pres.shapes.OVAL, { x: sys.x, y: 1.5, w: 2.8, h: 2.8, fill: { color: sys.color, transparency: 25 }, line: { color: sys.color, width: 2 } });
  slide6.addText(sys.name, { x: sys.x, y: 2.4, w: 2.8, h: 0.8, fontSize: 13, fontFace: "Calibri", color: sys.color, bold: true, align: "center", valign: "middle", margin: 0 });
  sys.items.forEach((item, i) => {
    slide6.addText("• " + item, { x: sys.x + 0.2, y: 3.4 + i * 0.28, w: 2.4, h: 0.28, fontSize: 10, fontFace: "Calibri", color: C.text });
  });
});

// 交互流程
slide6.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.5, w: 9, h: 1, fill: { color: "FFFFFF" }, line: { color: C.primary, width: 1 } });
slide6.addText("Damai Interaction Flow:", {
  x: 0.7, y: 4.55, w: 8.6, h: 0.3,
  fontSize: 12, fontFace: "Calibri", color: C.primary, bold: true
});

slide6.addText("User browses shows → Vue requests API → Spring Boot queries MySQL → Returns seat data → AI recommends tickets", {
  x: 0.7, y: 4.85, w: 8.6, h: 0.5,
  fontSize: 12, fontFace: "Calibri", color: C.text
});

// ========== Slide 7: Impact of Change ==========
let slide7 = pres.addSlide();
slide7.background = { color: C.bg };

slide7.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: "EA580C" } });
slide7.addText("04  Impact of Change", {
  x: 0.5, y: 0.15, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Arial Black", color: "FFFFFF", margin: 0
});

slide7.addText("In Damai, a small change can trigger cascading effects — illustrated by seat state machine:", {
  x: 0.5, y: 1, w: 9, h: 0.4,
  fontSize: 13, fontFace: "Calibri", color: C.dark, bold: true
});

// 状态机
const states = [
  { x: 1, id: "0", name: "Available", color: "10B981" },
  { x: 4, id: "2", name: "Locked", color: C.accent },
  { x: 7, id: "1", name: "Sold", color: C.danger }
];

states.forEach((s) => {
  slide7.addShape(pres.shapes.OVAL, { x: s.x, y: 1.5, w: 2, h: 1.4, fill: { color: s.color } });
  slide7.addText(s.name + "\n(status=" + s.id + ")", {
    x: s.x, y: 1.7, w: 2, h: 1,
    fontSize: 12, fontFace: "Calibri", color: "FFFFFF", bold: true, align: "center", valign: "middle", margin: 0
  });
});

// 箭头和转换
slide7.addShape(pres.shapes.LINE, { x: 3, y: 2.2, w: 1, h: 0, line: { color: C.accent, width: 3 } });
slide7.addText("Order\nstatus=0→2", { x: 3, y: 1.7, w: 1, h: 0.8, fontSize: 10, fontFace: "Calibri", color: C.accent, align: "center" });

slide7.addShape(pres.shapes.LINE, { x: 6, y: 2.2, w: 1, h: 0, line: { color: C.success, width: 3 } });
slide7.addText("Pay\nstatus=2→1", { x: 6, y: 1.7, w: 1, h: 0.8, fontSize: 10, fontFace: "Calibri", color: C.success, align: "center" });

// 右侧影响
slide7.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 3.1, w: 4, h: 1.8, fill: { color: "FFFFFF" }, line: { color: C.primary, width: 1 } });
slide7.addText("State Change Impacts:", {
  x: 5.7, y: 3.2, w: 3.6, h: 0.35,
  fontSize: 12, fontFace: "Calibri", color: C.primary, bold: true
});

const stateImpacts = [
  "Frontend: Real-time seat color update",
  "Order table: Synced with seat status",
  "AI assistant: Filter by seat status",
  "Admin panel: Linked seat management",
  "Any inconsistency → UX disaster"
];

slide7.addText(
  stateImpacts.map((item, i) => ({ text: item, options: { bullet: true, breakLine: i < stateImpacts.length - 1 } })),
  { x: 5.7, y: 3.6, w: 3.6, h: 1.2, fontSize: 10, fontFace: "Calibri", color: C.text }
);

// 级联效应
slide7.addText("Cascading Effect Example:", {
  x: 0.5, y: 3.1, w: 4.5, h: 0.35,
  fontSize: 12, fontFace: "Calibri", color: C.primary, bold: true
});

const cascade = [
  "1. Add \"zone\" field to seat table",
  "↓ 2. Seat init logic needs update",
  "↓ 3. Price calculation affected",
  "↓ 4. Frontend seat map UI changes",
  "↓ 5. AI recommendation logic rewrite"
];

cascade.forEach((c, i) => {
  const xOffset = i * 0.1;
  slide7.addShape(pres.shapes.RECTANGLE, { x: 0.5 + xOffset, y: 3.5 + i * 0.4, w: 4.3 - xOffset, h: 0.35, fill: { color: C.primary, transparency: 80 + i * 5 } });
  slide7.addText(c, { x: 0.6 + xOffset, y: 3.5 + i * 0.4, w: 4.1 - xOffset, h: 0.35, fontSize: 10, fontFace: "Calibri", color: C.primary, valign: "middle", margin: 0 });
});

// 底部
slide7.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 5.1, w: 9, h: 0.45, fill: { color: C.dark } });
slide7.addText("System thinking: Before making changes, evaluate all potential cascading effects", {
  x: 0.5, y: 5.1, w: 9, h: 0.45,
  fontSize: 12, fontFace: "Calibri", color: "FFFFFF", align: "center", valign: "middle", margin: 0
});

// ========== Slide 8: Role Reflection ==========
let slide8 = pres.addSlide();
slide8.background = { color: C.bg };

slide8.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: "059669" } });
slide8.addText("05  Role Reflection — From Coder to System Thinker", {
  x: 0.5, y: 0.15, w: 9, h: 0.6,
  fontSize: 26, fontFace: "Arial Black", color: "FFFFFF", margin: 0
});

slide8.addText("Damai project taught me: Technology is just the means, understanding the system is the core skill", {
  x: 0.5, y: 1, w: 9, h: 0.4,
  fontSize: 13, fontFace: "Calibri", color: C.dark, bold: true
});

// 转变对比
slide8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 4.3, h: 3.5, fill: { color: "FEF2F2" }, line: { color: "FECACA", width: 2 } });
slide8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 4.3, h: 0.5, fill: { color: C.danger } });
slide8.addText("❌ Past Mindset", {
  x: 0.5, y: 1.5, w: 4.3, h: 0.5,
  fontSize: 14, fontFace: "Calibri", color: "FFFFFF", bold: true, align: "center", valign: "middle", margin: 0
});

const past = [
  "\"Controller done = job done\"",
  "\"Fill DB fields as-is\"",
  "\"Give frontend what it asks for\"",
  "\"Bug comes → patch it\"",
  "\"One change won't affect others\"",
  "\"I only care about my module\"",
  "\"Don't need to understand the whole\"",
  "\"Testing is QA's job\""
];

slide8.addText(
  past.map((item, i) => ({ text: item, options: { bullet: true, breakLine: i < past.length - 1 } })),
  { x: 0.7, y: 2.1, w: 4, h: 2.8, fontSize: 11, fontFace: "Calibri", color: "991B1B" }
);

// 现在
slide8.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.5, w: 4.3, h: 3.5, fill: { color: "F0FDF4" }, line: { color: "BBF7D0", width: 2 } });
slide8.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.5, w: 4.3, h: 0.5, fill: { color: C.success } });
slide8.addText("✓ System Thinking Mindset", {
  x: 5.2, y: 1.5, w: 4.3, h: 0.5,
  fontSize: 14, fontFace: "Calibri", color: "FFFFFF", bold: true, align: "center", valign: "middle", margin: 0
});

const present = [
  "\"First draw the complete data flow\"",
  "\"Consider concurrency & transactions\"",
  "\"Design APIs with extensibility\"",
  "\"Analyze cascading impacts\"",
  "\"Understand cross-module deps\"",
  "\"Optimize globally, not locally\"",
  "\"Every change has stakeholders\"",
  "\"Test your own code\""
];

slide8.addText(
  present.map((item, i) => ({ text: item, options: { bullet: true, breakLine: i < present.length - 1 } })),
  { x: 5.4, y: 2.1, w: 4, h: 2.8, fontSize: 11, fontFace: "Calibri", color: "166534" }
);

// ========== Slide 9: Conclusion ==========
let slide9 = pres.addSlide();
slide9.background = { color: C.dark };

slide9.addShape(pres.shapes.OVAL, { x: -1.5, y: 3, w: 4, h: 4, fill: { color: C.primary, transparency: 60 } });
slide9.addShape(pres.shapes.OVAL, { x: 8, y: -1, w: 3, h: 3, fill: { color: C.secondary, transparency: 60 } });

slide9.addText("Key Takeaways", {
  x: 0.5, y: 0.5, w: 9, h: 0.8,
  fontSize: 40, fontFace: "Arial Black", color: "FFFFFF", bold: true, align: "center"
});

const takeaways = [
  { num: "01", text: "Software is the core of technology integration — connecting frontend, backend, database, and external services" },
  { num: "02", text: "Isolation thinking leads to critical issues: overselling, data inconsistency, API mismatches" },
  { num: "03", text: "Damai = Cloud Platform + Application Systems + Human Systems — a complex ecosystem requiring holistic thinking" },
  { num: "04", text: "Every change has cascading effects — system-wide evaluation before modification is essential" },
  { num: "05", text: "Engineer's role: From coder who writes code to system thinker who understands the whole" }
];

takeaways.forEach((t, i) => {
  const y = 1.5 + i * 0.75;
  
  slide9.addShape(pres.shapes.OVAL, { x: 0.8, y: y, w: 0.5, h: 0.5, fill: { color: C.accent } });
  slide9.addText(t.num, {
    x: 0.8, y: y, w: 0.5, h: 0.5,
    fontSize: 12, fontFace: "Calibri", color: "FFFFFF", bold: true, align: "center", valign: "middle", margin: 0
  });
  
  slide9.addText(t.text, {
    x: 1.5, y: y + 0.05, w: 8, h: 0.5,
    fontSize: 14, fontFace: "Calibri", color: "FFFFFF", valign: "middle"
  });
});

slide9.addShape(pres.shapes.RECTANGLE, { x: 2.5, y: 5.2, w: 5, h: 0.4, fill: { color: C.accent } });
slide9.addText("Thank You!", {
  x: 2.5, y: 5.2, w: 5, h: 0.4,
  fontSize: 18, fontFace: "Arial Black", color: "FFFFFF", bold: true, align: "center", valign: "middle", margin: 0
});

pres.writeFile({ fileName: "Software_Engineer_System_Thinker_EN.pptx" })
  .then(() => console.log("PPT created successfully!"))
  .catch(err => console.error(err));
