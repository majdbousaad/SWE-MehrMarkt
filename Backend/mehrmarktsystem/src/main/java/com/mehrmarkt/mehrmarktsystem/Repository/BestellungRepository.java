package com.mehrmarkt.mehrmarktsystem.Repository;

import com.mehrmarkt.mehrmarktsystem.model.Bestellung;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BestellungRepository extends JpaRepository<Bestellung, Integer> {
}
