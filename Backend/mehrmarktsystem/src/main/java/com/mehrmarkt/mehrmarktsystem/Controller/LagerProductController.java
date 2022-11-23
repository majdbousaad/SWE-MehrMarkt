package com.mehrmarkt.mehrmarktsystem.Controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import com.mehrmarkt.mehrmarktsystem.Service.produkt.LagerProduktService;
import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import com.mehrmarkt.mehrmarktsystem.model.produkt.ProduktNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class LagerProductController {
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private LagerProduktService lagerProduktService;

    @GetMapping("/lagerprodukt")
    public List<LagerProdukt> getAll(){
        return lagerProduktService.getAllProducts();
    }

    @GetMapping("/lagerprodukt/{ean}")
    public ResponseEntity<LagerProdukt> getLagerProdukt(@PathVariable String ean){
        try {
            return ResponseEntity.ok(lagerProduktService.getByEAN(ean).orElseThrow(ProduktNotFoundException::new));

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/lagerprodukt/lagerort/{lagerort}")
    public List<LagerProdukt> getAllByLagerort(@PathVariable String lagerort){
        return lagerProduktService.getAllByLagerort(lagerort);
    }

    @PatchMapping(path = "/lagerprodukt/{ean}", consumes = {"application/json-patch+json", "application/json"})
    public ResponseEntity<LagerProdukt> updateLagerprodukt(@PathVariable String ean, @RequestBody JsonPatch patch){
        LagerProdukt lagerProdukt;
        try {
            lagerProdukt = lagerProduktService.getByEAN(ean).orElseThrow(ProduktNotFoundException::new);
            LagerProdukt lagerProduktPatched = applyPatchToCustomer(patch, lagerProdukt);
            lagerProduktService.saveProduct(lagerProduktPatched);
            return ResponseEntity.ok(lagerProduktPatched);

        }catch (JsonProcessingException | JsonPatchException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (ProduktNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

    }

    private LagerProdukt applyPatchToCustomer(
            JsonPatch patch, LagerProdukt targetLagerProdukt)
            throws JsonPatchException, JsonProcessingException {
        JsonNode patched = patch.apply(objectMapper.convertValue(targetLagerProdukt, JsonNode.class));
        return objectMapper.treeToValue(patched, LagerProdukt.class);
    }




}
