const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, PageNumber, HeadingLevel,
        BorderStyle, WidthType, ShadingType, LevelFormat } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

function cell(text, width, options = {}) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: options.shading ? { fill: options.shading, type: ShadingType.CLEAR } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: options.bold, size: 20, font: "Arial" })],
      alignment: options.align || AlignmentType.LEFT,
    })],
  });
}

function headerCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: "2E5090", type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, size: 20, font: "Arial", color: "FFFFFF" })],
      alignment: AlignmentType.CENTER,
    })],
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E5090" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          children: [
            new TextRun({ text: "Day 5 Assignment  |  Planning for Integration Under Uncertainty", size: 18, color: "999999", font: "Arial" }),
          ],
          alignment: AlignmentType.RIGHT,
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          children: [
            new TextRun({ text: "Page ", size: 18, color: "999999", font: "Arial" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "999999", font: "Arial" }),
          ],
          alignment: AlignmentType.CENTER,
        })]
      })
    },
    children: [
      // ============ Title ============
      new Paragraph({
        children: [new TextRun({ text: "Planning for Integration Under Uncertainty", size: 32, bold: true, font: "Arial", color: "2E5090" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Damai Ticket System", size: 24, italics: true, color: "666666", font: "Arial" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      }),

      // ============ 1. Three Integration Activities ============
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("1. Three Integration Activities")],
      }),
      new Paragraph({
        children: [new TextRun("The following three integration activities are identified for the Damai Ticket System:")],
        spacing: { after: 100 },
      }),

      // Activity 1
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("1.1 Frontend-Backend API Integration")],
      }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 7020],
        rows: [
          new TableRow({ children: [cell("Activity Name", 2340, { bold: true, shading: "E8EEF7" }), cell("RESTful API Integration between Vue 3 Frontend and Spring Boot Backend", 7020)] }),
          new TableRow({ children: [cell("Environment", 2340, { bold: true, shading: "E8EEF7" }), cell("Virtual Environment (localhost development environment)", 7020)] }),
          new TableRow({ children: [cell("TRL", 2340, { bold: true, shading: "E8EEF7" }), cell("TRL 7 - System prototype demonstrated in relevant environment", 7020)] }),
          new TableRow({ children: [cell("IRL", 2340, { bold: true, shading: "E8EEF7" }), cell("IRL 3 - Interface specifications defined, end-to-end data consistency needs verification", 7020)] }),
          new TableRow({ children: [cell("Uncertainties", 2340, { bold: true, shading: "E8EEF7" }), cell("API response format mismatch with frontend expectations; CORS configuration issues; Concurrent seat status synchronization; JWT authentication mechanism implementation", 7020)] }),
        ],
      }),
      new Paragraph({ spacing: { after: 200 }, children: [] }),

      // Activity 2
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("1.2 AI Chatbot-Business System Integration")],
      }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 7020],
        rows: [
          new TableRow({ children: [cell("Activity Name", 2340, { bold: true, shading: "E8EEF7" }), cell("DeepSeek API Integration with Ticket Business Logic", 7020)] }),
          new TableRow({ children: [cell("Environment", 2340, { bold: true, shading: "E8EEF7" }), cell("Real Environment - DeepSeek Open Platform API", 7020)] }),
          new TableRow({ children: [cell("TRL", 2340, { bold: true, shading: "E8EEF7" }), cell("TRL 6 - Technology validated in relevant environment", 7020)] }),
          new TableRow({ children: [cell("IRL", 2340, { bold: true, shading: "E8EEF7" }), cell("IRL 2 - Concept-level integration, external service dependency management required", 7020)] }),
          new TableRow({ children: [cell("Uncertainties", 2340, { bold: true, shading: "E8EEF7" }), cell("API call cost and rate limits (token-based billing); Network latency affecting real-time chat experience; Prompt engineering effectiveness instability; Service unavailability fallback strategy", 7020)] }),
        ],
      }),
      new Paragraph({ spacing: { after: 200 }, children: [] }),

      // Activity 3
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("1.3 Payment Module-Order Status Synchronization")],
      }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 7020],
        rows: [
          new TableRow({ children: [cell("Activity Name", 2340, { bold: true, shading: "E8EEF7" }), cell("Simulated Payment Flow and Order State Machine Management", 7020)] }),
          new TableRow({ children: [cell("Environment", 2340, { bold: true, shading: "E8EEF7" }), cell("Virtual Environment - Simulated payment (no real payment gateway)", 7020)] }),
          new TableRow({ children: [cell("TRL", 2340, { bold: true, shading: "E8EEF7" }), cell("TRL 5 - Technology validated in relevant environment", 7020)] }),
          new TableRow({ children: [cell("IRL", 2340, { bold: true, shading: "E8EEF7" }), cell("IRL 4 - Interfaces defined and tested, exception rollback handling required", 7020)] }),
          new TableRow({ children: [cell("Uncertainties", 2340, { bold: true, shading: "E8EEF7" }), cell("Order status rollback after payment failure; Concurrent payment causing seat overselling; Network timeout causing order status inconsistency; Order timeout auto-cancellation mechanism", 7020)] }),
        ],
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      // ============ 2. PERT-Style Plan ============
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("2. Simple PERT-Style Plan")],
      }),
      new Paragraph({
        children: [new TextRun("The following table shows the three-point estimation for each integration activity:")],
        spacing: { after: 100 },
      }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2000, 1000, 1000, 1000, 1360, 1000, 1000, 1000],
        rows: [
          new TableRow({
            children: [
              headerCell("Activity", 2000),
              headerCell("Optimistic (O)", 1000),
              headerCell("Most Likely (M)", 1000),
              headerCell("Pessimistic (P)", 1000),
              headerCell("Expected E", 1360),
              headerCell("Variance", 1000),
              headerCell("Std Dev", 1000),
              headerCell("Path", 1000),
            ]
          }),
          new TableRow({
            children: [
              cell("A: API Integration", 2000),
              cell("3 days", 1000, { align: AlignmentType.CENTER }),
              cell("5 days", 1000, { align: AlignmentType.CENTER }),
              cell("8 days", 1000, { align: AlignmentType.CENTER }),
              cell("5.2 days", 1360, { align: AlignmentType.CENTER, bold: true }),
              cell("0.69", 1000, { align: AlignmentType.CENTER }),
              cell("0.83", 1000, { align: AlignmentType.CENTER }),
              cell("Critical", 1000, { align: AlignmentType.CENTER }),
            ]
          }),
          new TableRow({
            children: [
              cell("B: AI Integration", 2000),
              cell("2 days", 1000, { align: AlignmentType.CENTER }),
              cell("4 days", 1000, { align: AlignmentType.CENTER }),
              cell("7 days", 1000, { align: AlignmentType.CENTER }),
              cell("4.2 days", 1360, { align: AlignmentType.CENTER, bold: true }),
              cell("0.69", 1000, { align: AlignmentType.CENTER }),
              cell("0.83", 1000, { align: AlignmentType.CENTER }),
              cell("Critical", 1000, { align: AlignmentType.CENTER }),
            ]
          }),
          new TableRow({
            children: [
              cell("C: Payment Integration", 2000),
              cell("2 days", 1000, { align: AlignmentType.CENTER }),
              cell("3 days", 1000, { align: AlignmentType.CENTER }),
              cell("6 days", 1000, { align: AlignmentType.CENTER }),
              cell("3.3 days", 1360, { align: AlignmentType.CENTER, bold: true }),
              cell("0.44", 1000, { align: AlignmentType.CENTER }),
              cell("0.67", 1000, { align: AlignmentType.CENTER }),
              cell("Critical", 1000, { align: AlignmentType.CENTER }),
            ]
          }),
        ],
      }),
      new Paragraph({ spacing: { after: 150 }, children: [] }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.1 Critical Path Analysis")],
      }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3120, 6240],
        rows: [
          new TableRow({ children: [cell("Critical Path", 3120, { bold: true, shading: "E8EEF7" }), cell("A (API) \u2192 B (AI) \u2192 C (Payment)", 6240, { bold: true })] }),
          new TableRow({ children: [cell("Total Expected Duration", 3120, { bold: true, shading: "E8EEF7" }), cell("E = 5.2 + 4.2 + 3.3 = 12.7 days", 6240)] }),
          new TableRow({ children: [cell("Total Variance", 3120, { bold: true, shading: "E8EEF7" }), cell("\u03c3\u00b2 = 0.69 + 0.69 + 0.44 = 1.82", 6240)] }),
          new TableRow({ children: [cell("Total Standard Deviation", 3120, { bold: true, shading: "E8EEF7" }), cell("\u03c3 = \u221a1.82 \u2248 1.35 days", 6240)] }),
          new TableRow({ children: [cell("95% Confidence Interval", 3120, { bold: true, shading: "E8EEF7" }), cell("12.7 \u00b1 2\u00d71.35 = [10.0 days, 15.4 days]", 6240, { bold: true })] }),
        ],
      }),
      new Paragraph({ spacing: { after: 150 }, children: [] }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("2.2 PERT Network Diagram")],
      }),
      new Paragraph({
        children: [new TextRun("Network: Start \u2192 A (5.2d) \u2192 B (4.2d) \u2192 C (3.3d) \u2192 End")],
        spacing: { after: 50 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Milestone Timeline:", bold: true })],
        spacing: { after: 50 },
      }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 2340, 2340, 2340],
        rows: [
          new TableRow({
            children: [
              headerCell("M1: API Complete", 2340),
              headerCell("M2: AI Online", 2340),
              headerCell("M3: Payment Ready", 2340),
              headerCell("Project Complete", 2340),
            ]
          }),
          new TableRow({
            children: [
              cell("Day 5.2", 2340, { align: AlignmentType.CENTER }),
              cell("Day 9.4", 2340, { align: AlignmentType.CENTER }),
              cell("Day 12.7", 2340, { align: AlignmentType.CENTER }),
              cell("Day 12.7", 2340, { align: AlignmentType.CENTER }),
            ]
          }),
        ],
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      // ============ 3. Testing Generates Learning ============
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("3. How Testing Generates Learning")],
      }),
      new Paragraph({
        children: [new TextRun("Testing is not merely a validation mechanism but a core mechanism for acquiring knowledge and improving design. The following learning loop demonstrates how testing generates learning:")],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Test Execution \u2192 Observe Results \u2192 Analyze Root Cause \u2192 Adjust Design \u2192 Verify Improvement \u2192 Document Lessons", bold: true, color: "2E5090" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 150 },
      }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1500, 2200, 2600, 3060],
        rows: [
          new TableRow({
            children: [
              headerCell("Test Type", 1500),
              headerCell("What We Learn", 2200),
              headerCell("Problem Discovered", 2600),
              headerCell("Design Improvement", 3060),
            ]
          }),
          new TableRow({
            children: [
              cell("Unit Test", 1500, { align: AlignmentType.CENTER }),
              cell("API interface contracts", 2200),
              cell("Missing parameter validation, inconsistent date formats", 2600),
              cell("Add frontend input validation, unify DateFormat", 3060),
            ]
          }),
          new TableRow({
            children: [
              cell("Integration Test", 1500, { align: AlignmentType.CENTER }),
              cell("Frontend-backend data flow", 2200),
              cell("JSON serialization loses decimal precision", 2600),
              cell("Use BigDecimal instead of Double", 3060),
            ]
          }),
          new TableRow({
            children: [
              cell("Concurrency Test", 1500, { align: AlignmentType.CENTER }),
              cell("Seat locking mechanism", 2200),
              cell("Race condition causes seat overselling", 2600),
              cell("Introduce optimistic locking (UPDATE WHERE status=0)", 3060),
            ]
          }),
          new TableRow({
            children: [
              cell("User Test", 1500, { align: AlignmentType.CENTER }),
              cell("AI response quality", 2200),
              cell("AI cannot answer specific show information", 2600),
              cell("Enhance System Prompt with business context injection", 3060),
            ]
          }),
          new TableRow({
            children: [
              cell("Exception Test", 1500, { align: AlignmentType.CENTER }),
              cell("Fault tolerance and degradation", 2200),
              cell("AI service timeout causes page freeze", 2600),
              cell("Add timeout configuration, fallback to preset FAQ", 3060),
            ]
          }),
        ],
      }),
      new Paragraph({ spacing: { after: 200 }, children: [] }),
      new Paragraph({
        children: [new TextRun({ text: "Key Insight: ", bold: true }), new TextRun("Each test failure is an opportunity to learn about system behavior under uncertainty. The knowledge gained from testing directly feeds back into improving the integration plan and reducing future uncertainties.")],
        spacing: { after: 300 },
      }),

      // ============ 4. Constraints ============
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("4. Key Constraints")],
      }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2000, 7360],
        rows: [
          new TableRow({ children: [headerCell("Constraint Type", 2000), headerCell("Description", 7360)] }),
          new TableRow({ children: [cell("Time", 2000, { bold: true }), cell("Course demonstration deadline: Day 15, core ticket purchase flow must be completed before then", 7360)] }),
          new TableRow({ children: [cell("Cost", 2000, { bold: true }), cell("DeepSeek API is token-based billing, AI conversation length must be controlled (<500 tokens per request)", 7360)] }),
          new TableRow({ children: [cell("Technical", 2000, { bold: true }), cell("Team: 2 members familiar with Vue/frontend, 1 member unfamiliar with Spring Boot, backend development risk is higher", 7360)] }),
          new TableRow({ children: [cell("Environment", 2000, { bold: true }), cell("Demonstration environment is local deployment, cannot integrate with real payment channels (Alipay/WeChat)", 7360)] }),
        ],
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      // ============ 5. Summary ============
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("5. Summary")],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Uncertainty Management: ", bold: true }), new TextRun("Good integration planning manages uncertainty instead of pretending it does not exist. TRL/IRL quantifies maturity, PERT quantifies schedule risk.")],
        spacing: { after: 60 },
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Testing as Learning: ", bold: true }), new TextRun("Testing is not just validation but a mechanism for acquiring system knowledge and reducing uncertainty.")],
        spacing: { after: 60 },
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Realistic Planning: ", bold: true }), new TextRun("Acknowledging constraints and uncertainties leads to more achievable integration plans.")],
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "\"Plans are worthless, but planning is everything.\" \u2014 Dwight D. Eisenhower", italics: true, color: "666666" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("D:\\2026\\集成\\damai-ticket-project\\Day5-不确定性下的集成规划.docx", buffer);
  console.log("Document generated successfully!");
});
