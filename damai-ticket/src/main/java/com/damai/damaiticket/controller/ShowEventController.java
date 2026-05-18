package com.damai.damaiticket.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.damai.damaiticket.common.R;
import com.damai.damaiticket.entity.ShowEvent;
import com.damai.damaiticket.service.ShowEventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/show")
@CrossOrigin
public class ShowEventController {

    private final ShowEventService showEventService;

    public ShowEventController(ShowEventService showEventService) {
        this.showEventService = showEventService;
    }

    // ✅ 用户端：演出列表（支持 keyword + category）
    @GetMapping("/list")
    public R<List<ShowEvent>> list(@RequestParam(required = false) String keyword,
                                @RequestParam(required = false) String category) {

        QueryWrapper<ShowEvent> qw = new QueryWrapper<>();
        if (keyword != null && !keyword.trim().isEmpty()) {
            qw.like("title", keyword.trim());
        }
        if (category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category.trim())) {
            qw.eq("category", category.trim());
        }
        qw.orderByDesc("create_time");
        return R.ok(showEventService.list(qw));
    }

    // 详情
    @GetMapping("/{id}")
    public R<ShowEvent> detail(@PathVariable Long id) {
        ShowEvent show = showEventService.getById(id);
        if (show != null) {
            return R.ok(show);
        }
        return R.fail("演出不存在");
    }
}
