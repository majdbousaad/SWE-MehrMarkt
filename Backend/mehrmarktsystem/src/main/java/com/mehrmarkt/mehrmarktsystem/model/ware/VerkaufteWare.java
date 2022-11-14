package com.mehrmarkt.mehrmarktsystem.model.ware;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import com.mehrmarkt.mehrmarktsystem.model.verkauf.Verkauf;

import javax.persistence.*;

@Entity
public class VerkaufteWare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "EAN", referencedColumnName = "EAN")
    @JsonIgnoreProperties(value = {"verkaufteWaren"})
    private LagerProdukt lagerProdukt;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verkauf_id", referencedColumnName = "id")
    @JsonIgnoreProperties(value = {"verkaufteWaren"})
    private Verkauf verkauf;

    private int menge;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LagerProdukt getLagerProdukt() {
        return lagerProdukt;
    }

    public void setLagerProdukt(LagerProdukt lagerProdukt) {
        this.lagerProdukt = lagerProdukt;
    }

    public Verkauf getVerkauf() {
        return verkauf;
    }

    public void setVerkauf(Verkauf verkauf) {
        this.verkauf = verkauf;
    }

    public int getMenge() {
        return menge;
    }

    public void setMenge(int menge) {
        this.menge = menge;
    }

}
