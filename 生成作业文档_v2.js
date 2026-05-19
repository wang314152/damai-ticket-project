const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, AlignmentType, LevelFormat, BorderStyle, WidthType,
        ShadingType, PageBreak } = require('docx');
const fs = require('fs');

// 边框样式
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

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

// 创建截图说明
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

// 创建引用块
function createQuote(text) {
    return new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [200, 9160],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        width: { size: 200, type: WidthType.DXA },
                        shading: { fill: "E7F3FF", type: ShadingType.CLEAR },
                        margins: { top: 100, bottom: 100, left: 100, right: 100 },
                        children: [new Paragraph({ children: [] })]
                    }),
                    new TableCell({
                        borders,
                        width: { size: 9160, type: WidthType.DXA },
                        shading: { fill: "F5F9FF", type: ShadingType.CLEAR },
                        margins: { top: 100, bottom: 100, left: 120, right: 120 },
                        children: [new Paragraph({
                            children: [new TextRun({ text: text, font: "Arial", size: 22, italics: true, color: "555555" })]
                        })]
                    })
                ]
            })
        ]
    });
}

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 22 } } },
        paragraphStyles: [
            { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: 36, bold: true, font: "Arial", color: "2E75B6" },
              paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
            { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
              paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
            { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: 24, bold: true, font: "Arial", color: "333333" },
              paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } }
        ]
    },
    numbering: {
        config: [
            { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
            { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
            { reference: "numbers2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
            { reference: "numbers3", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
            { reference: "numbers4", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
            { reference: "numbers5", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
            { reference: "numbers6", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
            { reference: "numbers7", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
        ]
    },
    sections: [{
        properties: {
            page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
        },
        children: [
            // 封面
            new Paragraph({ spacing: { before: 2000, after: 500 }, alignment: AlignmentType.CENTER, children: [] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "大麦网票务系统", bold: true, size: 72, font: "Arial", color: "2E75B6" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 200 }, children: [new TextRun({ text: "个人作业汇总报告", size: 48, font: "Arial", color: "666666" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600 }, children: [new TextRun({ text: "学号: ____________    姓名: ____________", size: 28, font: "Arial" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: "日期: 2026年5月18日", size: 28, font: "Arial" })] }),

            // 目录
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("作业目录")] }),
            new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: "Day 1 - Reflection: 项目问题反思............................................................2", font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: "Day 3 - CI/CD流程搭建........................................................................4", font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: "Day 4 - 智能体AI案例任务....................................................................6", font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: "Day 8 - 系统思维反思............................................................................8", font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: "项目总结与展望....................................................................................12", font: "Arial", size: 22 })] }),

            // ===================== Day 1 =====================
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Day 1 - Reflection (Assignment 1): 项目问题反思")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1. 以往项目中问题出现在哪些环节？")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "在我开发大麦网票务系统的过程中，遇到了以下主要问题环节：", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("1.1 前后端联调环节（最耗时的问题）")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "这是开发过程中耗费时间最多的环节，主要问题包括：", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("问题1：跨域请求失败")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "现象：前端axios请求后端API时报错 \"Access-Control-Allow-Origin\"", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "原因：前端开发服务器localhost:5173，后端localhost:8081，端口不同", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "解决：在vite.config.js配置proxy代理，将/api请求转发到后端", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("问题2：数据格式不一致")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "现象：前端期望返回 {code: 200, data: [...]}, 后端直接返回数组", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "原因：后端Controller未统一返回格式", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "解决：定义统一响应类Result<T>，包含code、msg、data字段", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("问题3：字段命名差异")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "现象：后端返回userName，前端接收显示undefined", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "原因：后端用驼峰命名，前端期望下划线命名", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "解决：application.yml配置开启驼峰转下划线", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("1.2 数据库设计环节（影响性能）")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "座位表查询慢：未建立索引，1万条数据全表扫描导致3-5秒延迟", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "订单表冗余：冗余存储用户名，历史订单无法显示最新信息", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "时区问题：数据库时间比实际少8小时，需配置serverTimezone=Asia/Shanghai", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("1.3 前端组件开发环节")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Element Plus组件样式不生效：需正确引入theme-chalk样式文件", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "路由跳转后页面不刷新：Vue组件复用导致，需给:key绑定路由参数", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "选座页面状态不同步：多人同时操作时需添加轮询或WebSocket", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2. 这些问题是代码错误，还是集成问题？")] }),

            createTable(
                ["问题类型", "具体问题", "比例", "说明"],
                [
                    ["集成问题", "跨域配置、CORS设置", "约40%", "与环境配置、部署流程相关"],
                    ["代码错误", "API格式不统一、索引缺失", "约30%", "与设计、编码规范相关"],
                    ["混合问题", "认证机制、路由模式", "约30%", "需要代码和配置同时调整"],
                ],
                [2000, 3000, 1500, 2860]
            ),

            new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: "经验总结：", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "建议先解决集成问题，确保开发环境与生产环境一致", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "代码问题可以通过Code Review、单元测试提前发现", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "集成问题需要完整测试流程来验证", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3. 哪些假设是想当然、未经过验证的？")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.1 关于用户行为的假设")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设1：用户会按正常流程购票（浏览→选座→支付）", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 100 }, children: [new TextRun({ text: "实际情况：用户可能直接搜索、频繁返回操作，需要考虑操作路径多样性", font: "Arial", size: 22, italics: true, color: "666666" })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设2：用户会等待页面加载（接口<1秒响应）", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 100 }, children: [new TextRun({ text: "实际情况：网络波动时可能等待3-5秒，需要添加loading动画和超时处理", font: "Arial", size: 22, italics: true, color: "666666" })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设3：用户不会重复提交", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 100 }, children: [new TextRun({ text: "实际情况：用户可能双击或网络重试导致重复下单，需要防重复提交机制", font: "Arial", size: 22, italics: true, color: "666666" })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.2 关于系统性能的假设")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设1：单机足够应对用户量", font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 100 }, children: [new TextRun({ text: "实际情况：压测时100并发就出现响应慢，需要评估业务增长和水平扩展", font: "Arial", size: 22, italics: true, color: "666666" })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设2：数据库查询足够快", font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 100 }, children: [new TextRun({ text: "实际情况：关联查询复杂时仍有性能问题，需要优化SQL和添加索引", font: "Arial", size: 22, italics: true, color: "666666" })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设3：第三方API很稳定（DeepSeek API）", font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 100 }, children: [new TextRun({ text: "实际情况：高并发时API可能超时，需要添加降级策略和缓存机制", font: "Arial", size: 22, italics: true, color: "666666" })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.3 关于部署环境的假设")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设1：本地能跑，生产就能跑", font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 100 }, children: [new TextRun({ text: "实际情况：Windows开发，Linux部署，路径分隔符、文件权限问题频发", font: "Arial", size: 22, italics: true, color: "666666" })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "假设2：GitHub Pages能托管SPA", font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 100 }, children: [new TextRun({ text: "实际情况：History模式需要服务器配置，GitHub Pages只支持静态文件，需用Hash模式", font: "Arial", size: 22, italics: true, color: "666666" })] }),

            ...createScreenshotNote("截图1：项目目录结构截图", "请截取项目的完整目录结构，展示前后端分离的架构：", "截图应包含damai-ticket-project根目录，以及damai-ticket（后端）、damai-ticket-frontend（前端）等主要目录"),
            ...createScreenshotNote("截图2：Git提交历史截图", "展示项目的Git提交记录，体现开发过程中的问题修复：", "在Git Bash中运行git log --oneline -10，截取最近的10条提交记录"),

            // ===================== Day 3 =====================
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Day 3 - CI/CD流程搭建")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1. 为什么选择GitHub Actions？")] }),

            createTable(
                ["选择理由", "说明"],
                [
                    ["深度集成", "与GitHub仓库深度集成，无需额外配置服务器"],
                    ["免费额度", "个人项目足够使用（2000分钟/月）"],
                    ["配置简单", "使用YAML语法，语法简洁易懂"],
                    ["社区丰富", "大量现成的Actions可用，如checkout、setup-java等"],
                    ["并行执行", "支持多任务并行，加快构建速度"],
                ],
                [2500, 6860]
            ),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2. CI/CD流程概述")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "我为大麦网票务系统搭建了基于GitHub Actions的CI/CD流水线，实现了代码提交后的自动化构建、测试和部署。整个流程如下：", font: "Arial", size: 22 })] }),

            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "代码提交 → GitHub接收 → 触发流水线 → 后端构建 → 前端构建 → 部署到GitHub Pages", bold: true, font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3. 配置文件详解")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "配置文件位于.github/workflows/ci.yml，以下是核心配置逐行解析：", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.1 触发条件配置")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "push到master或main分支时自动触发", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "pull_request时也触发，用于Code Review前的检查", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "workflow_dispatch支持手动触发", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.2 构建步骤详解")] }),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Checkout code：使用actions/checkout@v4拉取代码", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Cache Maven packages：缓存Maven依赖加速构建（key包含pom.xml的hash）", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Set up JDK 17：安装Java 17运行环境（distribution使用temurin发行版）", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Build Backend：cd damai-ticket && mvn clean package -DskipTests", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Cache npm packages：缓存npm依赖加速构建", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Set up Node.js：安装Node.js 20 LTS版本", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Build Frontend：npm install（使用npmmirror镜像加速）+ npm run build", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Deploy to GitHub Pages：上传dist目录，使用actions/deploy-pages@v4部署", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4. 遇到的问题及解决方案")] }),

            createTable(
                ["问题", "原因", "解决方案"],
                [
                    ["npm install超时", "GitHub服务器访问npm慢", "使用npmmirror国内镜像"],
                    ["Maven下载慢", "中央仓库在国外", "使用actions/cache缓存依赖"],
                    ["部署后404", "History模式路由问题", "改用Hash模式路由"],
                    ["页面空白", "静态资源路径错误", "检查base配置和相对路径"],
                ],
                [2500, 3000, 3860]
            ),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5. GitHub Pages部署配置")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Source: Deploy from a branch（从分支部署）", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Branch: master / (root)", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Folder: / (root)", font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "部署成功后显示：Your site is published at https://wang314152.github.io/damai-ticket-project/", font: "Arial", size: 22, italics: true, color: "666666" })] }),

            ...createScreenshotNote("截图3：GitHub Actions运行成功截图", "展示CI/CD流水线成功运行的完整截图：", "访问https://github.com/wang314152/damai-ticket-project/actions，截图展示最近一次成功的workflow run，包括各步骤的执行时间"),
            ...createScreenshotNote("截图4：GitHub Pages设置截图", "展示GitHub Pages的部署配置：", "在Settings → Pages页面截图，显示配置信息和发布URL"),
            ...createScreenshotNote("截图5：GitHub Pages网站访问截图", "展示部署后的网站访问效果：", "打开https://wang314152.github.io/damai-ticket-project/，截图展示网站首页"),

            // ===================== Day 4 =====================
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Day 4 - 智能体AI案例任务")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1. 智能体AI案例介绍")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "本项目集成了基于DeepSeek API的AI智能客服系统，实现了智能问答功能。用户可以通过对话方式获取演出信息、购票帮助等服务。", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2. 技术实现架构")] }),

            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "整体架构流程：", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 80 }, children: [new TextRun({ text: "用户提问 → 前端Vue组件 → axios发送请求 → 后端Controller → DeepSeek API → 返回回答 → 前端渲染", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("2.1 前端实现（Vue 3）")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "使用Composition API编写聊天逻辑", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Element Plus对话框组件实现聊天界面", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "axios发送POST请求到/api/ai/chat", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "WebSocket或轮询实现实时对话效果", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("2.2 后端实现（Spring Boot）")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "AuthController处理AI聊天请求", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "使用HttpClient调用DeepSeek API", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "构建系统提示词：你是一个票务系统的智能客服", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "异常处理：API不可用时返回友好提示", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3. API接口配置")] }),

            createTable(
                ["配置项", "值", "说明"],
                [
                    ["API URL", "https://api.deepseek.com/chat/completions", "DeepSeek API端点"],
                    ["Model", "deepseek-chat", "使用的模型名称"],
                    ["Max Tokens", "1000", "最大回复长度"],
                    ["Temperature", "0.7", "创造性参数"],
                ],
                [2500, 4000, 2860]
            ),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4. 应用场景详细分析")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.1 票务系统中的AI应用场景")] }),
            new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [new TextRun({ text: "智能客服问答：", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 80 }, children: [new TextRun({ text: "用户：\"周末有什么演唱会推荐？\" AI：根据您的位置和偏好，推荐以下演唱会...", font: "Arial", size: 22, italics: true, color: "666666" })] }),
            new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [new TextRun({ text: "购票引导：", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 80 }, children: [new TextRun({ text: "用户：\"怎么买票？\" AI：购票流程：1.登录账号 2.选择演出 3.选座 4.支付", font: "Arial", size: 22, italics: true, color: "666666" })] }),
            new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [new TextRun({ text: "订单咨询：", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 80 }, children: [new TextRun({ text: "用户：\"我的订单什么时候发货？\" AI：您的订单已支付成功，电子票将在演出前24小时发送", font: "Arial", size: 22, italics: true, color: "666666" })] }),
            new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [new TextRun({ text: "退票政策：", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 100 }, children: [new TextRun({ text: "用户：\"能退票吗？\" AI：演出前72小时内不支持退票，详情请查看退票政策页面", font: "Arial", size: 22, italics: true, color: "666666" })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.2 更广泛的应用场景")] }),

            createTable(
                ["领域", "应用场景", "价值"],
                [
                    ["教育", "智能辅导、作业批改、24小时答疑", "减轻教师负担，实现个性化学习"],
                    ["医疗", "健康咨询、症状预判、用药提醒", "缓解医疗资源紧张，提供初步筛查"],
                    ["金融", "智能投顾、账单分析、反欺诈检测", "提升服务效率，降低风险"],
                    ["电商", "智能客服、商品推荐、售后处理", "提升转化率，改善用户体验"],
                    ["企业内部", "员工FAQ、IT支持、HR政策咨询", "提高内部效率，减少重复问答"],
                ],
                [1500, 4000, 3860]
            ),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5. 本地运行说明")] }),
            new Paragraph({ numbering: { reference: "numbers3", level: 0 }, children: [new TextRun({ text: "启动后端：cd damai-ticket && mvn spring-boot:run（默认端口8081）", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers3", level: 0 }, children: [new TextRun({ text: "启动前端：cd damai-ticket-frontend && npm run dev（默认端口5173）", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers3", level: 0 }, children: [new TextRun({ text: "访问AI助手：http://localhost:5173/ai-assistant", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers3", level: 0 }, children: [new TextRun({ text: "登录后即可与AI客服对话测试", font: "Arial", size: 22 })] }),

            ...createScreenshotNote("截图6：AI智能体项目结构截图", "展示agentic-ai-public-main目录下的项目结构：", "截图应包含项目的目录结构，包括src、static、templates等文件夹"),
            ...createScreenshotNote("截图7：AI对话功能演示截图", "展示AI智能客服的实际对话效果：", "本地启动项目后，进入AI助手页面，截取一段与AI的对话内容"),

            // ===================== Day 8 =====================
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Day 8 - 系统思维反思 (Reflection on Systems Thinking)")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1. 什么是系统思维？")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "系统思维是一种全面、整体地分析和理解复杂系统的思维方式。与传统的问题分析方法不同，系统思维强调：", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("1.1 整体性原则")] }),
            new Paragraph({ spacing: { before: 50, after: 80 }, children: [new TextRun({ text: "\"系统不是部分之和，而是各部分相互作用形成的整体。\" 系统具有其组成部分所不具备的功能和特性。", font: "Arial", size: 22, italics: true, color: "666666" })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("1.2 关联性原则")] }),
            new Paragraph({ spacing: { before: 50, after: 80 }, children: [new TextRun({ text: "系统中的各个元素相互关联，一个变化会影响其他部分，形成复杂的因果网络。", font: "Arial", size: 22, italics: true, color: "666666" })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("1.3 动态性原则")] }),
            new Paragraph({ spacing: { before: 50, after: 80 }, children: [new TextRun({ text: "系统是不断变化的，需要用动态的眼光看待。现在有效的解决方案，未来可能不再适用。", font: "Arial", size: 22, italics: true, color: "666666" })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("1.4 反馈原则")] }),
            new Paragraph({ spacing: { before: 50, after: 100 }, children: [new TextRun({ text: "系统通过反馈循环实现自我调节，正反馈会放大变化，负反馈会抑制变化。", font: "Arial", size: 22, italics: true, color: "666666" })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2. 软件开发中的系统思维")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("2.1 技术架构层面的应用")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "在大麦网票务系统中，我深刻体会到前后端分离架构的优势和挑战：", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "优势：前后端可以独立开发、测试、部署，提高了开发效率", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "挑战：需要完善的API文档、接口规范和联调机制", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "系统各组件（数据库、后端API、前端UI）需要协同工作", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("2.2 用户体验层面的应用")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "用户不仅是系统的使用者，更是系统生态的一部分", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "用户行为数据可以反馈到系统中，用于优化服务", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "AI客服的引入形成了用户-AI-系统的闭环交互", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("2.3 运维部署层面的应用")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "自动化流程将开发、测试、部署连接成一个整体", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "每次代码提交都触发完整的流水线，形成持续反馈", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "部署失败会立即反馈，形成快速修复的闭环", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3. 系统思维的应用实例（结合本项目）")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.1 案例一：座位超卖问题的系统分析")] }),

            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "问题背景：", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 80 }, children: [new TextRun({ text: "用户反映：两个人同时抢同一张票，都显示购买成功，但实际上只有一个人能真正拿到票。", font: "Arial", size: 22 })] }),

            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "系统分析：", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "识别关键链路：检查座位状态 → 创建订单 → 更新座位状态", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "发现关联：座位状态和订单创建相互影响，修改顺序很关键", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "找到根因：检查→创建→更新不是原子操作，并发时出现竞态条件", font: "Arial", size: 22 })] }),

            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "解决方案：", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "使用MyBatis-Plus乐观锁机制：@Version注解自动处理版本控制", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "更新时自动检查版本号，防止并发修改导致的数据不一致", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "通过压测验证解决方案的有效性", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.2 案例二：GitHub Pages部署问题的系统分析")] }),

            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "问题背景：", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 80 }, children: [new TextRun({ text: "本地开发正常，部署到GitHub Pages后页面空白，点击导航链接显示404错误。", font: "Arial", size: 22 })] }),

            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "系统分析：", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "识别环境差异：本地有后端服务器处理路由，生产是纯静态服务器", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "理解约束条件：静态托管无法配置服务端路由规则", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "找到根因：Vue Router的History模式依赖服务器配置，GitHub Pages不支持", font: "Arial", size: 22 })] }),

            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "解决方案：", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "改用Hash模式路由：路由信息存储在URL的#号后面", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "代码实现：根据环境自动选择路由模式", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "const history = isGitHubPages ? createWebHashHistory() : createWebHistory();", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4. 系统思维的收获与反思")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.1 主要收获")] }),
            new Paragraph({ numbering: { reference: "numbers4", level: 0 }, children: [new TextRun({ text: "学会了从整体角度看待问题，不再局限于单个模块", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers4", level: 0 }, children: [new TextRun({ text: "理解了系统各部分之间的关联和依赖关系", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers4", level: 0 }, children: [new TextRun({ text: "认识到反馈机制在系统运行中的重要性", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers4", level: 0 }, children: [new TextRun({ text: "学会了在设计阶段就考虑系统的可扩展性和可维护性", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.2 不足与改进方向")] }),
            new Paragraph({ numbering: { reference: "numbers5", level: 0 }, children: [new TextRun({ text: "不足：初期设计时未充分考虑高并发场景", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 80 }, children: [new TextRun({ text: "改进：需要学习更多关于系统性能优化、分布式架构的知识", font: "Arial", size: 22, italics: true, color: "666666" })] }),
            new Paragraph({ numbering: { reference: "numbers5", level: 0 }, children: [new TextRun({ text: "不足：安全方面考虑不够全面", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 80 }, children: [new TextRun({ text: "改进：需要加强安全意识，学习常见的安全防护措施（SQL注入、XSS、CSRF等）", font: "Arial", size: 22, italics: true, color: "666666" })] }),
            new Paragraph({ numbering: { reference: "numbers5", level: 0 }, children: [new TextRun({ text: "不足：缺乏系统性的测试", bold: true, font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 50, after: 100 }, children: [new TextRun({ text: "改进：需要建立完整的单元测试、集成测试体系", font: "Arial", size: 22, italics: true, color: "666666" })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5. 总结")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "通过大麦网票务系统的开发实践，我深刻体会到系统思维在软件开发中的重要性：", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "更全面地分析和解决问题：不再只看表面，深入分析根本原因", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "理解系统各组件之间的关联：修改一处时考虑对其他部分的影响", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "设计出更加健壮和可维护的系统：架构设计时考虑未来扩展", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "建立了持续改进和迭代优化的意识：通过CI/CD实现快速反馈", font: "Arial", size: 22 })] }),

            new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: "系统思维不仅适用于软件开发，它是一种普适的思维方式。通过这次项目，我不仅掌握了技术知识，更学会了用系统思维分析问题。这将对我未来的学习和工作产生深远影响。", font: "Arial", size: 22 })] }),

            ...createScreenshotNote("截图8：系统架构图", "展示大麦网票务系统的整体架构或核心流程：", "使用draw.io或Xmind绘制架构图，展示前端、后端、数据库、AI服务等组件的关系"),
            ...createScreenshotNote("截图9：CI/CD流水线示意图", "展示CI/CD流水线的完整流程：", "绘制从代码提交到部署的完整流程图"),

            // ===================== 项目总结 =====================
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("项目总结与展望")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("一、项目概述")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "本项目是一个前后端分离的在线票务系统，模拟大麦网的演出票务购买流程。采用Vue 3 + Spring Boot技术栈，实现了演出浏览、座位选择、订单管理、AI智能客服等核心功能，并搭建了完整的CI/CD自动化部署流程。", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("二、技术收获")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("2.1 前端技术")] }),
            new Paragraph({ numbering: { reference: "numbers6", level: 0 }, children: [new TextRun({ text: "Vue 3 Composition API：掌握组件逻辑复用，告别Options API的繁琐", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers6", level: 0 }, children: [new TextRun({ text: "Vue Router：深入理解SPA路由原理（History vs Hash模式）", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers6", level: 0 }, children: [new TextRun({ text: "Element Plus：组件库使用和主题定制，提升开发效率", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers6", level: 0 }, children: [new TextRun({ text: "Vite：体验到现代构建工具的快速开发体验（热更新秒级响应）", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("2.2 后端技术")] }),
            new Paragraph({ numbering: { reference: "numbers7", level: 0 }, children: [new TextRun({ text: "Spring Boot：从零搭建企业级应用，理解自动配置原理", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers7", level: 0 }, children: [new TextRun({ text: "MyBatis-Plus：掌握ORM框架和乐观锁机制，解决并发问题", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "numbers7", level: 0 }, children: [new TextRun({ text: "RESTful API：接口设计规范，统一响应格式code/msg/data", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("三、遇到的核心问题及解决方案")] }),

            createTable(
                ["核心问题", "解决方案", "技术要点"],
                [
                    ["座位超卖", "乐观锁机制", "@Version注解、版本号控制"],
                    ["跨域请求", "Vite代理配置", "开发环境proxy，生产环境Nginx"],
                    ["路由404", "Hash模式路由", "根据环境动态选择路由模式"],
                    ["构建超时", "npmmirror镜像", "npm install配置registry"],
                ],
                [2500, 3000, 3860]
            ),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("四、未来改进方向")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.1 高并发优化")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "引入Redis缓存热点数据（演出信息、座位状态）", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "使用消息队列（RabbitMQ/Kafka）削峰", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "分布式Session管理，支持水平扩展", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.2 安全性增强")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "JWT token刷新机制，支持长期登录", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "API限流防刷，防止恶意攻击", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "敏感数据加密存储（密码加盐哈希）", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.3 智能化提升")] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "智能座位推荐算法：根据用户偏好推荐最佳座位", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "个性化演出推荐：基于用户历史行为推荐", font: "Arial", size: 22 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "实时客服机器人：多轮对话，理解上下文", font: "Arial", size: 22 })] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("五、致谢")] }),
            new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "感谢老师的悉心指导，在项目开发过程中给出了很多宝贵的建议。感谢同学们的帮助，在遇到问题时能够相互讨论、共同解决。通过这次项目，我不仅掌握了前后端开发、CI/CD部署等技术知识，更重要的是学会了用系统思维去分析和解决复杂问题。这将对我未来的学习和工作产生深远影响。", font: "Arial", size: 22 })] }),

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
    fs.writeFileSync("d:/2026/集成/damai-ticket-project/个人作业汇总报告_v2.docx", buffer);
    console.log("文档生成成功！");
});
