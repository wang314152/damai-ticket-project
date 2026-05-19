package com.damai.damaiticket.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.damai.damaiticket.common.R;
import com.damai.damaiticket.entity.Seat;
import com.damai.damaiticket.entity.ShowEvent;
import com.damai.damaiticket.service.SeatService;
import com.damai.damaiticket.service.ShowEventService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/seat")
@CrossOrigin
public class SeatController {

    private final SeatService seatService;
    private final ShowEventService showEventService;

    public SeatController(SeatService seatService, ShowEventService showEventService) {
        this.seatService = seatService;
        this.showEventService = showEventService;
    }

    /**
     * 初始化座位（10 行 × 10 列）
     * A/B/C 区不同价格
     */
    @PostMapping("/init/{showId}")
    public R<String> init(@PathVariable Long showId) {

        // 先删除原有座位（防止重复）
        seatService.remove(new QueryWrapper<Seat>().eq("show_id", showId));

        ShowEvent show = showEventService.getById(showId);
        if (show == null) return R.fail("演出不存在");

        BigDecimal base = show.getPrice(); // 基础票价

        List<Seat> list = new ArrayList<>();

        for (int row = 1; row <= 10; row++) {
            for (int col = 1; col <= 10; col++) {

                Seat seat = new Seat();
                seat.setShowId(showId);
                seat.setSeatNumber(row + "-" + col);
                seat.setStatus(0);

                // ✅ 按排数定价（前排贵）
                BigDecimal price;
                if (row <= 3) {
                    price = base.add(new BigDecimal("200")); // A区
                } else if (row <= 6) {
                    price = base.add(new BigDecimal("100")); // B区
                } else {
                    price = base; // C区
                }

                seat.setPrice(price);
                list.add(seat);
            }
        }

        seatService.saveBatch(list);
        return R.ok("座位初始化成功（含分区价格）");
    }

    @GetMapping("/list/{showId}")
    public R<List<Seat>> list(@PathVariable Long showId) {
        List<Seat> seats = seatService.list(
                new QueryWrapper<Seat>()
                        .eq("show_id", showId)
                        .orderByAsc("seat_number")
        );
        return R.ok(seats);
    }

    /**
     * 重置座位状态（管理员功能）
     * 将所有锁定状态(status=2)的座位释放为可用(status=0)
     */
    @PostMapping("/reset/{showId}")
    public R<String> resetSeats(@PathVariable Long showId) {
        Seat seat = new Seat();
        seat.setStatus(0);
        boolean success = seatService.update(seat,
                new com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper<Seat>()
                        .eq("show_id", showId)
                        .eq("status", 2)
        );
        if (success) {
            // 查询释放了多少座位
            long released = seatService.count(
                    new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<Seat>()
                            .eq("show_id", showId)
                            .eq("status", 0)
            );
            return R.ok("已释放被锁定的座位");
        }
        return R.ok("没有需要释放的座位");
    }

    /**
     * 重置所有演出被锁定的座位（管理员功能）
     */
    @PostMapping("/resetAll")
    public R<String> resetAllSeats() {
        Seat seat = new Seat();
        seat.setStatus(0);
        boolean success = seatService.update(seat,
                new com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper<Seat>()
                        .eq("status", 2)
        );
        if (success) {
            return R.ok("已释放所有被锁定的座位");
        }
        return R.ok("没有需要释放的座位");
    }
}
