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

import java.util.List;

@RestController
@RequestMapping("/lieferant")
public class LieferantController {

    ObjectMapper objectMapper = new ObjectMapper();
    @Autowired
    private LieferantService lieferantService;

    @Autowired
    private ProductService productService;

    @PostMapping
    public String add(@RequestBody Lieferant lieferant){

        List<Product> products = lieferant.getProducts();

        int i = Product.anzahl - products.size();
        for (Product product : products){

            if(product.getEAN() == null) {
                product.setEAN("9673485726" + String.format("%03d", i++));
            }

            if(productService.existsByEAN(product.getEAN())) {
                return "Duplicated EAN nummer\nProdukt: " + product.getName() + ", ean: " + product.getEAN();
            }

        }
        lieferantService.saveLieferant(lieferant);

        return "New Lieferant is added";
    }

    @GetMapping
    public ResponseEntity<Object>  getAllLieferanten(){
        List<Lieferant> lieferanten = lieferantService.getAllLieferanten();
        return ResponseHandler.getLieferanten(lieferanten);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getLieferant(@PathVariable int id){
        try {
            Lieferant lieferant = lieferantService.getById(id).orElseThrow(LieferantNotFoundException::new);
            return ResponseHandler.getLieferant(lieferant);

        } catch (LieferantNotFoundException e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    private Lieferant applyPatchToLieferant(
            JsonPatch patch, Lieferant targetLieferant)
            throws JsonPatchException, JsonProcessingException {

        JsonNode patched = patch.apply(objectMapper.convertValue(targetLieferant, JsonNode.class));
        return objectMapper.treeToValue(patched, Lieferant.class);
    }

    @PatchMapping(path = "/{id}", consumes = {"application/json-patch+json", "application/json"})
    public ResponseEntity<Lieferant> updateLieferant(@PathVariable int id, @RequestBody JsonPatch patch){
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
            Lieferant lieferant2 = lieferantService.getById(id).orElseThrow(LieferantNotFoundException::new);
            lieferant2.setProducts(lieferant.getProducts());
            lieferantService.saveLieferant(lieferant2);
            return ResponseEntity.ok(lieferant);
        } catch (LieferantNotFoundException e){
            return ResponseEntity.notFound().build();
        }



    }
}
