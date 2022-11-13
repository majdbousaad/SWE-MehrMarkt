package com.mehrmarkt.mehrmarktsystem.Service;

import com.mehrmarkt.mehrmarktsystem.model.Product;

import java.util.List;

public interface ProductService {

    public Product saveProduct(Product product);
    List <Product> getAllProducts();

    Product getByEAN(String ean);
}
