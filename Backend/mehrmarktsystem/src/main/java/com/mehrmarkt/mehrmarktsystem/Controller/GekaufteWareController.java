package com.mehrmarkt.mehrmarktsystem.Controller;


import com.mehrmarkt.mehrmarktsystem.Service.ware.GekaufteWareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ware")
public class GekaufteWareController {

    @Autowired
    private GekaufteWareService gekaufteWareService;


}
