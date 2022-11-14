package com.mehrmarkt.mehrmarktsystem.Service.produkt;


import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;

import java.util.List;

public interface LagerProduktService {
    
    public LagerProdukt saveProduct(LagerProdukt product);
    List<LagerProdukt> getAllProducts();

    LagerProdukt getByEAN(String ean);
}
