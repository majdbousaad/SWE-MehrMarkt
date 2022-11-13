package com.mehrmarkt.mehrmarktsystem.model.verkauf;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mehrmarkt.mehrmarktsystem.model.ware.VerkaufteWare;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;


@Entity
public class Verkauf {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name="verkauf_id")
    @JsonIgnoreProperties(value = {"verkauf"})
    private List<VerkaufteWare> verkaufteWaren;


    @CreationTimestamp
    private LocalDateTime verkaufsdatum;

    private double gesamtPreis;



    public double calculateGesamtPreis() {
        double summe = 0;
        for (VerkaufteWare ware:
                verkaufteWaren) {
            summe += ware.getLagerProdukt().getPreis() * ware.getMenge();
        }

        return summe;
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }



    public LocalDateTime getVerkaufsdatum() {
        return verkaufsdatum;
    }

    public void setVerkaufsdatum(LocalDateTime verkaufsdatum) {
        this.verkaufsdatum = verkaufsdatum;
    }

    public double getGesamtPreis() {
        return gesamtPreis;
    }

    public void setGesamtPreis(double gesamtPreis) {
        this.gesamtPreis = gesamtPreis;
    }

    public List<VerkaufteWare> getVerkaufteWaren() {
        return verkaufteWaren;
    }

    public void setVerkaufteWaren(List<VerkaufteWare> verkaufteWaren) {
        this.verkaufteWaren = verkaufteWaren;
    }
}
