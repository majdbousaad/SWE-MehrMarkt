package com.mehrmarkt.mehrmarktsystem.Repository;

import com.mehrmarkt.mehrmarktsystem.model.bestellung.Bestellung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BestellungRepository extends JpaRepository<Bestellung, Integer> {

    List<Bestellung> findByTatsLieferdatum(LocalDateTime datum);

    @Query("SELECT sum(g.menge) from GekaufteWare g" +
            "    join Bestellung b on b.id = g.bestellung.id" +
            "    where b.tatsLieferdatum is null")
    Integer getGesamteAnstehendeMenge();

    List<Bestellung> getAllByLieferantIdAndTatsLieferdatumIsNotNull(int lieferant_id);

    Integer countAllByLieferantIdAndTatsLieferdatumIsNotNull(int lieferant_id);

    List<Bestellung> getAllByTatsLieferdatumIsNotNull();
    List<Bestellung> getAllByTatsLieferdatumIsNull();

    Optional<Bestellung> getByIdAndTatsLieferdatumIsNull(int id);
}
