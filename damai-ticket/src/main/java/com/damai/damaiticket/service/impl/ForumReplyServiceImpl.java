package com.damai.damaiticket.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.damai.damaiticket.entity.ForumReply;
import com.damai.damaiticket.mapper.ForumReplyMapper;
import com.damai.damaiticket.service.ForumReplyService;
import org.springframework.stereotype.Service;

@Service
public class ForumReplyServiceImpl
        extends ServiceImpl<ForumReplyMapper, ForumReply>
        implements ForumReplyService {
}
