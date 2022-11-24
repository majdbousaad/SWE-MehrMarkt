package com.mehrmarkt.mehrmarktsystem.Controller;

import com.mehrmarkt.mehrmarktsystem.Service.bestellung.BestellungService;
import com.mehrmarkt.mehrmarktsystem.Service.lager.LagerService;
import com.mehrmarkt.mehrmarktsystem.Service.lieferant.LieferantService;
import com.mehrmarkt.mehrmarktsystem.Service.produkt.LagerProduktService;
import com.mehrmarkt.mehrmarktsystem.Service.produkt.ProductService;
import com.mehrmarkt.mehrmarktsystem.model.bestellung.Bestellung;
import com.mehrmarkt.mehrmarktsystem.model.bestellung.BestellungsStatus;
import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;
import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;
import com.mehrmarkt.mehrmarktsystem.model.produkt.ProduktNotFoundException;
import com.mehrmarkt.mehrmarktsystem.model.ware.GekaufteWare;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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

        Lager lager = lagerService.getLager("Aachen");

        int vslLagerSize = lager.getSize() + bestellungService.getGesamteAnstehendeMenge();
        if( vslLagerSize > lager.getMax()){
            return "Lager ist ausgelastet";
        }
        for (GekaufteWare gekaufteWare : bestellung.getWaren()){
            vslLagerSize += gekaufteWare.getMenge();
            if( vslLagerSize > lager.getMax()){
                return "Lager ist ausgelastet";
            }
            Product product = productService.getByEAN(gekaufteWare.getProduct().getEAN());
            if(product == null){
                return "Produkt existiert nicht";
            }
            gekaufteWare.setProduct(product);
        }


        bestellung.setGesamtPreis(bestellung.calculateGesamtPreis());

        bestellung.setLieferant(
                lieferantService.getById(bestellung.getLieferant().getId())
        );
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
        if(bestellung == null){
            return "Bestellung existiert nicht";
        }
        if(bestellung.getBestellungsStatus() != BestellungsStatus.nochNichtErhalten){
            return "Diese Bestellung ist schon da";
        }


        LocalDateTime now = LocalDateTime.now();
        bestellung.setTatsLieferdatum(now);
        bestellungService.saveBestellung(bestellung);

        Lieferant lieferant = bestellung.getLieferant();

        Integer n = bestellungService.countGelieferteBestellungen(lieferant.getId());
        Duration currentBestellungLieferZeit = Duration.between(bestellung.getBestellungsdatum(), bestellung.getTatsLieferdatum());

        Duration mittel = (lieferant.getLieferzeit() == null)
                ?
                currentBestellungLieferZeit
                :
                lieferant.getLieferzeit()
                .multipliedBy(n - 1)
                .plus(currentBestellungLieferZeit)
                        .dividedBy(n);

        try {
            mittel.toNanos();
        } catch (RuntimeException e){
            mittel = lieferant.getLieferzeit();
        }
        lieferant.setLieferzeit(mittel);
        lieferantService.saveLieferant(lieferant);

        Lager defaultLager = lagerService.getLager("Aachen");

        Set<Lager> lagers = new HashSet<>();

        for (GekaufteWare gekaufteWare : bestellung.getWaren()){
            Optional<LagerProdukt> lagerProdukt = lagerProduktService.getByEAN(gekaufteWare.getProduct().getEAN());
            Lager lager;
            if(lagerProdukt.isPresent()){
                lager = lagerService.getLager(lagerProdukt.get().getLagerort());
            } else {
                lager = defaultLager;
            }
            lager.addNewLagerProdukt(gekaufteWare.getProduct(), gekaufteWare.getMenge(), lager);
            lagers.add(lager);
        }

        for (Lager lager :
                lagers) {
            lagerService.updateLager(lager);
        }

        return "Bestellung erhalten. Lager ist aktualisiert";

    }

    @GetMapping("/geliefert/{lieferant_id}")
    List<Bestellung> getGelieferteBestellungen(@PathVariable int lieferant_id){
        return bestellungService.getGelieferteBestellungen(lieferant_id);
    }
}
