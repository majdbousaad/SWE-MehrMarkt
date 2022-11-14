package com.mehrmarkt.mehrmarktsystem.Controller;

import com.mehrmarkt.mehrmarktsystem.Service.bestellung.BestellungService;
import com.mehrmarkt.mehrmarktsystem.Service.lager.LagerService;
import com.mehrmarkt.mehrmarktsystem.Service.lieferant.LieferantService;
import com.mehrmarkt.mehrmarktsystem.Service.produkt.LagerProduktService;
import com.mehrmarkt.mehrmarktsystem.Service.produkt.ProductService;
import com.mehrmarkt.mehrmarktsystem.model.bestellung.Bestellung;
import com.mehrmarkt.mehrmarktsystem.model.bestellung.BestellungsStatus;
import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;
import com.mehrmarkt.mehrmarktsystem.model.ware.GekaufteWare;
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
        for (GekaufteWare gekaufteWare : bestellung.getWaren()){
            Product product = productService.getByEAN(gekaufteWare.getProduct().getEAN());
            gekaufteWare.setProduct(product);
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

    @PatchMapping("/{bestellung_id}/erhalten")
    public String erhalten(@PathVariable int bestellung_id){
        Bestellung bestellung = bestellungService.getBestellung(bestellung_id);
        if(bestellung.getBestellungsStatus() != BestellungsStatus.nochNichtErhalten){
            return "Diese Bestellung ist schon da";
        }
        if(bestellung != null){
            LocalDateTime now = LocalDateTime.now();
            bestellung.setTatsLieferdatum(now);
            bestellungService.saveBestellung(bestellung);
            Lager lager = lagerService.getLager();

            if(lager == null){
                 lager = lagerService.createLager();
            }

            for (GekaufteWare gekaufteWare : bestellung.getWaren()){
                lager.addNewLagerProdukt(gekaufteWare.getProduct(), gekaufteWare.getMenge());
            }
            lagerService.updateLager(lager);
            return "Bestellung erhalten. Lager ist aktualisiert";


        }
        return "Bestellung existiert nicht";
    }
}
