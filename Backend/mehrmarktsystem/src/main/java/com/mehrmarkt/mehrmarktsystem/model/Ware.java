package com.mehrmarkt.mehrmarktsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

@Entity
public class Ware extends Product{



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bestellung_id", referencedColumnName = "id")
    @JsonIgnoreProperties(value= {"waren"})
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


}
