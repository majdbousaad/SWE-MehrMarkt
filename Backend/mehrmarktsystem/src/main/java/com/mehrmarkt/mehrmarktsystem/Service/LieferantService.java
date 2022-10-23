package com.mehrmarkt.mehrmarktsystem.Service;

import com.mehrmarkt.mehrmarktsystem.model.Lieferant;

import java.util.List;

public interface LieferantService {

    public Lieferant saveLieferant(Lieferant lieferant);
    public List<Lieferant> getAllLieferanten();

    public Lieferant getById(int lieferant_id);
}
