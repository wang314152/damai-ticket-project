package com.damai.damaiticket.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("forum_reply")
public class ForumReply {

    @TableId(type = IdType.AUTO)
    private Long id;

    // 帖子ID
    private Long postId;

    // 回复内容
    private String content;

    // 回复者ID
    private Long userId;

    // 回复者名称
    private String userName;

    // 创建时间
    private LocalDateTime createTime;
}
