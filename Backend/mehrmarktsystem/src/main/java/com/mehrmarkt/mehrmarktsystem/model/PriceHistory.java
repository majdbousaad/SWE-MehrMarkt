package com.mehrmarkt.mehrmarktsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.util.List;

@Entity
public class PriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany( fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name="priceHistory_id", referencedColumnName = "id")
    @JsonIgnoreProperties(value = {"priceHistory"})
    private List<priceDatePair> pricehistory;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public List<priceDatePair> getPricehistory() {
        return pricehistory;
    }

    public void setPricehistory(List<priceDatePair> pricehistory) {
        this.pricehistory = pricehistory;
    }
}
