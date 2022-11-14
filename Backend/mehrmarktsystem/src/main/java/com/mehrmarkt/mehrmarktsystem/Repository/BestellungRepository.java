package com.mehrmarkt.mehrmarktsystem.Repository;

import com.mehrmarkt.mehrmarktsystem.model.bestellung.Bestellung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BestellungRepository extends JpaRepository<Bestellung, Integer> {

    List<Bestellung> findByTatsLieferdatum(LocalDateTime datum);

}
