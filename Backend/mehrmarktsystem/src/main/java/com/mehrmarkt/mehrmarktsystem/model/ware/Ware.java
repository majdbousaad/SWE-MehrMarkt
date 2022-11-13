package com.mehrmarkt.mehrmarktsystem.model.ware;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mehrmarkt.mehrmarktsystem.model.bestellung.Bestellung;
import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;

import javax.persistence.*;

@Entity
public class Ware{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "EAN", referencedColumnName = "EAN")
    @JsonIgnoreProperties(value = {"waren", "lieferant"})
    private Product product;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bestellung_id", referencedColumnName = "id")
    @JsonIgnoreProperties(value = {"waren"})
    private Bestellung bestellung;
    private int menge;

    public int getMenge() {
        return menge;
    }

    public void setMenge(int menge) {
        this.menge = menge;
    }

    public Bestellung getBestellung() {
        return bestellung;
    }

    public void setBestellung(Bestellung bestellung) {
        this.bestellung = bestellung;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Ware() {
    }
}
