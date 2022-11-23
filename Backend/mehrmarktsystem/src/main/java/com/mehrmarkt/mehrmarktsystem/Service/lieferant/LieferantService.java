package com.mehrmarkt.mehrmarktsystem.Service.lieferant;

import com.mehrmarkt.mehrmarktsystem.model.bestellung.Bestellung;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;

import java.util.List;

public interface LieferantService {

    public Lieferant saveLieferant(Lieferant lieferant);
    public List<Lieferant> getAllLieferanten();

    public Lieferant getById(int lieferant_id);

    List<Bestellung> getGelieferteBestellungen(int lieferant_id);
}
