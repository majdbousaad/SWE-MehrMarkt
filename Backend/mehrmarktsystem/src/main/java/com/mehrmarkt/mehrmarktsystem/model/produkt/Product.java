package com.mehrmarkt.mehrmarktsystem.model.produkt;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;
import com.mehrmarkt.mehrmarktsystem.model.ware.GekaufteWare;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
public class Product {

    @Id
    private String EAN;
    private String name;

    public static int anzahl = 0;

   @Column(name = "price")
    private double preis;

    public String getEAN() {
        return EAN;
    }

    public void setEAN(String EAN) {
        this.EAN = EAN;
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

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "product")
    @JsonIgnore
    private List<GekaufteWare> waren;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lieferant_id", referencedColumnName = "id")
    @JsonIgnoreProperties(value = {"products", "bestellungen"})
    private Lieferant lieferant;



    public Lieferant getLieferant() {
        return lieferant;
    }

    public void setLieferant(Lieferant lieferant) {
        this.lieferant = lieferant;
    }

    public Product() {
        anzahl++;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return EAN.equals(product.EAN);
    }

    @Override
    public int hashCode() {
        return Objects.hash(EAN);
    }
}
