package com.mehrmarkt.mehrmarktsystem.Repository;

import com.mehrmarkt.mehrmarktsystem.model.ware.VerkaufteWare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface VerkaufteWareRespository extends JpaRepository<VerkaufteWare, Integer> {

    @Query("SELECT SUM(verkaufteWare.menge) " +
            "FROM VerkaufteWare verkaufteWare " +
            "join Verkauf verkauf on verkaufteWare.verkauf.id = verkauf.id " +
            "WHERE verkauf.verkaufsdatum between ?1 AND ?2 ")
    Integer getAnzahlVerkaufe(LocalDateTime beginn, LocalDateTime end);

    @Query(nativeQuery = true,
            value = "SELECT l.name as name, sum(v.menge) as verkaeufe, l.amount as verbleibend " +
            "from verkaufte_ware v " +
            "join lager_produkt l " +
            "on v.EAN = l.EAN " +
            "group by l.name order by verkaeufe desc LIMIT 10")
    List<BeliebsteProdukt> getBeliebsteProdukte();

    interface BeliebsteProdukt {

        String getName();

        int getVerkaeufe();

        int getVerbleibend();

    }
}
