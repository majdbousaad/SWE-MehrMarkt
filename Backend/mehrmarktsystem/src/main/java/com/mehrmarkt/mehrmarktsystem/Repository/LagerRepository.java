package com.mehrmarkt.mehrmarktsystem.Repository;


import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LagerRepository extends JpaRepository<Lager, Integer> {
    @Modifying
    @Query("update Lager l set l.max = ?2 where l.name = ?1")
    int updateSize(String lagerort, int maxSize);



    boolean existsLagerByName(String lagerort);
    Lager getLagerByName(String lagerort);

    Optional<Lager> findByName(String lagerort);

    Optional<Lager> findByStandardIsTrue();
}
