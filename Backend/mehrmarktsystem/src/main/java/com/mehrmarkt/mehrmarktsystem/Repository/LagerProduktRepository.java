package com.mehrmarkt.mehrmarktsystem.Repository;

import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LagerProduktRepository extends JpaRepository<LagerProdukt, String> {
    LagerProdukt getByEAN(String ean);
}
