package com.mehrmarkt.mehrmarktsystem.Controller;


import com.mehrmarkt.mehrmarktsystem.Service.ProductService;
import com.mehrmarkt.mehrmarktsystem.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public String add(@RequestBody Product product){
        productService.saveProduct(product);

        return "New Product is added";
    }

    @GetMapping("/all")
    public List<Product> getAll(){
        return productService.getAllProducts();
    }


}
