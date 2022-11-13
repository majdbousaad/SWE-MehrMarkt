package com.mehrmarkt.mehrmarktsystem.Repository;


import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LieferantRepository extends JpaRepository<Lieferant, Integer> {

}
