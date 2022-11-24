package com.mehrmarkt.mehrmarktsystem.Service.lieferant;

import com.mehrmarkt.mehrmarktsystem.model.bestellung.Bestellung;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;

import java.util.List;
import java.util.Optional;

public interface LieferantService {

    public Lieferant saveLieferant(Lieferant lieferant);
    public List<Lieferant> getAllLieferanten();

    public Optional<Lieferant> getById(int lieferant_id);

    List<Bestellung> getGelieferteBestellungen(int lieferant_id);
}
