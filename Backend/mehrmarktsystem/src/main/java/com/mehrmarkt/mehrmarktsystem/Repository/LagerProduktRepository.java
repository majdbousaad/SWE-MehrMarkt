package com.mehrmarkt.mehrmarktsystem.Repository;

import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LagerProduktRepository extends JpaRepository<LagerProdukt, String> {
    Optional<LagerProdukt> getByEAN(String ean);
    List<LagerProdukt> getAllByLagerort(String lagerort);
}
