package com.mehrmarkt.mehrmarktsystem.Service.produkt;


import com.mehrmarkt.mehrmarktsystem.Repository.LagerProduktRepository;
import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LagerProduktServiceImpl implements LagerProduktService{

    @Autowired
    private LagerProduktRepository lagerProduktRepository;

    @Override
    public LagerProdukt saveProduct(LagerProdukt product) {
        return lagerProduktRepository.save(product);
    }

    @Override
    public List<LagerProdukt> getAllProducts() {
        return lagerProduktRepository.findAll();
    }

    @Override
    public Optional<LagerProdukt> getByEAN(String ean) {
        return lagerProduktRepository.getByEAN(ean);
    }

    @Override
    public List<LagerProdukt> getAllByLagerort(String lagerort) {
        return lagerProduktRepository.getAllByLagerort(lagerort);
    }
}
