package com.mehrmarkt.mehrmarktsystem.Service.produkt;

import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;

import java.util.List;
import java.util.Optional;

public interface ProductService {

    public Product saveProduct(Product product);
    List <Product> getAllProducts();

    Optional<Product> getByEAN(String ean);
    boolean existsByEAN(String ean);

    boolean existsByEANAndLieferant_IdIsNot(String ean, int lieferant_id);
}
