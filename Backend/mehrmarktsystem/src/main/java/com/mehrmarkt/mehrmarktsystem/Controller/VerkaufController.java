package com.mehrmarkt.mehrmarktsystem.Controller;

import com.mehrmarkt.mehrmarktsystem.Service.lager.LagerService;
import com.mehrmarkt.mehrmarktsystem.Service.produkt.LagerProduktService;
import com.mehrmarkt.mehrmarktsystem.Service.verkauf.VerkaufService;
import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import com.mehrmarkt.mehrmarktsystem.model.verkauf.Verkauf;
import com.mehrmarkt.mehrmarktsystem.model.ware.VerkaufteWare;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

        Lager lager = lagerService.getLager();

        if(!lager.checkVerkauf(verkauf)) {
            return "Fehler im Verkauf, Entweder Produkt ist nicht da oder menge ist zu groß";
        }

        for (VerkaufteWare ware : verkauf.getVerkaufteWaren()){

            LagerProdukt verkauftesProdukt = lagerProduktService.getByEAN(ware.getLagerProdukt().getEAN());
            ware.setLagerProdukt(verkauftesProdukt);

            lager.verkaufLagerProdukt(verkauftesProdukt, ware.getMenge());
        }

        verkauf.setGesamtPreis(verkauf.calculateGesamtPreis());

        verkaufService.saveVerkauf(verkauf);
        lagerService.updateLager(lager);

        return "Produkte wurden erfolgreich verkauft";

    }
}
