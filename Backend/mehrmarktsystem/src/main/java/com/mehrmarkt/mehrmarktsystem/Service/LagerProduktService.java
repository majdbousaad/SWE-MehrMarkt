package com.mehrmarkt.mehrmarktsystem.Service;


import com.mehrmarkt.mehrmarktsystem.model.LagerProdukt;
import org.springframework.stereotype.Service;

import java.util.List;

public interface LagerProduktService {
    
    public LagerProdukt saveProduct(LagerProdukt product);
    List<LagerProdukt> getAllProducts();

    LagerProdukt getByEAN(String ean);
}
