package com.mehrmarkt.mehrmarktsystem.Service.produkt;

import com.mehrmarkt.mehrmarktsystem.Repository.LieferantRepository;
import com.mehrmarkt.mehrmarktsystem.Repository.ProductRepository;
import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService{

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private LieferantRepository lieferantRepository;

    @Override
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }



    @Override

    public Optional<Product> getByEAN(String ean) {
        return productRepository.getByEAN(ean);
    }

    @Override
    public boolean existsByEAN(String ean) {
        return productRepository.existsByEAN(ean);
    }

    @Override
    public boolean existsByEANAndLieferant_IdIsNot(String ean, int lieferant_id) {
        return productRepository.existsByEANAndLieferant_IdIsNot(ean, lieferant_id);
    }

    @Override
    public Optional<Product> getByEANAndLieferant_Id(String ean, int lieferant_id) {
        return productRepository.getByEANAndLieferant_Id(ean, lieferant_id);
    }

    @Override
    public List<Product> getProdukteBeiLieferant(int lieferant_id) {
        if(!lieferantRepository.existsById(lieferant_id)){
            return null;
        }
        return productRepository.getAllByLieferantId(lieferant_id);
    }


}
