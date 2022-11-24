package com.mehrmarkt.mehrmarktsystem.response;

import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.LieferantenStatus;
import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;
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

    public static ResponseEntity<Object> getLieferanten(Object responseObj){
        List<Map<String, Object>> listMap = new ArrayList<>();
        List<Lieferant> lieferanten = (List<Lieferant>) responseObj;

        for (Lieferant lieferant :
                lieferanten) {

            listMap.add(parseLieferant(lieferant));
        }

        return new ResponseEntity<Object>(listMap, HttpStatus.OK);
    }

    public static ResponseEntity<Object> getLieferant(Object responseObj){

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
}