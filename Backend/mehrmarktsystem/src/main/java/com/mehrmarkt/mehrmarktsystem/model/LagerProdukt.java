package com.mehrmarkt.mehrmarktsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

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
    int menge;
    String lagerOrt;

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
        setProduct(lieferantProduct);
    }


}
