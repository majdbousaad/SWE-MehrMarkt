package com.mehrmarkt.mehrmarktsystem.model.produkt;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import com.mehrmarkt.mehrmarktsystem.model.ware.VerkaufteWare;

import javax.persistence.*;
import java.util.List;

@Entity
public class LagerProdukt{

    @Id
    @Column(name = "EAN", updatable = false, nullable = false)
    private String EAN;

    @MapsId
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "EAN", referencedColumnName = "EAN")
    private Product product;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lager_id", referencedColumnName = "id")
    @JsonIgnore
    private Lager lager;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "lagerProdukt")
    @JsonIgnore
    private List<VerkaufteWare> verkaufteWaren;

    private int menge;
    private String lagerOrt;

    private String name;

    private double preis;

    public LagerProdukt() {
    }

    public int getMenge() {
        return menge;
    }

    public void setMenge(int menge) {
        this.menge = menge;
    }

    public String getLagerOrt() {
        return lagerOrt;
    }

    public void setLagerOrt(String lagerOrt) {
        this.lagerOrt = lagerOrt;
    }

    public String getEAN() {
        return EAN;
    }

    public void setEAN(String EAN) {
        this.EAN = EAN;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public LagerProdukt(Product lieferantProduct, int menge){
        setEAN(lieferantProduct.getEAN());
        setLagerOrt("Not specified");
        setMenge(menge);
        setPreis(lieferantProduct.getPreis());
        setName(lieferantProduct.getName());
        setProduct(lieferantProduct);
    }

    public Lager getLager() {
        return lager;
    }

    public void setLager(Lager lager) {
        this.lager = lager;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPreis() {
        return preis;
    }

    public void setPreis(double preis) {
        this.preis = preis;
    }
}
