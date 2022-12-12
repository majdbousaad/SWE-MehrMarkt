package com.mehrmarkt.mehrmarktsystem.Service.produkt;


import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;

import java.util.List;
import java.util.Optional;

public interface LagerProduktService {
    
    public LagerProdukt saveProduct(LagerProdukt product);
    List<LagerProdukt> getAllProducts();

    Optional<LagerProdukt> getByEAN(String ean);

    List<LagerProdukt> getAllByLagerort(String lagerort);

    void deleteLagerProdukt(String ean);

    boolean existsByEAN(String ean);

    Integer getAnstehendeMenge(String ean);

    List<LagerProdukt> searchLagerProdukte(String text);

}
