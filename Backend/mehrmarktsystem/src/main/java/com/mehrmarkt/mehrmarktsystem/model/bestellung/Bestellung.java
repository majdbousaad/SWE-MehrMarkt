package com.mehrmarkt.mehrmarktsystem.model.bestellung;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;
import com.mehrmarkt.mehrmarktsystem.model.ware.GekaufteWare;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;


@Entity

public class Bestellung {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name="bestellung_id")
    @JsonIgnoreProperties(value = {"bestellung"})
    private List<GekaufteWare> waren;

    public BestellungsStatus getBestellungsStatus() {
        if(tatsLieferdatum == null){
            return BestellungsStatus.nochNichtErhalten;
        } else if (tatsLieferdatum.isBefore(vslLieferdatum)) {
            return BestellungsStatus.puenktlich;
        } else {
            return BestellungsStatus.spaet;
        }
    }

    @ManyToOne
    @JoinColumn(name = "lieferant_id", referencedColumnName = "id")
    @JsonIgnoreProperties(value = {"bestellungen", "products"})
    private Lieferant lieferant;

    @CreationTimestamp
    private LocalDateTime bestellungsdatum;

    private double gesamtPreis;

    private LocalDateTime vslLieferdatum;

    private LocalDateTime tatsLieferdatum;

    public double calculateGesamtPreis() {
        double summe = 0;
        for (GekaufteWare gekaufteWare :
             waren) {
            summe += gekaufteWare.getProduct().getPreis() * gekaufteWare.getMenge();
        }

        return summe;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public List<GekaufteWare> getWaren() {
        return waren;
    }

    public void setWaren(List<GekaufteWare> waren) {
        this.waren = waren;
    }

    public double getGesamtPreis() {
        return gesamtPreis;
    }

    public void setGesamtPreis(double gesamtPreis) {
        this.gesamtPreis = gesamtPreis;
    }

    public LocalDateTime getVslLieferdatum() {
        return vslLieferdatum;
    }

    public void setVslLieferdatum(LocalDateTime vslLieferdatum) {
        this.vslLieferdatum = vslLieferdatum;
    }

    public LocalDateTime getTatsLieferdatum() {
        return tatsLieferdatum;
    }

    public void setTatsLieferdatum(LocalDateTime tatsLieferdatum) {
        this.tatsLieferdatum = tatsLieferdatum;
    }

    public Lieferant getLieferant() {
        return lieferant;
    }

    public void setLieferant(Lieferant lieferant) throws LieferantInactivException {
        if(lieferant.getStatus() == LieferantenStatus.inaktiv){
            throw new LieferantInactivException();
        }
        this.lieferant = lieferant;
    }

    public LocalDateTime getBestellungsdatum() {
        return bestellungsdatum;
    }

    public void setBestellungsdatum(LocalDateTime bestellungsdatum) {
        this.bestellungsdatum = bestellungsdatum;
    }

    public Bestellung() {
    }


}
