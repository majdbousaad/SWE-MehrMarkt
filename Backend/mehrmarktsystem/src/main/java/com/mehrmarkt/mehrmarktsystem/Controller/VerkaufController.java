package com.mehrmarkt.mehrmarktsystem.Controller;

import com.mehrmarkt.mehrmarktsystem.Service.lager.LagerService;
import com.mehrmarkt.mehrmarktsystem.Service.produkt.LagerProduktService;
import com.mehrmarkt.mehrmarktsystem.Service.verkauf.VerkaufService;
import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import com.mehrmarkt.mehrmarktsystem.model.produkt.ProduktNotFoundException;
import com.mehrmarkt.mehrmarktsystem.model.verkauf.Verkauf;
import com.mehrmarkt.mehrmarktsystem.model.verkauf.VerkaufNotFoundException;
import com.mehrmarkt.mehrmarktsystem.model.ware.VerkaufteWare;
import com.mehrmarkt.mehrmarktsystem.response.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/verkauf")
@CrossOrigin

public class VerkaufController {

    @Autowired
    private LagerProduktService lagerProduktService;
    @Autowired
    private LagerService lagerService;

    @Autowired
    private VerkaufService verkaufService;

    @PostMapping
    public ResponseEntity<Object> add(@RequestBody Verkauf verkauf){


        Set<Lager> lagers = new HashSet<>();
        if(verkauf.getVerkaufteWaren() == null){
            return ResponseEntity.badRequest().body("Es gibt keinen Warenkorb");
        }
        for (VerkaufteWare ware : verkauf.getVerkaufteWaren()){
            if(ware.getMenge() <= 0){
                return ResponseEntity.badRequest().body("menge muss größer 0 sein");
            }
            LagerProdukt verkauftesProdukt;
            try {
                verkauftesProdukt = lagerProduktService.getByEAN(ware.getLagerProdukt().getEAN()).orElseThrow(ProduktNotFoundException::new);

            }catch (ProduktNotFoundException e){
                return ResponseEntity.badRequest().body("Produkt existiert nicht");
            }
            if(verkauftesProdukt.getMenge() < ware.getMenge()){
                return ResponseEntity.badRequest().body("zu wenige Produkte im Lager");
            }
            ware.setLagerProdukt(verkauftesProdukt);
            Lager lager= verkauftesProdukt.getLager();

            lager.verkaufLagerProdukt(verkauftesProdukt, ware.getMenge());
            lagers.add(lager);
        }

        verkauf.setGesamtPreis(verkauf.calculateGesamtPreis());

        verkaufService.saveVerkauf(verkauf);
        for (Lager lager:
             lagers) {
            lagerService.updateLager(lager);
        }


        return ResponseEntity.ok(verkauf);

    }

    @GetMapping
    public ResponseEntity<Object> getAllVerkaeufe(){
        List<Verkauf> verkaufs = verkaufService.getAllVerkaufen();

        return ResponseHandler.sendAllVerkaeufe(verkaufs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getVerkauf(@PathVariable int id){
        Verkauf verkauf;
        try {
            verkauf = verkaufService.getVerkauf(id).orElseThrow(VerkaufNotFoundException::new);
            return ResponseHandler.sendVerkauf(verkauf);
        }catch (VerkaufNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/anzahlverkaeufe")
    public ResponseEntity<Object> getAnzahlVerkaufe(){

        LocalDateTime beginn = LocalDateTime.now()
                .withHour(0).withMinute(0).withSecond(0);
        LocalDateTime end = beginn.plusDays(1);

        Integer anzahl = verkaufService.getAnzahlVerkaeufe(beginn, end);
        if(anzahl == null){
            anzahl = 0;
        }
        Map<String, Integer> map = new HashMap<>();
        map.put("anzahl", anzahl);
        return ResponseEntity.ok(map);


    }

    @GetMapping("/beliebsteProdukte")
    public ResponseEntity<Object> getBeliebsteProdukte(){
        Object beliebsteProdukte = verkaufService.getBeliebsteProdukte();
        return ResponseHandler.send10BeliebsteProdukte(beliebsteProdukte);
    }
}
