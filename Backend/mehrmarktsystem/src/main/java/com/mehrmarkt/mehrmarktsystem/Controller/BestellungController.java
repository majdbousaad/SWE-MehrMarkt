package com.mehrmarkt.mehrmarktsystem.Controller;

import com.mehrmarkt.mehrmarktsystem.Service.bestellung.BestellungService;
import com.mehrmarkt.mehrmarktsystem.Service.lager.LagerService;
import com.mehrmarkt.mehrmarktsystem.Service.lieferant.LieferantService;
import com.mehrmarkt.mehrmarktsystem.Service.produkt.LagerProduktService;
import com.mehrmarkt.mehrmarktsystem.Service.produkt.ProductService;
import com.mehrmarkt.mehrmarktsystem.model.bestellung.Bestellung;
import com.mehrmarkt.mehrmarktsystem.model.bestellung.BestellungCannotBeDeletedException;
import com.mehrmarkt.mehrmarktsystem.model.bestellung.BestellungNotFoundException;
import com.mehrmarkt.mehrmarktsystem.model.bestellung.BestellungsStatus;
import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.LieferantNotFoundException;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.LieferantenStatus;
import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;
import com.mehrmarkt.mehrmarktsystem.model.produkt.ProduktNotFoundException;
import com.mehrmarkt.mehrmarktsystem.model.ware.GekaufteWare;
import com.mehrmarkt.mehrmarktsystem.response.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

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

    @PostMapping
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
            Product product;
            try {
                product = productService.getByEAN(gekaufteWare.getProduct().getEAN()).orElseThrow(ProduktNotFoundException::new);
            } catch (ProduktNotFoundException e){
                return ResponseEntity.badRequest().body("Produkt mit EAN: "+ gekaufteWare.getProduct().getEAN()+" existiert nicht");
            }

            gekaufteWare.setProduct(product);
        }


        bestellung.setGesamtPreis(bestellung.calculateGesamtPreis());

        bestellung.setLieferant(lieferant);
        bestellungService.saveBestellung(bestellung);
        return ResponseEntity.ok(bestellung);

    }

    @GetMapping("/anstehend")
    public  ResponseEntity<Object> getAllAnstehendeBestellungen(){
        List<Bestellung> anstehendeBestellungen = bestellungService.getAnstehendeBestellungen();
        return ResponseHandler.sendAllBestellungen(anstehendeBestellungen);
    }
    @GetMapping("/geliefert")
    public  ResponseEntity<Object> getAllGelieferteBestellungen(){
        List<Bestellung> gelieferteBestellungen = bestellungService.getGelieferteBestellungen();
        return ResponseHandler.sendAllBestellungen(gelieferteBestellungen);
    }

    @PostMapping("/{bestellung_id}")
    public ResponseEntity<Object> erhalten(@PathVariable int bestellung_id, @RequestBody Map<String, Boolean> body){

        if(!body.get("angekommen")){
            return ResponseEntity.badRequest().build();
        }
        Bestellung bestellung = bestellungService.getBestellung(bestellung_id);
        if(bestellung == null){
            return ResponseEntity.notFound().build();
        }
        if(bestellung.getBestellungsStatus() != BestellungsStatus.nochNichtErhalten){
            return ResponseEntity.badRequest().body("Bestellung Nummer " + bestellung_id + " ist schon geliefert");
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

        return ResponseHandler.sendBestellung(bestellung);

    }

    @GetMapping("/geliefert/{lieferant_id}")
    List<Bestellung> getGelieferteBestellungen(@PathVariable int lieferant_id){
        return bestellungService.getGelieferteBestellungen(lieferant_id);
    }

    @GetMapping("/{bestellung_id}")
    ResponseEntity<Object> getBestellung(@PathVariable int bestellung_id){
        Bestellung bestellung = bestellungService.getBestellung(bestellung_id);
        if(bestellung == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseHandler.sendBestellung(bestellung);
    }

    @DeleteMapping("/{bestellung_id}")
    ResponseEntity<Object> deleteBestellung(@PathVariable int bestellung_id){
        try {
            bestellungService.storniereBestellung(bestellung_id);
        }
        catch (BestellungNotFoundException e){
            return ResponseEntity.notFound().build();
        } catch (BestellungCannotBeDeletedException e) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok().build();

    }
}
