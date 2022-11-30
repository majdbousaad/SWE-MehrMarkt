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
import com.mehrmarkt.mehrmarktsystem.model.lager.LagerAusgelastetException;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.LieferantInactivException;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.LieferantNotFoundException;
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
        lagerService.initializeLagerIfNotInitialized();

        String produktEAN = null;
        Lager lager = null;
        int lieferantId = bestellung.getLieferant().getId();
        Lieferant lieferant = null;
       try {
           lieferant = lieferantService.getById(lieferantId).orElseThrow(LieferantNotFoundException::new);
           Lager standardLager = lagerService.getStandardLager().get();

           Set<Lager> lagersToBeUpdated = new HashSet<>();
           Product lieferantProduct;
           for (GekaufteWare gekaufteWare : bestellung.getWaren()){
               Optional<LagerProdukt> lagerProdukt = lagerProduktService.getByEAN(gekaufteWare.getProduct().getEAN());
               if(lagerProdukt.isPresent()){
                   lager = lagerProdukt.get().getLager();
               }else {
                   lager = standardLager;
               }
               lager.setAnstehendeMenge(lager.getAnstehendeMenge() + gekaufteWare.getMenge());
               lagersToBeUpdated.add(lager);
               produktEAN =  gekaufteWare.getProduct().getEAN();
               lieferantProduct = productService.
                       getByEANAndLieferant_Id(produktEAN, lieferantId).
                       orElseThrow(ProduktNotFoundException::new);

               gekaufteWare.setProduct(lieferantProduct);
           }


           bestellung.setGesamtPreis(bestellung.calculateGesamtPreis());

           bestellung.setLieferant(lieferant);
           bestellung.setStatus(bestellung.getBestellungsStatus());
           bestellungService.saveBestellung(bestellung);
           for (Lager l :
                   lagersToBeUpdated) {
               lagerService.updateLager(l);
           }

           return ResponseEntity.ok(bestellung);
       } catch (LieferantNotFoundException e){
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lieferant mit ID "+ lieferantId + " existiert nicht");

       } catch (LieferantInactivException e){
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lieferant "+ lieferant.getName() +" ist inaktiv");

       }catch (LagerAusgelastetException e){
           return ResponseEntity.badRequest().body("Lager "+ lager.getName()+ " ist ausgelastet");

       }catch (ProduktNotFoundException e){
           return ResponseEntity.badRequest().body("Produkt mit EAN: "+ produktEAN+" existiert nicht");
       }




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
        bestellung.setStatus(bestellung.getBestellungsStatus());
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
        double zuverlaessigKeitQuote = lieferantService.getZuverlaessigkeit(lieferant.getId());
        if(zuverlaessigKeitQuote >= 30)
            lieferant.setZuverlaessig(false);
        else
            lieferant.setZuverlaessig(true);
        System.out.println(zuverlaessigKeitQuote + "%");
        lieferantService.saveLieferant(lieferant);

        Lager defaultLager = lagerService.getStandardLager().get();

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
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bestellung Nummer " + bestellung_id + " existiert nicht");
        } catch (BestellungCannotBeDeletedException e) {
            return ResponseEntity.badRequest().body("Bestellung Nummer "+bestellung_id+" ist schon geliefert und kann nicht storniert werden");
        }

        return ResponseEntity.ok().build();

    }
}
