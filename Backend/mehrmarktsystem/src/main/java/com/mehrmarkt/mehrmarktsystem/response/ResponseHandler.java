package com.mehrmarkt.mehrmarktsystem.response;

import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

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
        map.put("gesamt", maxSize * 100/maxMax);

        return new ResponseEntity<Object>(map, HttpStatus.OK);
    }
}