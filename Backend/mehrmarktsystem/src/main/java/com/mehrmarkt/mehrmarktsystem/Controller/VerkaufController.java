package com.mehrmarkt.mehrmarktsystem.Controller;

import com.mehrmarkt.mehrmarktsystem.Service.lager.LagerService;
import com.mehrmarkt.mehrmarktsystem.Service.produkt.LagerProduktService;
import com.mehrmarkt.mehrmarktsystem.Service.verkauf.VerkaufService;
import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import com.mehrmarkt.mehrmarktsystem.model.produkt.ProduktNotFoundException;
import com.mehrmarkt.mehrmarktsystem.model.verkauf.Verkauf;
import com.mehrmarkt.mehrmarktsystem.model.ware.VerkaufteWare;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/verkauf")
public class VerkaufController {

    @Autowired
    private LagerProduktService lagerProduktService;
    @Autowired
    private LagerService lagerService;

    @Autowired
    private VerkaufService verkaufService;

    @PostMapping("/add")
    public String add(@RequestBody Verkauf verkauf){


        Set<Lager> lagers = new HashSet<>();
        for (VerkaufteWare ware : verkauf.getVerkaufteWaren()){
            if(ware.getMenge() <= 0){
                return "ware Menge <= 0";
            }
            LagerProdukt verkauftesProdukt = lagerProduktService.getByEAN(ware.getLagerProdukt().getEAN()).orElseThrow(ProduktNotFoundException::new);
            if(verkauftesProdukt == null){
                return "Produkt existiert nicht";
            }
            if(verkauftesProdukt.getMenge() < ware.getMenge()){
                return "zu wenige Produkte im Lager";
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


        return "Produkte wurden erfolgreich verkauft";

    }
}
