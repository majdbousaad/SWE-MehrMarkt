package com.mehrmarkt.mehrmarktsystem.model.produkt;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
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
    @JsonIgnore
    private Product product;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lagerort", referencedColumnName = "name", insertable = false, updatable = false)
    @JsonIgnore
    private Lager lager;

    @Column(name="lagerort")
    private String lagerort;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "lagerProdukt")
    @JsonIgnore
    private List<VerkaufteWare> verkaufteWaren;

    private int menge;

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

    public LagerProdukt(Product lieferantProduct, int menge, Lager lager){
        setEAN(lieferantProduct.getEAN());
        setLager(lager);
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

    public String getLagerort() {
        return lagerort;
    }

    public void setLagerort(String lagerort) {
        this.lagerort = lagerort;
    }
}
