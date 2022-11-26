package com.mehrmarkt.mehrmarktsystem.Controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import com.mehrmarkt.mehrmarktsystem.Service.lieferant.LieferantService;
import com.mehrmarkt.mehrmarktsystem.Service.produkt.ProductService;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.LieferantNotFoundException;
import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;
import com.mehrmarkt.mehrmarktsystem.response.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityExistsException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/lieferant")
@CrossOrigin
public class LieferantController {

    ObjectMapper objectMapper = new ObjectMapper();
    @Autowired
    private LieferantService lieferantService;

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<Object> add(@RequestBody Lieferant lieferant){

        List<Product> products = lieferant.getProducts();
        Set<Product> uniqueProducts = new HashSet<>();

        for (Product product : products){
            if(!uniqueProducts.add(product)){
                return ResponseEntity.badRequest().body("Mehrere Produkte mit gleicher EAN: " + product.getEAN());
            }

            if(productService.existsByEAN(product.getEAN())) {
                return ResponseEntity.badRequest().body("Produkt " + product.getName() + " mit EAN  " + product.getEAN() + " existiert schon");
            }

        }
        try {
            lieferantService.saveLieferant(lieferant);
        } catch (EntityExistsException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }


        return ResponseHandler.sendLieferant(lieferant);
    }

    @GetMapping
    public ResponseEntity<Object>  getAllLieferanten(){
        List<Lieferant> lieferanten = lieferantService.getAllLieferanten();
        return ResponseHandler.sendAllLieferanten(lieferanten);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getLieferant(@PathVariable int id){
        try {
            Lieferant lieferant = lieferantService.getById(id).orElseThrow(LieferantNotFoundException::new);
            return ResponseHandler.sendLieferant(lieferant);

        } catch (LieferantNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lieferant mit ID " + id + " existiert nicht");
        }
    }

    private Lieferant applyPatchToLieferant(
            JsonPatch patch, Lieferant targetLieferant)
            throws JsonPatchException, JsonProcessingException {

        JsonNode patched = patch.apply(objectMapper.convertValue(targetLieferant, JsonNode.class));
        return objectMapper.treeToValue(patched, Lieferant.class);
    }

    @PatchMapping(path = "/{id}", consumes = {"application/json-patch+json", "application/json"})
    public ResponseEntity<Object> updateLieferant(@PathVariable int id, @RequestBody JsonPatch patch){
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);


        try {
            Lieferant lieferant = lieferantService.getById(id).orElseThrow(LieferantNotFoundException::new);
            Lieferant lieferantPatched = applyPatchToLieferant(patch, lieferant);

            lieferantPatched.setProducts(lieferant.getProducts());
            lieferantService.saveLieferant(lieferantPatched);
            return ResponseEntity.ok(lieferantPatched);


        }catch (JsonProcessingException | JsonPatchException e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (LieferantNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> editLieferant(@PathVariable int id, @RequestBody Lieferant lieferant){
        try {
            Set<Product> uniqueProducts = new HashSet<>();

            for (Product product:
                    lieferant.getProducts()) {

                if(productService.existsByEANAndLieferant_IdIsNot(product.getEAN(), id)) {
                    return ResponseEntity.badRequest().body("Produkt mit EAN  " + product.getEAN() + " existiert schon");
                }
                if(!uniqueProducts.add(product)){
                    return ResponseEntity.badRequest().body("Mehrere Produkte mit gleicher EAN: " + product.getEAN());
                }
            }
            Lieferant newLieferant = lieferantService.getById(id).orElseThrow(LieferantNotFoundException::new);
            newLieferant.setProducts(lieferant.getProducts());
            lieferantService.saveLieferant(newLieferant);
            return ResponseEntity.ok(newLieferant);
        } catch (LieferantNotFoundException e){
            return ResponseEntity.notFound().build();
        }



    }
}
