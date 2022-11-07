package com.mehrmarkt.mehrmarktsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.time.Duration;
import java.util.List;

enum Status {aktiv, inaktiv}
@Entity
public class Lieferant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;

    private String adresse;

    // private boolean zuverlaessig = true;

    private Duration lieferzeit;

    @OneToMany( fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name="lieferant_id")
    @JsonIgnoreProperties(value = {"lieferant", "waren" })
    private List<Product> products;

    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToMany(mappedBy = "lieferant")
    @JsonIgnoreProperties(value = {"waren", "lieferant"})
    private List<Bestellung> bestellungen;

    boolean zuverlaessig = true;

    public boolean isZuverlaessig() {
        return zuverlaessig;
    }

    public void setZuverlaessig(boolean zuverlaessig) {
        this.zuverlaessig = zuverlaessig;
    }

    public Lieferant(){

    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public Duration getLieferzeit() {
        return lieferzeit;
    }

    public void setLieferzeit(Duration lieferzeit) {
        this.lieferzeit = lieferzeit;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public List<Bestellung> getBestellungen() {
        return bestellungen;
    }

    public void setBestellungen(List<Bestellung> bestellungen) {
        this.bestellungen = bestellungen;
    }

    /*
    public boolean isZuverlaessig() {
        int countVerspaeteteLieferungen = 0;
        for (Bestellung bestellung : bestellungen) {
            if (bestellung.getBestellungsStatus() == BestellungsStatus.spaet) {
                countVerspaeteteLieferungen++;
            }
        }
        this.zuverlaessig = (countVerspaeteteLieferungen / bestellungen.size() > 3 / 10) ? false : true;
        return this.zuverlaessig;
    }
    */

}
