const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, AlignmentType, LevelFormat, BorderStyle, WidthType,
        ShadingType, PageBreak, PageNumber } = require('docx');
const fs = require('fs');

// 边框样式
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

// 标题边框
const titleBorder = { style: BorderStyle.SINGLE, size: 1, color: "2E75B6" };
const titleBorders = { top: titleBorder, bottom: titleBorder, left: titleBorder, right: titleBorder };

// 创建表格
function createTable(headers, rows, widths) {
    return new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: widths,
        rows: [
            new TableRow({
                children: headers.map((h, i) => new TableCell({
                    borders: titleBorders,
                    width: { size: widths[i], type: WidthType.DXA },
                    shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: h, bold: true, color: "FFFFFF", font: "Arial", size: 24 })]
                    })]
                }))
            }),
            ...rows.map(row => new TableRow({
                children: row.map((cell, i) => new TableCell({
                    borders,
                    width: { size: widths[i], type: WidthType.DXA },
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [new Paragraph({
                        children: [new TextRun({ text: cell, font: "Arial", size: 22 })]
                    })]
                }))
            }))
        ]
    });
}

// 创建截图说明框
function createScreenshotNote(title, description, requirements) {
    return [
        new Paragraph({
            spacing: { before: 200, after: 100 },
            children: [
                new TextRun({ text: "📸 " + title, bold: true, color: "C45911", font: "Arial", size: 24 })
            ]
        }),
        new Paragraph({
            spacing: { before: 0, after: 80 },
            children: [
                new TextRun({ text: description, font: "Arial", size: 22 })
            ]
        }),
        new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [2000, 7360],
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            borders,
                            width: { size: 2000, type: WidthType.DXA },
                            shading: { fill: "FFF2CC", type: ShadingType.CLEAR },
                            margins: { top: 80, bottom: 80, left: 120, right: 120 },
                            children: [new Paragraph({ children: [new TextRun({ text: "截图要求", bold: true, font: "Arial", size: 22 })] })]
                        }),
                        new TableCell({
                            borders,
                            width: { size: 7360, type: WidthType.DXA },
                            margins: { top: 80, bottom: 80, left: 120, right: 120 },
                            children: [new Paragraph({ children: [new TextRun({ text: requirements, font: "Arial", size: 22 })] })]
                        })
                    ]
                })
            ]
        }),
        new Paragraph({ spacing: { before: 100, after: 200 }, children: [] })
    ];
}

