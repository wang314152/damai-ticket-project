package com.damai.damaiticket.controller;

import com.damai.damaiticket.entity.OrderInfo;
import com.damai.damaiticket.entity.ShowEvent;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.damai.damaiticket.mapper.OrderInfoMapper;
import com.damai.damaiticket.mapper.ShowEventMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private static final String SILICONFLOW_API_KEY = "sk-e21a2d68201d4f9e97c04eba255001fd";
    private static final String SILICONFLOW_URL = "https://api.deepseek.com/chat/completions";

    @Autowired
    private ShowEventMapper showEventMapper;

    @Autowired
    private OrderInfoMapper orderInfoMapper;

    @Autowired
    private com.damai.damaiticket.service.SeatService seatService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> result = new HashMap<>();
        result.put("status", "ok");
        result.put("message", "AI 智能助手已启动！");
        return ResponseEntity.ok(result);
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (request == null) {
                response.put("error", "请求体不能为空");
                return ResponseEntity.badRequest().body(response);
            }
            Object questionObj = request.get("question");
            String question = questionObj != null ? questionObj.toString() : null;
            if (question == null || question.trim().isEmpty()) {
                response.put("error", "问题不能为空");
                return ResponseEntity.badRequest().body(response);
            }

            // 获取项目上下文信息
            String context = buildContext();
            
            // 构建系统提示词
            String systemPrompt = buildSystemPrompt(context);

            RestTemplate restTemplate = new RestTemplate();
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + SILICONFLOW_API_KEY);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "deepseek-chat");
            
            List<Map<String, String>> messages = new java.util.ArrayList<>();
            
            // 添加系统提示词
            Map<String, String> systemMsg = new HashMap<>();
            systemMsg.put("role", "system");
            systemMsg.put("content", systemPrompt);
            messages.add(systemMsg);
            
            // 添加用户问题
            Map<String, String> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", question);
            messages.add(userMsg);

            body.put("messages", messages);

            org.springframework.http.HttpEntity<Map<String, Object>> entity = 
                new org.springframework.http.HttpEntity<>(body, headers);
            
            ResponseEntity<Map> apiResponse = restTemplate.postForEntity(
                SILICONFLOW_URL, entity, Map.class);

            if (apiResponse.getBody() != null) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> choices = (List<Map<String, Object>>) apiResponse.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> msg = choices.get(0);
                    @SuppressWarnings("unchecked")
                    Map<String, Object> msgContent = (Map<String, Object>) msg.get("message");
                    Object content = msgContent.get("content");
                    String answer = content != null ? content.toString() : "AI未返回内容";
                    // 清理Markdown格式
                    answer = cleanMarkdown(answer);
                    response.put("answer", answer);
                    return ResponseEntity.ok(response);
                }
            }
            response.put("answer", "抱歉，AI 服务暂时无法响应，请稍后重试。");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "AI 服务调用失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 构建项目上下文信息
     */
    private String buildContext() {
        StringBuilder context = new StringBuilder();
        
        // 获取演出列表
        List<ShowEvent> shows = showEventMapper.selectList(null);
        context.append("【当前演出列表】\n");
        if (shows != null && !shows.isEmpty()) {
            for (int i = 0; i < Math.min(shows.size(), 10); i++) {
                ShowEvent show = shows.get(i);
                
                // 查询该演出的座位信息
                int totalSeats = 0;
                int availableSeats = 0;
                try {
                    List<com.damai.damaiticket.entity.Seat> seatList = seatService.list(
                        new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<com.damai.damaiticket.entity.Seat>()
                            .eq("show_id", show.getId())
                    );
                    totalSeats = seatList.size();
                    availableSeats = (int) seatList.stream().filter(s -> s.getStatus() != null && s.getStatus() == 0).count();
                } catch (Exception e) {
                    // 座位查询失败，忽略
                }
                
                String seatInfo = totalSeats > 0 ? String.format("【%d/%d座可售】", availableSeats, totalSeats) : "【座位未初始化】";
                
                context.append(String.format("%d. %s | %s | %s | ¥%s | %s %s\n",
                    show.getId(),
                    show.getTitle() != null ? show.getTitle() : "未知",
                    show.getCategory() != null ? show.getCategory() : "未分类",
                    show.getLocation() != null ? show.getLocation() : "未知地点",
                    show.getPrice() != null ? show.getPrice() : "0",
                    show.getShowTime() != null ? show.getShowTime() : "未知时间",
                    seatInfo
                ));
            }
            if (shows.size() > 10) {
                context.append("...还有 ").append(shows.size() - 10).append(" 场演出\n");
            }
        } else {
            context.append("暂无演出\n");
        }
        
        // 获取统计数据
        context.append("\n【销售统计】\n");
        try {
            List<ShowEvent> allShows = showEventMapper.selectList(null);
            if (allShows != null && !allShows.isEmpty()) {
                long totalShows = allShows.size();
                long concerts = allShows.stream().filter(s -> "演唱会".equals(s.getCategory())).count();
                context.append("- 演出总数: ").append(totalShows).append("\n");
                context.append("- 演唱会: ").append(concerts).append(" 场\n");
                
                // 统计订单
                List<OrderInfo> allOrders = orderInfoMapper.selectList(null);
                if (allOrders != null) {
                    long paidOrders = allOrders.stream().filter(o -> o.getStatus() != null && o.getStatus() == 1).count();
                    double totalRevenue = allOrders.stream()
                        .filter(o -> o.getStatus() != null && o.getStatus() == 1)
                        .filter(o -> o.getAmount() != null)
                        .mapToDouble(o -> o.getAmount().doubleValue())
                        .sum();
                    context.append("- 已支付订单: ").append(paidOrders).append(" 单\n");
                    context.append("- 总收入: ¥").append(String.format("%.2f", totalRevenue)).append("\n");
                }
            }
        } catch (Exception e) {
            context.append("统计信息获取中...\n");
        }
        
        return context.toString();
    }

    /**
     * 构建系统提示词 - 改进版，支持多轮购票引导
     */
    private String buildSystemPrompt(String context) {
        return "你是大麦网的专业智能票务助手，名字叫\"麦麦\"。\n\n" +
               "【身份定位】\n" +
               "你是一位专业、友好、热情的票务客服，熟悉大麦网的所有功能和演出信息。\n\n" +
               "【服务范围】\n" +
               "1. 演出推荐：根据用户喜好推荐热门演出\n" +
               "2. 票务咨询：解答购票流程、票价、座位等问题\n" +
               "3. 订单问题：帮助查询订单状态、支付问题等\n" +
               "4. 场馆指引：介绍演出场馆位置、交通等信息\n" +
               "5. 购票帮助：指导用户完成购票流程\n\n" +
               "【回答风格】\n" +
               "- 使用友好、亲切的语气，像朋友聊天一样\n" +
               "- 适当使用表情符号增加趣味性 🎫🎭🎵\n" +
               "- 回答简洁明了，突出重点\n" +
               "- 如果不确定某事，诚实地告诉用户\n\n" +
               "【项目数据】\n" +
               context + "\n\n" +
               
               "【重要：购票流程 - 必须分步引导】\n" +
               "当用户表示想购票时，你必须遵循以下【多轮对话流程】，每次只问一个问题：\n\n" +
               "第1步：确认演出\n" +
               "❓ 用户说想买票时，先问：\"请问您想看哪场演出呢？\"\n" +
               "如果用户说了演出名称，在演出列表中查找并确认：\n" +
               "✅ \"好的，您想看【演出名称】，对吗？\"\n\n" +
               "第2步：确认数量\n" +
               "❓ 确认演出后问：\"请问您想买几张票呢？\"\n" +
               "如果用户说了数量，确认：\n" +
               "✅ \"好的，【N】张票，请问您有什么座位偏好吗？\"\n\n" +
               "第3步：确认座位偏好\n" +
               "❓ 问：\"请问您想要什么位置的座位？\"\n" +
               "选项：A区（前排）、B区（中间）、C区（后排）、VIP区\n" +
               "或者让用户选择：\"前排视野好但价格高，后排便宜\"等\n\n" +
               "第4步：引导下单\n" +
               "✅ \"好的，我已经了解您的需求了！\"\n" +
               "请引导用户去系统购票：\n" +
               "\"请前往【演出列表】页面，选择您喜欢的演出和座位，系统会引导您完成购票哦！\"\n\n" +
               "【购票引导示例】\n\n" +
               "用户：我想买票\n" +
               "AI：请问您想看哪场演出呢？😊\n\n" +
               "用户：周杰伦演唱会\n" +
               "AI：好的！周杰伦2026世界巡回演唱会，1280元，对吗？🎤\n\n" +
               "用户：对\n" +
               "AI：请问您想买几张票呢？\n\n" +
               "用户：2张\n" +
               "AI：好的，2张票！请问您有什么座位偏好吗？\n" +
               "A区视野好（前排）💺 B区性价比高（中间）\n\n" +
               "用户：想要前排\n" +
               "AI：好的！VIP A区，2张票！🎉\n" +
               "请前往【演出列表】选择该演出，系统会自动为您推荐A区座位。\n" +
               "祝您观演愉快！\n\n" +
               
               "【禁止行为 - 非常重要】\n" +
               "❌ 禁止：用户说想买票，你直接帮他下单\n" +
               "❌ 禁止：用户还没说数量，你就确认订单\n" +
               "❌ 禁止：用户还没确认座位，你就说购买成功\n" +
               "❌ 禁止：在对话中直接创建订单\n\n" +
               "✅ 正确：你必须先收集演出名称、数量、座位偏好，然后引导用户去系统下单\n\n" +
               "【关于\"票卖完了\"的解答】\n" +
               "演出列表中显示【x/x座可售】表示座位状态：\n" +
               "- 如果显示【座位未初始化】，说明座位还没准备好，请用户选择其他演出\n" +
               "- 如果可售座位还有很多但用户说选不到，可能是座位被临时锁定（其他用户正在下单），请告诉用户：\n" +
               "  \"抱歉，目前部分座位正在被其他用户选购中。建议您稍等几分钟后再试，或者联系管理员重置座位状态。\"\n\n" +
               "【其他问题】\n" +
               "- 如果用户问到具体演出，可以根据演出列表推荐\n" +
               "- 如果用户想查询订单，告诉用户去\"我的订单\"页面查看\n" +
               "- 遇到系统问题，提醒用户联系客服或稍后重试\n\n" +
               "请用中文回答，语气亲切友好！记住购票流程必须【一步一步引导】！";
    }

    /**
     * 清理Markdown格式，转换为纯文本
     */
    private String cleanMarkdown(String text) {
        if (text == null) return "";
        // 保留换行和基本格式
        return text
            .replace("\\n", "\n")
            .trim();
    }
}
