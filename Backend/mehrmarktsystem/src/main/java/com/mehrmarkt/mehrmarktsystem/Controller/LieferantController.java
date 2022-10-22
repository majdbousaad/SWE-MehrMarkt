package com.mehrmarkt.mehrmarktsystem.Controller;


import com.mehrmarkt.mehrmarktsystem.Service.LieferantService;
import com.mehrmarkt.mehrmarktsystem.model.Lieferant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/Lieferant")
public class LieferantController {

    @Autowired
    private LieferantService lieferantService;

    @PostMapping("/add")
    public String add(@RequestBody Lieferant lieferant){
        lieferantService.saveLieferant(lieferant);

        return "New Lieferant is added";
    }

    @GetMapping("/all")
    public List<Lieferant> getAllLieferanten(){
        return lieferantService.getAllLieferanten();
    }
}
