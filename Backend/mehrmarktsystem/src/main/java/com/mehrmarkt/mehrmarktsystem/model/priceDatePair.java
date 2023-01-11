package com.mehrmarkt.mehrmarktsystem.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class priceDatePair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    Double price;
    LocalDateTime date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "priceHistory_id", referencedColumnName = "id")
    @JsonIgnoreProperties(value = {"pricehistory"})
    private PriceHistory priceHistory;
    public priceDatePair(Double price, LocalDateTime date) {
        this.price = price;
        this.date = date;
    }

    public priceDatePair() {

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public PriceHistory getPriceHistory() {
        return priceHistory;
    }

    public void setPriceHistory(PriceHistory priceHistory) {
        this.priceHistory = priceHistory;
    }
}