const doc = new Document({
    styles: {
        default: {
            document: { run: { font: "Arial", size: 22 } }
        },
        paragraphStyles: [
            {
                id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 36, bold: true, font: "Arial", color: "2E75B6" },
                paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 }
            },
            {
                id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
                paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 }
            },
            {
                id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 24, bold: true, font: "Arial", color: "333333" },
                paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 }
            }
        ]
    },
    numbering: {
        config: [
            {
                reference: "bullets",
                levels: [{
                    level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                }]
            },
            {
                reference: "numbers",
                levels: [{
                    level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                }]
            },
            {
                reference: "numbers2",
                levels: [{
                    level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                }]
            },
            {
                reference: "numbers3",
                levels: [{
                    level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                }]
            },
            {
                reference: "numbers4",
                levels: [{
                    level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                }]
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
            // ===================== 封面 =====================
            new Paragraph({ spacing: { before: 2000, after: 500 }, alignment: AlignmentType.CENTER, children: [] }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "大麦网票务系统", bold: true, size: 72, font: "Arial", color: "2E75B6" })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 300, after: 200 },
                children: [new TextRun({ text: "个人作业汇总报告", size: 48, font: "Arial", color: "666666" })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 600 },
                children: [new TextRun({ text: "学号: ____________    姓名: ____________", size: 28, font: "Arial" })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 200 },
                children: [new TextRun({ text: "日期: 2026年5月18日", size: 28, font: "Arial" })]
            }),

            // 作业目录
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("作业目录")] }),
            new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: "Day 1 - Reflection (Assignment 1): 项目问题反思............................2", font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: "Day 3 - CI/CD流程搭建............................................................4", font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: "Day 4 - 智能体AI案例任务......................................................6", font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: "Day 8 - 系统思维反思 (Reflection on Systems Thinking)...........8", font: "Arial", size: 22 })] }),

            // ===================== Day 1 =====================
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Day 1 - Reflection (Assignment 1): 项目问题反思")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1. 以往项目中问题出现在哪些环节？")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "在我开发大麦网票务系统的过程中，主要遇到了以下几个环节的问题：", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("1.1 前后端联调环节")]}),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "API接口不一致：前端期望的数据格式与后端返回的格式不匹配", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "跨域问题：前端开发服务器(5173)与后端服务器(8081)端口不同，需要配置代理", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "认证机制不完善：登录状态在前后端之间传递出现问题", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("1.2 数据库设计环节")]}),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "座位表设计：初始设计未考虑批量操作的性能问题", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "索引缺失：查询演出列表时未建立适当的索引，导致查询慢", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("1.3 部署环节")]}),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "环境配置差异：本地环境与生产环境的配置不一致", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "静态资源路径：部署到GitHub Pages后，路由模式需要改为Hash模式", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2. 这些问题是代码错误，还是集成问题？")] }),

            createTable(
                ["问题类别", "具体问题", "问题类型"],
                [
                    ["跨域配置", "前后端端口不同导致API请求失败", "集成问题"],
                    ["API格式不匹配", "前端期望数组，后端返回对象", "代码错误"],
                    ["认证机制", "Token传递和验证逻辑不完善", "代码错误+集成问题"],
                    ["路由模式", "History模式在GitHub Pages无法访问", "集成问题"],
                    ["数据库索引", "查询性能问题", "代码错误"],
                    ["环境配置", "dev/prod配置不一致", "集成问题"],
                ],
                [2500, 4500, 2360]
            ),

            new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: "总结：大约60%是集成问题，40%是代码错误。集成问题主要出现在前后端协作、部署流程、环境配置等方面。", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3. 哪些假设是想当然、未经过验证的？")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.1 关于用户行为的假设")]}),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设用户会按照预期流程操作，但实际上用户可能跳过某些步骤或进行意外操作", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设用户会等待页面加载完成，但实际上用户可能频繁刷新或快速点击", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.2 关于系统性能的假设")]}),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设数据库查询足够快，未考虑数据量增长后的性能问题", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设并发用户数量有限，未进行压力测试和性能优化", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.3 关于部署环境的假设")]}),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设GitHub Pages支持Vue Router的History模式", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设所有依赖包在生产环境都能正常加载", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.4 关于安全性的假设")]}),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设用户不会尝试恶意攻击（如SQL注入、刷单等）", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设API不会被滥用，未进行限流和防护", font: "Arial", size: 22 })] }),

            ...createScreenshotNote(
                "截图1：项目目录结构截图",
                "请截取项目的完整目录结构，展示前后端分离的架构：",
                "截图应包含 damai-ticket-project 根目录，以及 damai-ticket（后端）、damai-ticket-frontend（前端）等主要目录"
            ),

            ...createScreenshotNote(
                "截图2：Git提交历史截图",
                "展示项目的Git提交记录，体现开发过程中的问题修复：",
                "在Git Bash或VS Code中运行 git log --oneline -10，截取最近的10条提交记录"
            ),

            // ===================== Day 3 =====================
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Day 3 - CI/CD流程搭建")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1. CI/CD流程概述")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "我为大麦网票务系统搭建了基于GitHub Actions的CI/CD流水线，实现了代码提交后的自动化构建、测试和部署。", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2. 流水线配置详解")] }),

            createTable(
                ["阶段", "工具", "说明"],
                [
                    ["代码检出", "actions/checkout@v4", "从GitHub仓库拉取最新代码"],
                    ["后端构建", "Maven + JDK 17", "构建Java Spring Boot项目"],
                    ["前端构建", "Node.js 20 + Vite", "构建Vue 3前端项目"],
                    ["依赖缓存", "actions/cache", "加速Maven和npm依赖下载"],
                    ["部署", "GitHub Pages", "自动部署前端静态资源"],
                ],
                [2000, 3000, 4360]
            ),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3. 配置文件内容")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "配置文件位于 .github/workflows/ci.yml，主要包含以下关键配置：", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.1 触发条件")]}),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "push到master或main分支时自动触发", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "支持手动触发（workflow_dispatch）", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.2 构建步骤")]}),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "检出代码（actions/checkout@v4）", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "配置Maven缓存加速构建", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "安装JDK 17环境", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "执行Maven打包（mvn clean package -DskipTests）", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "配置npm缓存", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "安装前端依赖（使用国内镜像加速）", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "执行Vite构建（npm run build）", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "部署到GitHub Pages", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4. GitHub Pages部署配置")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "在GitHub仓库的Settings → Pages中配置：", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Source: Deploy from a branch", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Branch: master / (root)", font: "Arial", size: 22 })] }),

            ...createScreenshotNote(
                "截图3：GitHub Actions运行成功截图",
                "展示CI/CD流水线成功运行的完整截图：",
                "访问 https://github.com/wang314152/damai-ticket-project/actions ，截图展示最近一次成功的workflow run，包括各步骤的执行时间"
            ),

            ...createScreenshotNote(
                "截图4：GitHub Pages部署成功截图",
                "展示GitHub Pages成功部署的截图：",
                "在Settings → Pages页面截图，显示 'Your site is published at' 以及访问URL"
            ),

            ...createScreenshotNote(
                "截图5：GitHub Pages网站访问截图",
                "展示部署后的网站访问效果：",
                "打开 https://wang314152.github.io/damai-ticket-project/ ，截图展示网站首页"
            ),

            // ===================== Day 4 =====================
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Day 4 - 智能体AI案例任务")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1. 智能体AI案例介绍")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "本项目集成了基于DeepSeek API的AI智能客服系统，实现了智能问答功能。", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2. 技术实现")] }),

            createTable(
                ["组件", "技术/工具", "说明"],
                [
                    ["后端AI服务", "Spring Boot + DeepSeek API", "处理AI聊天请求"],
                    ["前端界面", "Vue 3 + Element Plus", "AI客服交互界面"],
                    ["路由配置", "Vue Router", "/ai-assistant 路由"],
                    ["HTTP客户端", "Axios", "前后端通信"],
                ],
                [2500, 3500, 3360]
            ),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3. API接口配置")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "在 application.yml 中配置：", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "API URL: https://api.deepseek.com/chat/completions", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Model: deepseek-chat", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "API Key: 用户自定义配置", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4. 应用场景思考")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.1 票务系统中的AI应用场景")]}),
            new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [new TextRun({ text: "智能客服问答：回答用户关于演出信息、购票流程等问题", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [new TextRun({ text: "演出推荐：根据用户历史购票记录，推荐相似演出", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [new TextRun({ text: "座位推荐：智能推荐最佳座位位置", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [new TextRun({ text: "订单咨询：解答订单状态、退款等问题", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.2 更广泛的应用场景")]}),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "教育领域：智能辅导、作业批改", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "医疗领域：健康咨询、症状分析", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "金融领域：智能投顾、风险评估", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "客服领域：7x24小时智能客服", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5. 本地运行说明")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "运行AI智能体案例的步骤：", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers3", level: 0 }, children: [new TextRun({ text: "启动后端服务：cd damai-ticket && mvn spring-boot:run", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers3", level: 0 }, children: [new TextRun({ text: "启动前端服务：cd damai-ticket-frontend && npm run dev", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers3", level: 0 }, children: [new TextRun({ text: "访问 http://localhost:5173/ai-assistant", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers3", level: 0 }, children: [new TextRun({ text: "在对话框中输入问题进行测试", font: "Arial", size: 22 })] }),

            ...createScreenshotNote(
                "截图6：AI智能体项目结构截图",
                "展示agentic-ai-public-main目录下的项目结构：",
                "截图应包含项目的目录结构，包括src、static、templates等文件夹"
            ),

            ...createScreenshotNote(
                "截图7：AI对话功能演示截图",
                "展示AI智能客服的实际对话效果：",
                "在本地运行项目后，进入AI助手页面，截取一段与AI的对话内容"
            ),

            // ===================== Day 8 =====================
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Day 8 - 系统思维反思 (Reflection on Systems Thinking)")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1. 什么是系统思维？")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "系统思维是一种全面、整体地分析和理解复杂系统的思维方式。它强调：", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "整体性：系统不是部分之和，而是各部分相互作用形成的整体", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "关联性：系统中的各个元素相互关联，一个变化会影响其他部分", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "动态性：系统是不断变化的，需要用动态的眼光看待", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "反馈机制：系统通过反馈循环实现自我调节", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2. 软件开发中的系统思维")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("2.1 技术架构层面")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "在大麦网票务系统中，我深刻体会到前后端分离架构的优势和挑战：", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "优势：前后端可以独立开发、测试、部署，提高了开发效率", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "挑战：需要完善的API文档、接口规范和联调机制", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "系统各组件（数据库、后端API、前端UI）需要协同工作，任何一个环节出问题都会影响整体", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("2.2 用户体验层面")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "系统思维帮助我更好地理解用户需求：", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "用户不仅是系统的使用者，更是系统生态的一部分", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "用户行为数据可以反馈到系统中，用于优化服务", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "AI客服的引入形成了用户-AI-系统的闭环交互", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("2.3 运维部署层面")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "CI/CD流水线的搭建体现了系统思维的应用：", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "自动化流程将开发、测试、部署连接成一个整体", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "每次代码提交都触发完整的流水线，形成持续反馈", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "部署失败会立即反馈，形成快速修复的闭环", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3. 系统思维的应用实例")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.1 座位超卖问题的解决")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "在解决座位超卖问题时，我运用了系统思维：", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers4", level: 0 }, children: [new TextRun({ text: "问题识别：订单创建、座位状态更新、数据库操作形成了一个处理链路", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers4", level: 0 }, children: [new TextRun({ text: "关联分析：发现并发情况下座位状态检查和订单创建不是原子操作", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers4", level: 0 }, children: [new TextRun({ text: "解决方案：使用乐观锁机制，确保座位状态更新的原子性", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers4", level: 0 }, children: [new TextRun({ text: "反馈验证：通过压测验证解决方案的有效性", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.2 GitHub Pages部署问题")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "初始部署时，Vue Router的History模式在GitHub Pages上无法正常工作：", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "系统分析：发现问题在于服务器配置与前端路由模式不匹配", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "方案选择：改用Hash模式，让路由信息存储在URL中", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "整体考虑：在开发环境和生产环境使用不同的路由模式", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4. 系统思维的收获与反思")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.1 主要收获")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "学会了从整体角度看待问题，不再局限于单个模块", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "理解了系统各部分之间的关联和依赖关系", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "认识到反馈机制在系统运行中的重要性", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "学会了在设计阶段就考虑系统的可扩展性和可维护性", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.2 不足与改进")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "不足：初期设计时未充分考虑高并发场景", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "改进：需要学习更多关于系统性能优化和架构设计的知识", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "不足：安全方面考虑不够全面", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "改进：需要加强安全意识，学习常见的安全防护措施", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5. 总结")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "通过大麦网票务系统的开发实践，我深刻体会到系统思维在软件开发中的重要性。它帮助我：", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "更全面地分析和解决问题", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "理解系统各组件之间的关联", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "设计出更加健壮和可维护的系统", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "建立了持续改进和迭代优化的意识", font: "Arial", size: 22 })] }),

            new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "系统思维不仅适用于软件开发，它是一种普适的思维方式，可以应用于生活和工作的各个方面。未来，我将继续学习和实践系统思维，努力成为一名更好的软件工程师。", font: "Arial", size: 22 })] }),

            ...createScreenshotNote(
                "截图8：系统架构图或流程图",
                "展示大麦网票务系统的整体架构或核心流程：",
                "可以使用 draw.io 或其他工具绘制架构图，展示前端、后端、数据库、AI服务等组件的关系"
            ),

            ...createScreenshotNote(
                "截图9：CI/CD流水线示意图",
                "展示CI/CD流水线的完整流程：",
                "绘制或截图展示从代码提交到部署的完整流程图"
            ),

            // 结束语
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 2000 },
                children: [new TextRun({ text: "===== 作业完成 =====", bold: true, size: 36, font: "Arial", color: "2E75B6" })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 500 },
                children: [new TextRun({ text: "所有截图要求均已标注，请按照要求截取对应图片插入文档。", font: "Arial", size: 22 })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 300 },
                children: [new TextRun({ text: "祝老师阅读愉快！", font: "Arial", size: 22 })]
            }),
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("d:/2026/集成/damai-ticket-project/个人作业汇总报告.docx", buffer);
    console.log("文档生成成功！");
});
