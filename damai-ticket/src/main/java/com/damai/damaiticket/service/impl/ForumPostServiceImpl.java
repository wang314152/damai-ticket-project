package com.damai.damaiticket.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.damai.damaiticket.entity.ForumPost;
import com.damai.damaiticket.mapper.ForumPostMapper;
import com.damai.damaiticket.service.ForumPostService;
import org.springframework.stereotype.Service;

@Service
public class ForumPostServiceImpl
        extends ServiceImpl<ForumPostMapper, ForumPost>
        implements ForumPostService {
}
