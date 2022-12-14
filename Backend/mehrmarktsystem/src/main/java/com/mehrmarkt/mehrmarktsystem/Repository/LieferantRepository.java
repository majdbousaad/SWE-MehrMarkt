package com.mehrmarkt.mehrmarktsystem.Repository;


import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LieferantRepository extends JpaRepository<Lieferant, Integer> {

    @Query("SELECT count(b.tatsLieferdatum) from Bestellung b " +
            "join Lieferant l on l.id = b.lieferant.id " +
            "where  b.tatsLieferdatum is not null " +
            "and l.id = ?1")
    Integer anzahlGelieferteBestellungen(int lieferant_id);

    @Query("SELECT count(b.status) from Bestellung b " +
            "join Lieferant l on l.id = b.lieferant.id " +
            "where  b.status = 'spaet'" +
            "and l.id = ?1")
    Integer anzahlVerspaeteteBestellungen(int lieferant_id);

    List<Lieferant> getAllByIdIsNotNullOrderByStatus();

}
