package com.damai.damaiticket;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@MapperScan("com.damai.damaiticket.mapper")
@ComponentScan(basePackages = {"com.damai.damaiticket", "com.damai.damaiticket.controller"})
public class DamaiTicketApplication {

    public static void main(String[] args) {
        SpringApplication.run(DamaiTicketApplication.class, args);
    }
}
