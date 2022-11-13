package com.mehrmarkt.mehrmarktsystem.model.lager;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mehrmarkt.mehrmarktsystem.Repository.VerkaufRepository;
import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;
import com.mehrmarkt.mehrmarktsystem.model.verkauf.Verkauf;
import com.mehrmarkt.mehrmarktsystem.model.ware.VerkaufteWare;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Lager {

    @Id
    int id = 1;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name="lager_id")
    @JsonIgnoreProperties(value = {"lager", "product"})
    private List<LagerProdukt> lagerProdukts;

    private int max;
    private int size;

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
    public Lager() {
        setSize(0);
        setMax(100);
        setLagerProdukts(new ArrayList<>());
    }

    public boolean addNewLagerProdukt(Product lieferantProdukt, int menge){
        if(menge <= 0 || lieferantProdukt == null){
            return false;
        }
        LagerProdukt lagerProdukt = getLagerProdukt(lieferantProdukt);
        if(lagerProdukt != null) {
            lagerProdukt.setMenge(lagerProdukt.getMenge() + menge);

        } else {
            lagerProdukts.add(new LagerProdukt(lieferantProdukt, menge));
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

        LagerProdukt produkt = getLagerProdukt(lagerProdukt);
        lagerProdukt.setMenge(lagerProdukt.getMenge() - menge);

        setSize(size - menge);
        return true;
    }

    public boolean checkVerkauf(Verkauf verkauf){
        List<VerkaufteWare> verkaufteWaren = verkauf.getVerkaufteWaren();

        for (VerkaufteWare ware : verkaufteWaren){
            LagerProdukt currentLagerProdukt = getLagerProdukt(ware.getLagerProdukt());
            if(currentLagerProdukt == null
                    || ware.getMenge() <= 0
                    || currentLagerProdukt.getMenge() < ware.getMenge()){
                return false;
            }
        }

        return true;
    }
}
