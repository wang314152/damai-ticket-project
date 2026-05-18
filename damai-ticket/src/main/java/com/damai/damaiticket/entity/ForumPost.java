package com.damai.damaiticket.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("forum_post")
public class ForumPost {

    @TableId(type = IdType.AUTO)
    private Long id;

    // 标题
    private String title;

    // 内容
    private String content;

    // 作者ID
    private Long userId;

    // 作者名称（冗余存储）
    private String authorName;

    // 浏览量
    private Integer viewCount;

    // 回复数
    private Integer replyCount;

    // 创建时间
    private LocalDateTime createTime;

    // 更新时间
    private LocalDateTime updateTime;

    // 关联演出ID（可选）
    private Long showId;

    // 关联演出名称（可选）
    private String showName;
}
