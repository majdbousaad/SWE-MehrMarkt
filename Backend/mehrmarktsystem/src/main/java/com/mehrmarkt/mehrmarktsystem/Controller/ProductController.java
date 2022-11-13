package com.mehrmarkt.mehrmarktsystem.Controller;


import com.mehrmarkt.mehrmarktsystem.Service.lieferant.LieferantService;
import com.mehrmarkt.mehrmarktsystem.Service.produkt.ProductService;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;
import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private LieferantService lieferantService;

    @PostMapping("/add")
    public String add(@RequestBody Product product){
        productService.saveProduct(product);

        return "New Product is added";
    }

    @GetMapping("/all")
    public List<Product> getAll(){
        return productService.getAllProducts();
    }

    @PostMapping("/assignToLieferant/{lieferant_id}")
    public String assignToLieferant(@RequestBody List<Product> products, @PathVariable int lieferant_id){

        Lieferant lieferant = lieferantService.getById(lieferant_id);
        lieferant.getProducts().addAll(products);

        lieferantService.saveLieferant(lieferant);

        return "Adding Product " + products.get(0).getName() + " to Lieferant " + lieferant.getName();
    }


}
