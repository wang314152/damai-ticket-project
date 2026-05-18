-- 论坛模块数据库初始化脚本
-- 执行前请确保已创建数据库 damai_ticket

-- 创建论坛帖子表
CREATE TABLE IF NOT EXISTS `forum_post` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '帖子ID',
    `title` VARCHAR(200) NOT NULL COMMENT '帖子标题',
    `content` TEXT NOT NULL COMMENT '帖子内容',
    `user_id` BIGINT DEFAULT NULL COMMENT '作者ID',
    `author_name` VARCHAR(100) DEFAULT NULL COMMENT '作者名称',
    `view_count` INT DEFAULT 0 COMMENT '浏览量',
    `reply_count` INT DEFAULT 0 COMMENT '回复数',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='论坛帖子表';

-- 创建论坛回复表
CREATE TABLE IF NOT EXISTS `forum_reply` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '回复ID',
    `post_id` BIGINT NOT NULL COMMENT '帖子ID',
    `content` TEXT NOT NULL COMMENT '回复内容',
    `user_id` BIGINT DEFAULT NULL COMMENT '回复者ID',
    `user_name` VARCHAR(100) DEFAULT NULL COMMENT '回复者名称',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    INDEX `idx_post_id` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='论坛回复表';

-- 插入示例数据
INSERT INTO `forum_post` (`title`, `content`, `user_id`, `author_name`, `view_count`, `reply_count`) VALUES
('周杰伦演唱会观后感', '终于看到偶像现场了！太震撼了，嗓子都喊哑了。舞台效果超级棒，周杰伦的状态也非常好，唱了好多经典老歌。', 1, '杰迷小王', 256, 2),
('开心麻花话剧推荐', '强烈推荐《乌龙山伯爵》，笑点密集，演员演技炸裂！适合带朋友一起去看，保证让你笑到肚子疼。', 2, '戏剧爱好者', 189, 1),
('德云社相声专场体验', '昨晚去听了德云社的相声，演员功底扎实，包袱不断。现场氛围超级好，散场后还意犹未尽！', 3, '相声迷', 145, 0),
('2026NBA中国赛观赛攻略', '分享一些观赛经验：提前2小时到场，选座位尽量选靠近通道的，方便进出。带好防晒和充电宝！', 4, '篮球达人', 312, 1);

-- 插入回复示例数据
INSERT INTO `forum_reply` (`post_id`, `content`, `user_id`, `user_name`) VALUES
(1, '太真实了！我也是周董的粉丝，下次演唱会一起吗？', 2, '音乐达人'),
(1, '周董的演唱会真的值回票价！', 3, '演唱会爱好者'),
(2, '已经买好票了，期待！', 4, '剧迷'),
(4, '补充一下：最好带个小板凳，场馆的座位有点硬', 5, '老球迷');
