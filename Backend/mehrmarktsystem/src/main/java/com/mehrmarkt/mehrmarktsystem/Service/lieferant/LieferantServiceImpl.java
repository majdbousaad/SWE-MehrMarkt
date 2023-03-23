package com.mehrmarkt.mehrmarktsystem.Service.lieferant;


import com.mehrmarkt.mehrmarktsystem.Repository.LieferantRepository;
import com.mehrmarkt.mehrmarktsystem.Service.bestellung.BestellungService;
import com.mehrmarkt.mehrmarktsystem.model.bestellung.Bestellung;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LieferantServiceImpl implements LieferantService {

    @Autowired
    private LieferantRepository lieferantRepository;

    @Autowired
    private BestellungService bestellungService;

    @Override
    public Lieferant saveLieferant(Lieferant lieferant) {
        return lieferantRepository.save(lieferant);
    }

    @Override
    public List<Lieferant> getAllLieferanten() {
        return lieferantRepository.getAllByIdIsNotNullOrderByStatus();
    }

    @Override
    public Optional<Lieferant> getById(int lieferant_id) {
        return lieferantRepository.findById(lieferant_id);
    }

    @Override
    public List<Bestellung> getGelieferteBestellungen(int lieferant_id) {
        return bestellungService.getGelieferteBestellungen(lieferant_id);
    }

    @Override
    public double getZuverlaessigkeit(int lieferant_id) {


        Integer b = lieferantRepository.anzahlGelieferteBestellungen(lieferant_id);
        if(b == null)
            return 0;
        Integer a= lieferantRepository.anzahlVerspaeteteBestellungen(lieferant_id);
        return a*100.0/b;
    }


}
