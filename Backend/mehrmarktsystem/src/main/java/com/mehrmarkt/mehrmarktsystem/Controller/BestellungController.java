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
import com.mehrmarkt.mehrmarktsystem.model.lieferant.LieferantNotFoundException;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.LieferantenStatus;
import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;
import com.mehrmarkt.mehrmarktsystem.model.ware.GekaufteWare;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Object> add(@RequestBody Bestellung bestellung){
        Lieferant lieferant;
        try {
             lieferant = lieferantService.getById(bestellung.getLieferant().getId()).orElseThrow(LieferantNotFoundException::new);

        } catch (LieferantNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if(lieferant.getStatus() == LieferantenStatus.inaktiv){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lieferant " + lieferant.getName() + " ist inaktiv");
        }
        Lager lager = lagerService.getLager("Aachen");

        int vslLagerSize = lager.getSize() + bestellungService.getGesamteAnstehendeMenge();
        if( vslLagerSize > lager.getMax()){
            return ResponseEntity.badRequest().body("Lager "+ lager.getName()+" ist ausgelastet");
        }
        for (GekaufteWare gekaufteWare : bestellung.getWaren()){
            vslLagerSize += gekaufteWare.getMenge();
            if( vslLagerSize > lager.getMax()){
                return ResponseEntity.badRequest().body("Lager "+ lager.getName()+" ist ausgelastet");
            }
            Product product = productService.getByEAN(gekaufteWare.getProduct().getEAN());
            if(product == null){
                return ResponseEntity.badRequest().body("Produkt: "+ gekaufteWare.getProduct().getName()+" existiert nicht");
            }
            gekaufteWare.setProduct(product);
        }


        bestellung.setGesamtPreis(bestellung.calculateGesamtPreis());

        bestellung.setLieferant(
                lieferantService.getById(bestellung.getLieferant().getId()).get()
        );
        bestellungService.saveBestellung(bestellung);
        return ResponseEntity.ok(bestellung);

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
