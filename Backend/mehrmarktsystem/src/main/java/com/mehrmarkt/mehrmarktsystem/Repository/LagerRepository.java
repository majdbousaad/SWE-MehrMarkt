package com.mehrmarkt.mehrmarktsystem.Repository;


import com.mehrmarkt.mehrmarktsystem.model.Lager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LagerRepository extends JpaRepository<Lager, Integer> {
    @Modifying
    @Query("update Lager l set l.max = ?1 where l.id=1")
    int updateSize(int maxSize);
}
