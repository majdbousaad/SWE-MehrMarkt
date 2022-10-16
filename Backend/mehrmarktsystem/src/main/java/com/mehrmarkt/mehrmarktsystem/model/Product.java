package com.mehrmarkt.mehrmarktsystem.model;


import javax.persistence.*;
import java.util.List;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;

    public List<Lieferant> getLieferanten() {
        return Lieferanten;
    }

    public void setLieferanten(List<Lieferant> lieferanten) {
        Lieferanten = lieferanten;
    }

    @ManyToMany
    private List<Lieferant> Lieferanten;

    public Product(){

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
}
