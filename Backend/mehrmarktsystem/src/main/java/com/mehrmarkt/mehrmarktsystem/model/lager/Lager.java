package com.mehrmarkt.mehrmarktsystem.model.lager;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Lager {

    @Id
    private String name;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name="lagerort")
    @JsonIgnoreProperties(value = {"lager", "product"})
    private List<LagerProdukt> lagerProdukts;

    private boolean standard = false;

    private int max;
    private int size;

    public Lager() {

    }

    public List<LagerProdukt> getLagerProdukts() {
        return lagerProdukts;
    }

    public void setLagerProdukts(List<LagerProdukt> lagerProdukts) {
        this.lagerProdukts = lagerProdukts;
    }

    public int getMax() {
        return max;
    }

    public void setMax(int max) {
        this.max = max;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Lager(String lagerort) {
        setSize(0);
        setMax(100);
        setName( lagerort);
        setLagerProdukts(new ArrayList<>());
    }

    public boolean addNewLagerProdukt(Product lieferantProdukt, int menge, Lager lager){
        if(menge <= 0 || lieferantProdukt == null){
            return false;
        }
        LagerProdukt lagerProdukt = getLagerProdukt(lieferantProdukt);
        if(lagerProdukt != null) {
            lagerProdukt.setMenge(lagerProdukt.getMenge() + menge);

        } else {
            lagerProdukts.add(new LagerProdukt(lieferantProdukt, menge, lager));
        }


        setSize(size + menge);
        return true;

    }



    private LagerProdukt getLagerProdukt(Product lieferantProduct){
        for (LagerProdukt currentLagerProdukt : lagerProdukts){
            if(currentLagerProdukt.getEAN().equals(lieferantProduct.getEAN()) ){
                return currentLagerProdukt;
            }
        }
        return null;
    }


    private LagerProdukt getLagerProdukt(LagerProdukt lagerProdukt){
        for (LagerProdukt produkt : lagerProdukts){
            if(produkt.getEAN().equals(lagerProdukt.getEAN())){
                return produkt;
            }
        }
        return null;
    }


    public boolean verkaufLagerProdukt(LagerProdukt lagerProdukt, int menge) {

        lagerProdukt.setMenge(lagerProdukt.getMenge() - menge);
        setSize(size - menge);
        return true;
    }

    public void addLagerProduktIfNotExists(LagerProdukt lagerProdukt){
        if(!lagerProdukts.stream().anyMatch(s -> s.getEAN().equals(lagerProdukt.getEAN()))){
            lagerProdukts.add(lagerProdukt);
            setSize(size + lagerProdukt.getMenge());
        }
    }

    public boolean isStandard() {
        return standard;
    }

    public void setStandard(boolean standard) {
        this.standard = standard;
    }
}
