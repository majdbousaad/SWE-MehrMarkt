package com.mehrmarkt.mehrmarktsystem.Service;

import com.mehrmarkt.mehrmarktsystem.Repository.ProductRepository;
import com.mehrmarkt.mehrmarktsystem.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements ProductService{

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
}
