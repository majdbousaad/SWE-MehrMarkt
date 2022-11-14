package com.mehrmarkt.mehrmarktsystem.Service.produkt;

import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;

import java.util.List;

public interface ProductService {

    public Product saveProduct(Product product);
    List <Product> getAllProducts();

    Product getByEAN(String ean);
}
