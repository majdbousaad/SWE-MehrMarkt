package com.mehrmarkt.mehrmarktsystem.response;

import com.mehrmarkt.mehrmarktsystem.model.bestellung.Bestellung;
import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.LieferantenStatus;
import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;
import com.mehrmarkt.mehrmarktsystem.model.verkauf.Verkauf;
import com.mehrmarkt.mehrmarktsystem.model.ware.GekaufteWare;
import com.mehrmarkt.mehrmarktsystem.model.ware.VerkaufteWare;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ResponseHandler {
    public static ResponseEntity<Object> generateLagerStatistics(Object responseObj) {
        Map<String, Object> map = new HashMap<String, Object>();
        List<Lager> lagers = (List<Lager>) responseObj;

        int maxSize = 0;
        int maxMax = 0;
        for (Lager lager :
                lagers) {
            map.put(lager.getName(), lager.getSize() * 100/ lager.getMax());
            maxMax += lager.getMax();
            maxSize += lager.getSize();
        }
        map.put("total", maxSize * 100/maxMax);

        return new ResponseEntity<Object>(map, HttpStatus.OK);
    }

    public static ResponseEntity<Object> sendAllLieferanten(Object responseObj){
        List<Map<String, Object>> listMap = new ArrayList<>();
        List<Lieferant> lieferanten = (List<Lieferant>) responseObj;

        for (Lieferant lieferant :
                lieferanten) {

            listMap.add(parseLieferant(lieferant));
        }

        return new ResponseEntity<Object>(listMap, HttpStatus.OK);
    }

    public static ResponseEntity<Object> sendLieferant(Object responseObj){

        Lieferant lieferant = (Lieferant) responseObj;
        Map<String, Object> lieferantMap = parseLieferant(lieferant);
        List<Map<String, Object>> productMap = new ArrayList<>();
        for (Product product :
               lieferant.getProducts()) {
            productMap.add(parseProdukt(product));
        }
        lieferantMap.put("products", productMap);

        return new ResponseEntity<Object>(lieferantMap, HttpStatus.OK);
    }

    public static ResponseEntity<Object> sendBestellung(Object responseObj){

        Bestellung bestellung = (Bestellung) responseObj;
        Map<String, Object> bestellungMap = parseBestellung(bestellung);

        bestellungMap.put("gesamtPreis", bestellung.getGesamtPreis());
        List<Map<String, Object>> mapWaren = new ArrayList<>();
        for (GekaufteWare gekaufteWare :
                bestellung.getWaren()) {

            mapWaren.add(parseWare(gekaufteWare));
        }
        bestellungMap.put("products", mapWaren);

        return new ResponseEntity<Object>(bestellungMap, HttpStatus.OK);
    }

    public static ResponseEntity<Object> sendAllBestellungen(Object responseObj){

        List<Bestellung> bestellungen = (List<Bestellung>) responseObj;
        List<Map<String, Object>> listMap = new ArrayList<>();

        for (Bestellung bestellung :
                bestellungen) {

            listMap.add(parseBestellung(bestellung));
        }

        return new ResponseEntity<Object>(listMap, HttpStatus.OK);
    }

    private static Map<String, Object> parseLieferant(Lieferant lieferant){
        Map<String, Object> map=new HashMap<>();
        Duration lieferzeit = (lieferant.getLieferzeit() == null)?
                Duration.ZERO : lieferant.getLieferzeit();
        map.put("name", lieferant.getName());
        map.put("address", lieferant.getAdresse());
        map.put("contact", lieferant.getContact());
        map.put("deliveryTime", lieferzeitFrontend(lieferzeit)
                /*Map.of("day",lieferzeit.toDaysPart(),
                "hour", lieferzeit.toHoursPart(),
                "miniute",  lieferzeit.toMinutesPart(),
                "second", lieferzeit.toSecondsPart())*/);
        map.put("status", lieferant.getStatus() == LieferantenStatus.aktiv);
        map.put("reliable", lieferant.isZuverlaessig());
        return map;
    }

    private static Map<String, Object> parseProdukt(Product product){
        Map<String, Object> map=new HashMap<>();
        map.put("kacper", "hahaha(Test)");
        map.put("ean", product.getEAN());
        map.put("name", product.getName());
        map.put("price", product.getPreis());

        return map;
    }

    private static String lieferzeitFrontend(Duration lieferzeit){
        String parsed = "";

        if(lieferzeit.toDaysPart() > 0){
            parsed += lieferzeit.toDaysPart() + "T  ";
        }
        if(lieferzeit.toHoursPart() > 0){
            parsed += lieferzeit.toHoursPart() + "St  ";
        }
        if(lieferzeit.toMinutesPart() > 0){
            parsed += lieferzeit.toMinutesPart() + "M  ";
        }
        if(lieferzeit.toSecondsPart() > 0){
            parsed += lieferzeit.toSecondsPart() + "S  ";
        }

        return  parsed;
    }

    private static Map<String, Object> parseBestellung(Bestellung bestellung){
        Map<String, Object> map=new HashMap<>();

        map.put("id", bestellung.getId());
        map.put("lieferant", bestellung.getLieferant().getName());
        map.put("vsl", bestellung.getVslLieferdatum());
        map.put("tats", bestellung.getTatsLieferdatum());
        return map;
    }

    private static Map<String, Object> parseWare(GekaufteWare gekaufteWare){
        Map<String, Object> map=new HashMap<>();

        map.put("name", gekaufteWare.getProduct().getName());
        map.put("price", gekaufteWare.getProduct().getPreis());
        map.put("menge", gekaufteWare.getMenge());

        return map;
    }

    private static Map<String, Object> parseWare(VerkaufteWare verkaufteWare){
        Map<String, Object> map=new HashMap<>();

        map.put("name", verkaufteWare.getLagerProdukt().getName());
        map.put("price", verkaufteWare.getLagerProdukt().getPreis());
        map.put("menge", verkaufteWare.getMenge());

        return map;
    }

    private static Map<String, Object> parseVerkauf(Verkauf verkauf){
        Map<String, Object> map=new HashMap<>();

        map.put("Datum", verkauf.getVerkaufsdatum());
        map.put("id", verkauf.getId());
        map.put("gesamtPreis", verkauf.getGesamtPreis());

        return map;
    }

    public static ResponseEntity<Object> sendAllVerkaeufe(List<Verkauf> verkaeufe){
        List<Map<String, Object>> listMap = new ArrayList<>();

        for (Verkauf verkauf :
                verkaeufe) {
            listMap.add(parseVerkauf(verkauf));
        }

        return ResponseEntity.ok(listMap);
    }

    public static ResponseEntity<Object> sendVerkauf(Verkauf verkauf){
        Map<String, Object> map = parseVerkauf(verkauf);

        List<Map<String, Object>> verkaufteWarenMap = new ArrayList<>();

        for (VerkaufteWare verkaufteWare :
                verkauf.getVerkaufteWaren()) {
            verkaufteWarenMap.add(parseWare(verkaufteWare));
        }

        map.put("products", verkaufteWarenMap);

        return ResponseEntity.ok(map);
    }

    public static ResponseEntity<Object> send10BeliebsteProdukte(Object data){


        return ResponseEntity.ok(data);
    }

    public static ResponseEntity<Object> sendLagerNamen(List<Lager> lagers){
        List<Map<String, Object>> list = new ArrayList<>();
        for (Lager lager :
                lagers) {
            list.add(parseLager(lager));
        }

        return ResponseEntity.ok(list);
    }

    private static Map<String, Object> parseLager(Lager lager){
        Map<String, Object> map = new HashMap<>();
        map.put("name", lager.getName());
        map.put("standard", lager.isStandard());

        return map;
    }

}