-- 大麦网票务系统数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS damai_ticket CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE damai_ticket;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    `password` VARCHAR(100) NOT NULL COMMENT '密码',
    `phone` VARCHAR(20) COMMENT '手机号',
    `role` VARCHAR(20) NOT NULL DEFAULT 'USER' COMMENT '角色：USER/ADMIN',
    `nickname` VARCHAR(50) COMMENT '昵称',
    `email` VARCHAR(100) COMMENT '邮箱',
    INDEX idx_username (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 演出活动表
CREATE TABLE IF NOT EXISTS `show_event` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '演出ID',
    `title` VARCHAR(200) NOT NULL COMMENT '演出标题',
    `location` VARCHAR(200) NOT NULL COMMENT '演出地点',
    `show_time` DATETIME NOT NULL COMMENT '演出时间',
    `price` DECIMAL(10,2) NOT NULL COMMENT '票价',
    `description` TEXT COMMENT '演出描述',
    `category` VARCHAR(50) COMMENT '演出类别',
    `image_url` VARCHAR(500) COMMENT '图片URL',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_show_time (`show_time`),
    INDEX idx_category (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='演出活动表';

-- 座位表
CREATE TABLE IF NOT EXISTS `seat` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '座位ID',
    `show_id` BIGINT NOT NULL COMMENT '演出ID',
    `seat_number` VARCHAR(20) NOT NULL COMMENT '座位号',
    `status` INT DEFAULT 0 COMMENT '状态：0可选 1已售 2已锁定',
    `price` DECIMAL(10,2) COMMENT '座位价格',
    INDEX idx_show_id (`show_id`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='座位表';

-- 订单表
CREATE TABLE IF NOT EXISTS `order_info` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '订单ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `show_id` BIGINT NOT NULL COMMENT '演出ID',
    `seat_id` BIGINT NOT NULL COMMENT '座位ID',
    `amount` DECIMAL(10,2) NOT NULL COMMENT '订单金额',
    `status` INT DEFAULT 0 COMMENT '订单状态：0待支付 1已支付 2已取消 3已退款',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (`user_id`),
    INDEX idx_show_id (`show_id`),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 评分表
CREATE TABLE IF NOT EXISTS `rating` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '评分ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `show_id` BIGINT NOT NULL COMMENT '演出ID',
    `order_id` BIGINT NOT NULL COMMENT '订单ID',
    `score` INT NOT NULL COMMENT '评分：1-5',
    `content` TEXT COMMENT '评价内容',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (`user_id`),
    INDEX idx_show_id (`show_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评分表';

-- 插入管理员账号 (密码: admin123)
INSERT INTO `user` (`username`, `password`, `phone`, `role`, `nickname`, `email`) VALUES
('admin', 'admin123', '13800138000', 'ADMIN', '管理员', 'admin@damai.com');

-- 插入测试用户 (密码: 123456)
INSERT INTO `user` (`username`, `password`, `phone`, `role`, `nickname`, `email`) VALUES
('test', '123456', '13900139000', 'USER', '测试用户', 'test@damai.com');

-- 插入测试演出数据
INSERT INTO `show_event` (`title`, `location`, `show_time`, `price`, `description`, `category`, `image_url`, `create_time`) VALUES
('周杰伦2026世界巡回演唱会', '北京国家体育场', '2026-06-15 19:30:00', 1280.00, '周杰伦2026全新世界巡回演唱会北京站，天王级巨星倾情演绎经典金曲！', '演唱会', 'https://img.tukuppt.com/photo-big/00/01/43/6152740a99b9a836.jpg', NOW()),
('开心麻花爆笑喜剧《乌龙山伯爵》', '上海人民大舞台', '2026-05-20 14:00:00', 380.00, '经典话剧再现，爆笑不断的剧情让你笑到肚子疼！', '话剧', 'https://img.tukuppt.com/photo-big/00/58/25/6152d67f61c02836.jpg', NOW()),
('2026NBA中国赛', '广州体育馆', '2026-08-10 20:00:00', 880.00, 'NBA巨星空降广州，精彩对决不容错过！', '体育赛事', 'https://img.tukuppt.com/photo-big/00/34/67/6152c5c7beed7c436.jpg', NOW()),
('理查德克莱德曼钢琴独奏会', '深圳音乐厅', '2026-07-25 20:00:00', 680.00, '钢琴王子理查德·克莱德曼浪漫之夜钢琴独奏会', '音乐会', 'https://img.tukuppt.com/photo-big/00/01/43/6152740a99b9a836.jpg', NOW()),
('舞剧《只此青绿》', '杭州大剧院', '2026-06-01 19:30:00', 480.00, '爆款舞蹈诗剧《只此青绿》— 舞绘《千里江山图》', '舞蹈', 'https://img.tukuppt.com/photo-big/00/58/25/6152d67f61c02836.jpg', NOW()),
('德云社相声专场', '南京人民大会堂', '2026-05-18 19:30:00', 280.00, '德云社岳云鹏孙越相声专场，笑料不断！', '曲艺杂技', 'https://img.tukuppt.com/photo-big/00/34/67/6152c5c7beed7c436.jpg', NOW());

-- 为演出1生成座位数据 (50个座位)
INSERT INTO `seat` (`show_id`, `seat_number`, `status`, `price`) VALUES
(1, 'A1', 0, 1280.00), (1, 'A2', 0, 1280.00), (1, 'A3', 0, 1280.00), (1, 'A4', 0, 1280.00), (1, 'A5', 0, 1280.00),
(1, 'A6', 0, 1280.00), (1, 'A7', 0, 1280.00), (1, 'A8', 0, 1280.00), (1, 'A9', 0, 1280.00), (1, 'A10', 0, 1280.00),
(1, 'B1', 0, 980.00), (1, 'B2', 0, 980.00), (1, 'B3', 0, 980.00), (1, 'B4', 0, 980.00), (1, 'B5', 0, 980.00),
(1, 'B6', 0, 980.00), (1, 'B7', 0, 980.00), (1, 'B8', 0, 980.00), (1, 'B9', 0, 980.00), (1, 'B10', 0, 980.00),
(1, 'C1', 0, 680.00), (1, 'C2', 0, 680.00), (1, 'C3', 0, 680.00), (1, 'C4', 0, 680.00), (1, 'C5', 0, 680.00),
(1, 'C6', 0, 680.00), (1, 'C7', 0, 680.00), (1, 'C8', 0, 680.00), (1, 'C9', 0, 680.00), (1, 'C10', 0, 680.00),
(1, 'D1', 0, 380.00), (1, 'D2', 0, 380.00), (1, 'D3', 0, 380.00), (1, 'D4', 0, 380.00), (1, 'D5', 0, 380.00),
(1, 'D6', 0, 380.00), (1, 'D7', 0, 380.00), (1, 'D8', 0, 380.00), (1, 'D9', 0, 380.00), (1, 'D10', 0, 380.00),
(1, 'E1', 0, 180.00), (1, 'E2', 0, 180.00), (1, 'E3', 0, 180.00), (1, 'E4', 0, 180.00), (1, 'E5', 0, 180.00),
(1, 'E6', 0, 180.00), (1, 'E7', 0, 180.00), (1, 'E8', 0, 180.00), (1, 'E9', 0, 180.00), (1, 'E10', 0, 180.00);

-- 为演出2生成座位数据
INSERT INTO `seat` (`show_id`, `seat_number`, `status`, `price`) VALUES
(2, '1排1座', 0, 380.00), (2, '1排2座', 0, 380.00), (2, '1排3座', 0, 380.00), (2, '1排4座', 0, 380.00), (2, '1排5座', 0, 380.00),
(2, '2排1座', 0, 280.00), (2, '2排2座', 0, 280.00), (2, '2排3座', 0, 280.00), (2, '2排4座', 0, 280.00), (2, '2排5座', 0, 280.00),
(2, '3排1座', 0, 180.00), (2, '3排2座', 0, 180.00), (2, '3排3座', 0, 180.00), (2, '3排4座', 0, 180.00), (2, '3排5座', 0, 180.00);

-- 为其他演出也添加座位
INSERT INTO `seat` (`show_id`, `seat_number`, `status`, `price`) VALUES
(3, 'VIP1', 0, 880.00), (3, 'VIP2', 0, 880.00), (3, 'VIP3', 0, 880.00), (3, 'A区1', 0, 580.00), (3, 'A区2', 0, 580.00),
(3, 'B区1', 0, 380.00), (3, 'B区2', 0, 380.00), (3, 'C区1', 0, 180.00), (3, 'C区2', 0, 180.00),
(4, 'VIP', 0, 680.00), (4, '一等座1', 0, 480.00), (4, '一等座2', 0, 480.00), (4, '二等座1', 0, 280.00), (4, '二等座2', 0, 280.00),
(5, 'VIP', 0, 480.00), (5, 'A区', 0, 380.00), (5, 'B区', 0, 280.00), (5, 'C区', 0, 180.00),
(6, 'VIP区', 0, 280.00), (6, '一楼1区', 0, 180.00), (6, '一楼2区', 0, 180.00), (6, '二楼区', 0, 100.00);

SELECT '数据库初始化完成！' AS message;
