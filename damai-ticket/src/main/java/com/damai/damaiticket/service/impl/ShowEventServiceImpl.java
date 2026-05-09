package com.damai.damaiticket.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.damai.damaiticket.entity.ShowEvent;
import com.damai.damaiticket.mapper.ShowEventMapper;
import com.damai.damaiticket.service.ShowEventService;
import org.springframework.stereotype.Service;

@Service
public class ShowEventServiceImpl
        extends ServiceImpl<ShowEventMapper, ShowEvent>
        implements ShowEventService {
}
