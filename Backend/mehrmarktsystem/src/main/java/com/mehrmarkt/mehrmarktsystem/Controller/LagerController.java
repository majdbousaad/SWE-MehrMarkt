package com.mehrmarkt.mehrmarktsystem.Controller;

import com.mehrmarkt.mehrmarktsystem.Service.LagerService;
import com.mehrmarkt.mehrmarktsystem.model.Lager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lager")
public class LagerController {

    @Autowired
    private LagerService lagerService;

    @Transactional
    @PatchMapping("/updateSize/{maxSize}")
    public String updateSize(@PathVariable int maxSize){
        Lager lager = lagerService.getLager();
        if(lager.getSize() >= maxSize){
            return "Max Size ist kleiner als die Anzahl der Produkte im Lager";
        }
        lagerService.updateMaxSize(maxSize);
        return "Max Size updated successfully";


    }

}
