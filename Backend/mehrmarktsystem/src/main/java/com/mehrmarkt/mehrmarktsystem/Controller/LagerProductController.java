package com.mehrmarkt.mehrmarktsystem.Controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import com.mehrmarkt.mehrmarktsystem.Service.lager.LagerService;
import com.mehrmarkt.mehrmarktsystem.Service.produkt.LagerProduktService;
import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import com.mehrmarkt.mehrmarktsystem.model.lager.LagerNotFoundException;
import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import com.mehrmarkt.mehrmarktsystem.model.produkt.ProduktNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping("/lagerprodukt")
@RestController
@CrossOrigin

public class LagerProductController {
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private LagerProduktService lagerProduktService;

    @Autowired
    private LagerService lagerService;

    @GetMapping
    public List<LagerProdukt> getAll(){
        return lagerProduktService.getAllProducts();
    }

    @GetMapping("/{ean}")
    public ResponseEntity<LagerProdukt> getLagerProdukt(@PathVariable String ean){
        try {
            return ResponseEntity.ok(lagerProduktService.getByEAN(ean).orElseThrow(ProduktNotFoundException::new));

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/lagerort/{lagerort}")
    public ResponseEntity<Object> getAllByLagerort(@PathVariable String lagerort){
        try {
            Lager lager = lagerService.getLagerIfExists(lagerort).orElseThrow(LagerNotFoundException::new);
            List<LagerProdukt> lagerProdukts = lagerProduktService.getAllByLagerort(lagerort);
            return ResponseEntity.ok(lagerProdukts);
        }catch (LagerNotFoundException e){
            return ResponseEntity.notFound().build();

        }
    }

    @PatchMapping(path = "/{ean}", consumes = {"application/json-patch+json", "application/json"})
    public ResponseEntity<LagerProdukt> updateLagerprodukt(@PathVariable String ean, @RequestBody JsonPatch patch){
        try {

            LagerProdukt lagerProdukt = lagerProduktService.getByEAN(ean).orElseThrow(ProduktNotFoundException::new);
            LagerProdukt lagerProduktPatched = applyPatchToLagerProdukt(patch, lagerProdukt);
            boolean lagerSollAktuallisiert =
                            !lagerProdukt.getLagerort().equals(lagerProduktPatched.getLagerort())
                    ||
                            lagerProdukt.getMenge() != lagerProduktPatched.getMenge()
                    ;
            if (lagerSollAktuallisiert){
                Integer anstehendeMenge = lagerProduktService.getAnstehendeMenge(lagerProdukt.getEAN());
                if(anstehendeMenge == null){
                    anstehendeMenge = 0;
                }
                Lager lagerA = lagerService.getLager(lagerProdukt.getLagerort());
                Lager lagerB = lagerService.getLager(lagerProduktPatched.getLagerort());
                lagerA.setSize(lagerA.getSize() - lagerProdukt.getMenge());
                lagerA.setAnstehendeMenge(lagerA.getAnstehendeMenge() - anstehendeMenge);
                int lagerBNewSize = lagerB.getSize() + lagerProduktPatched.getMenge();
                if(lagerBNewSize > lagerB.getMax()){
                    return ResponseEntity.status(HttpStatus.INSUFFICIENT_STORAGE).build();
                }
                lagerB.setSize(lagerB.getSize() + lagerProduktPatched.getMenge());
                lagerB.setAnstehendeMenge(lagerB.getAnstehendeMenge() + anstehendeMenge);
                lagerService.updateLager(lagerA);
                lagerService.updateLager(lagerB);
            }

            lagerProduktService.saveProduct(lagerProduktPatched);
            return ResponseEntity.ok(lagerProduktPatched);

        }catch (JsonProcessingException | JsonPatchException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (ProduktNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

    }

    @DeleteMapping("/{ean}")
    public ResponseEntity<LagerProdukt> deleteLagerProdukt(@PathVariable String ean){
        Optional<LagerProdukt> lagerProdukt = lagerProduktService.getByEAN(ean);
        if(lagerProdukt.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Lager lager =  lagerProdukt.get().getLager();
        lager.setSize(lager.getSize() - lagerProdukt.get().getMenge());
        lagerProduktService.deleteLagerProdukt(ean);
        lagerService.updateLager(lager);

        return ResponseEntity.ok(lagerProdukt.get());

    }

    private LagerProdukt applyPatchToLagerProdukt(
            JsonPatch patch, LagerProdukt targetLagerProdukt)
            throws JsonPatchException, JsonProcessingException {
        JsonNode patched = patch.apply(objectMapper.convertValue(targetLagerProdukt, JsonNode.class));
        return objectMapper.treeToValue(patched, LagerProdukt.class);
    }




}
