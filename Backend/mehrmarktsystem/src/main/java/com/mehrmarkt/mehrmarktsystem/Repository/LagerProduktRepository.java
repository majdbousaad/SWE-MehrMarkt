package com.mehrmarkt.mehrmarktsystem.Repository;

import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LagerProduktRepository extends JpaRepository<LagerProdukt, String> {
    Optional<LagerProdukt> getByEAN(String ean);
    List<LagerProdukt> getAllByLagerort(String lagerort);

    boolean existsByEAN(String ean);

    @Query("SELECT sum(g.menge) from GekaufteWare g" +
            "    join Bestellung b on b.id = g.bestellung.id" +
            "    where b.tatsLieferdatum is null " +
            "    AND g.product.EAN = ?1")
    Integer getAnstehendeMenge(String ean);

    List<LagerProdukt> findByEANContainingOrNameContainingIgnoreCase(String ean, String name);
}
