package com.mehrmarkt.mehrmarktsystem.Controller;


import com.mehrmarkt.mehrmarktsystem.Service.lieferant.LieferantService;
import com.mehrmarkt.mehrmarktsystem.Service.produkt.ProductService;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;
import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/lieferant")
public class LieferantController {

    @Autowired
    private LieferantService lieferantService;

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
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

    @GetMapping("/all")
    public List<Lieferant> getAllLieferanten(){
        return lieferantService.getAllLieferanten();
    }
}
