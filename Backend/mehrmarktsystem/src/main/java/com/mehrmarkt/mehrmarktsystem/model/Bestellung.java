package com.mehrmarkt.mehrmarktsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;


enum BestellungsStatus {spaet, puenktlich, nochNichtErhalten}
@Entity
public class Bestellung {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name="bestellung_id")
    @JsonIgnoreProperties(value= {"bestellung"})
    private List<Ware> waren;

    public BestellungsStatus getBestellungsStatus() {
        if(tats_lieferdatum == null){
            return BestellungsStatus.nochNichtErhalten;
        } else if (tats_lieferdatum.isBefore(vors_lieferdatum)) {
            return BestellungsStatus.puenktlich;
        } else {
            return BestellungsStatus.spaet;
        }
    }

    @ManyToOne
    @JoinColumn(name = "lieferant_id", referencedColumnName = "id")
    private Lieferant lieferant;

    @CreationTimestamp
    private LocalDateTime bestellungsdatum;

    private double gesamtPreis;

    private LocalDateTime vors_lieferdatum;

    private LocalDateTime tats_lieferdatum;


    public void calculateVors_lieferdatum(){

        LocalDateTime date = LocalDateTime.now().plus(lieferant.getLieferzeit());
        setVors_lieferdatum(date);
    }
    public double calculateGesamtPreis() {
        double summe = 0;
        for (Ware ware:
             waren) {
            summe += ware.getPreis() * ware.getMenge();
        }

        return summe;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public List<Ware> getWaren() {
        return waren;
    }

    public void setWaren(List<Ware> waren) {
        this.waren = waren;
    }

    public double getGesamtPreis() {
        return gesamtPreis;
    }

    public void setGesamtPreis(double gesamtPreis) {
        this.gesamtPreis = gesamtPreis;
    }

    public LocalDateTime getVors_lieferdatum() {
        return vors_lieferdatum;
    }

    public void setVors_lieferdatum(LocalDateTime vors_lieferdatum) {
        this.vors_lieferdatum = vors_lieferdatum;
    }

    public LocalDateTime getTats_lieferdatum() {
        return tats_lieferdatum;
    }

    public void setTats_lieferdatum(LocalDateTime tats_lieferdatum) {
        this.tats_lieferdatum = tats_lieferdatum;
    }

    public Lieferant getLieferant() {
        return lieferant;
    }

    public void setLieferant(Lieferant lieferant) {
        this.lieferant = lieferant;
    }

    public LocalDateTime getBestellungsdatum() {
        return bestellungsdatum;
    }

    public void setBestellungsdatum(LocalDateTime bestellungsdatum) {
        this.bestellungsdatum = bestellungsdatum;
    }



}
