package com.mehrmarkt.mehrmarktsystem.Controller;

import com.mehrmarkt.mehrmarktsystem.Service.lager.LagerService;
import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import com.mehrmarkt.mehrmarktsystem.response.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lager")
public class LagerController {

    @Autowired
    private LagerService lagerService;

    @Transactional
    @PatchMapping("/updateSize/{lagerort}/{maxSize}")
    public String updateSize(@PathVariable String lagerort, @PathVariable int maxSize){
        if(!lagerService.existsByName(lagerort)){
            return "lager" + lagerort + "existiert nicht!";
        }
        Lager lager = lagerService.getLager(lagerort);
        if(lager.getSize() >= maxSize){
            return "Max Size für "+lagerort+" ist kleiner als die Anzahl der Produkte im Lager";
        }
        lagerService.updateMaxSize(lagerort, maxSize);
        return "Max Size für "+lagerort+" updated successfully";


    }

    @GetMapping("/statistik")
    public ResponseEntity<Object> returnStatistik(){

        List<Lager> lagers = lagerService.getAllLager();
        if(lagers.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseHandler.generateLagerStatistics(lagers);
    }

}
