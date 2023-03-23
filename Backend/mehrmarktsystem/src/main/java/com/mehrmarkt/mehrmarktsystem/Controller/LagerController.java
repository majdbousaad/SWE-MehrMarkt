package com.mehrmarkt.mehrmarktsystem.Controller;

import com.mehrmarkt.mehrmarktsystem.Service.lager.LagerService;
import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import com.mehrmarkt.mehrmarktsystem.model.lager.LagerNotFoundException;
import com.mehrmarkt.mehrmarktsystem.response.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/lager")
@CrossOrigin
public class LagerController {

    @Autowired
    private LagerService lagerService;

    @Transactional
    @PatchMapping("/updateSize/{lagerort}/{maxSize}")
    public ResponseEntity<Object> updateSize(@PathVariable String lagerort, @PathVariable int maxSize){
        if(!lagerService.existsByName(lagerort)){
            return ResponseEntity.badRequest().body("Lager" + lagerort + " existiert nicht!");
        }
        Lager lager = lagerService.getLager(lagerort);
        if(lager.getSize() >= maxSize){
            return ResponseEntity.badRequest().body("Max Size für "+lagerort+" ist kleiner als die Anzahl der Produkte im Lager: " +lager.getSize());
        }
        lagerService.updateMaxSize(lagerort, maxSize);
        return ResponseEntity.ok().body("Änderungen gespeichert");


    }

    @GetMapping("/statistik")
    public ResponseEntity<Object> returnStatistik(){

        List<Lager> lagers = lagerService.getAllLager();
        if(lagers.isEmpty()){
            lagers =new ArrayList<>(Arrays.asList(lagerService.createLager("Aachen")));
        }
        return ResponseHandler.generateLagerStatistics(lagers);
    }

    @PostMapping("/{lagerort}/standardset")
    public ResponseEntity<Object> setLagerOrtAsStandard(@PathVariable String lagerort, @RequestBody Map<String, Boolean> body){

        if(body.get("standard") == null || !body.get("standard")){
            return ResponseEntity.badRequest().body("please use this JSON \n{\n \"standard\" : true\n }");
        }

        Lager lager;
        try {
            lager = lagerService.getLagerIfExists(lagerort).orElseThrow(LagerNotFoundException::new);
        }catch (LagerNotFoundException e){
            return ResponseEntity.notFound().build();
        }
        if (lager.isStandard()){
            return ResponseEntity.ok().build();
        }
        Lager altLager = lagerService.getStandardLager().orElseThrow(LagerNotFoundException::new);
        altLager.setStandard(false);
        lagerService.updateLager(altLager);

        lager.setStandard(true);
        lagerService.updateLager(lager);


        return ResponseEntity.ok().build();
    }

    @GetMapping("/namen")
    public ResponseEntity<Object> getLagerNamen(){
        List<Lager> lagers = lagerService.getAllLager();
        return ResponseHandler.sendLagerNamen(lagers);
    }


}
