package com.damai.damaiticket.controller;

import java.time.LocalDateTime;
import java.util.List;
import com.damai.damaiticket.common.R;
import com.damai.damaiticket.entity.ForumPost;
import com.damai.damaiticket.entity.ForumReply;
import com.damai.damaiticket.service.ForumPostService;
import com.damai.damaiticket.service.ForumReplyService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forum")
@CrossOrigin
public class ForumController {

    private final ForumPostService forumPostService;
    private final ForumReplyService forumReplyService;

    public ForumController(ForumPostService forumPostService, ForumReplyService forumReplyService) {
        this.forumPostService = forumPostService;
        this.forumReplyService = forumReplyService;
    }

    // 获取所有帖子（可按演出ID筛选）
    @GetMapping("/list")
    public R<List<ForumPost>> list(@RequestParam(required = false) Long showId) {
        List<ForumPost> list;
        if (showId != null) {
            // 按演出筛选
            list = forumPostService.lambdaQuery()
                    .eq(ForumPost::getShowId, showId)
                    .orderByDesc(ForumPost::getCreateTime)
                    .list();
        } else {
            // 获取所有帖子
            list = forumPostService.lambdaQuery()
                    .orderByDesc(ForumPost::getCreateTime)
                    .list();
        }
        return R.ok(list);
    }

    // 发布帖子
    @PostMapping("/post")
    public R<String> post(@RequestBody ForumPost post) {
        if (post.getUserId() == null) {
            return R.fail("请先登录");
        }
        if (post.getTitle() == null || post.getTitle().trim().isEmpty()) {
            return R.fail("标题不能为空");
        }
        if (post.getContent() == null || post.getContent().trim().isEmpty()) {
            return R.fail("内容不能为空");
        }
        post.setViewCount(0);
        post.setReplyCount(0);
        post.setCreateTime(LocalDateTime.now());
        post.setUpdateTime(LocalDateTime.now());
        boolean success = forumPostService.save(post);
        return success ? R.ok("发布成功") : R.fail("发布失败");
    }

    // 获取单个帖子详情
    @GetMapping("/detail/{id}")
    public R<ForumPost> detail(@PathVariable Long id) {
        ForumPost post = forumPostService.getById(id);
        if (post == null) {
            return R.fail("帖子不存在");
        }
        // 浏览量+1
        post.setViewCount(post.getViewCount() == null ? 1 : post.getViewCount() + 1);
        forumPostService.updateById(post);
        return R.ok(post);
    }

    // 删除帖子（仅作者或管理员可删除）
    @DeleteMapping("/delete/{id}")
    public R<String> delete(@PathVariable Long id) {
        ForumPost post = forumPostService.getById(id);
        if (post == null) {
            return R.fail("帖子不存在");
        }
        boolean success = forumPostService.removeById(id);
        return success ? R.ok("删除成功") : R.fail("删除失败");
    }

    // 获取帖子的回复列表
    @GetMapping("/replies/{postId}")
    public R<List<ForumReply>> getReplies(@PathVariable Long postId) {
        List<ForumReply> replies = forumReplyService.lambdaQuery()
                .eq(ForumReply::getPostId, postId)
                .orderByAsc(ForumReply::getCreateTime)
                .list();
        return R.ok(replies);
    }

    // 发布回复
    @PostMapping("/reply")
    public R<String> reply(@RequestBody ForumReply reply) {
        if (reply.getUserId() == null) {
            return R.fail("请先登录");
        }
        if (reply.getContent() == null || reply.getContent().trim().isEmpty()) {
            return R.fail("回复内容不能为空");
        }
        reply.setCreateTime(LocalDateTime.now());
        boolean success = forumReplyService.save(reply);
        
        // 更新帖子回复数
        if (success) {
            ForumPost post = forumPostService.getById(reply.getPostId());
            if (post != null) {
                post.setReplyCount(post.getReplyCount() == null ? 1 : post.getReplyCount() + 1);
                forumPostService.updateById(post);
            }
            return R.ok("回复成功");
        }
        return R.fail("回复失败");
    }

    // 删除回复
    @DeleteMapping("/reply/{id}")
    public R<String> deleteReply(@PathVariable Long id) {
        ForumReply reply = forumReplyService.getById(id);
        if (reply == null) {
            return R.fail("回复不存在");
        }
        boolean success = forumReplyService.removeById(id);
        
        // 更新帖子回复数
        if (success) {
            ForumPost post = forumPostService.getById(reply.getPostId());
            if (post != null && post.getReplyCount() != null && post.getReplyCount() > 0) {
                post.setReplyCount(post.getReplyCount() - 1);
                forumPostService.updateById(post);
            }
            return R.ok("删除成功");
        }
        return R.fail("删除失败");
    }
}
