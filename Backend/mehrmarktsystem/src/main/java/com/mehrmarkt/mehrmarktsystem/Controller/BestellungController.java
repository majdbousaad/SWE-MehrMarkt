package com.mehrmarkt.mehrmarktsystem.Controller;

import com.mehrmarkt.mehrmarktsystem.Service.*;
import com.mehrmarkt.mehrmarktsystem.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/bestellung")
public class BestellungController {

    @Autowired
    private BestellungService bestellungService;

    @Autowired
    private LieferantService lieferantService;

    @Autowired
    private ProductService productService;

    @Autowired
    private LagerProduktService lagerProduktService;

    @Autowired
    private LagerService lagerService;

    @PostMapping("/add")
    public String add(@RequestBody Bestellung bestellung){

        Lager lager = lagerService.getLager();
        if(lager == null){
            lager = lagerService.createLager();
        }
        int gesamteMenge = 0;

        List<Bestellung> anstehendeBestellungen = bestellungService.getAnstehendeBestellungen();
        for (Bestellung anstehendeBestellung : anstehendeBestellungen){
            gesamteMenge += anstehendeBestellung.getGesamteMenge();
        }
        gesamteMenge += bestellung.getGesamteMenge();

        if(lager.getSize() + gesamteMenge > lager.getMax()){
            return "Lager ist ausgelastet";
        }
        for (Ware ware : bestellung.getWaren()){
            Product product = productService.getByEAN(ware.getProduct().getEAN());
            ware.setProduct(product);
        }


        bestellung.setGesamtPreis(bestellung.calculateGesamtPreis());

        bestellung.setLieferant(
                lieferantService.getById(bestellung.getLieferant().getId())
        );
        bestellung.calculateVors_lieferdatum();
        bestellungService.saveBestellung(bestellung);
        return "New Bestellung is added";
    }

    @GetMapping("/all")
    public List<Bestellung> getAllBestellungen(){
        return bestellungService.getAllBestellungen();
    }
}
