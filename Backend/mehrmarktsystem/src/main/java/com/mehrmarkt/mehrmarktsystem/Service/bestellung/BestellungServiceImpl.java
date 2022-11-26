package com.mehrmarkt.mehrmarktsystem.Service.bestellung;

import com.mehrmarkt.mehrmarktsystem.Repository.BestellungRepository;
import com.mehrmarkt.mehrmarktsystem.Repository.LagerProduktRepository;
import com.mehrmarkt.mehrmarktsystem.Service.lager.LagerService;
import com.mehrmarkt.mehrmarktsystem.model.bestellung.Bestellung;
import com.mehrmarkt.mehrmarktsystem.model.bestellung.BestellungCannotBeDeletedException;
import com.mehrmarkt.mehrmarktsystem.model.bestellung.BestellungNotFoundException;
import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import com.mehrmarkt.mehrmarktsystem.model.produkt.LagerProdukt;
import com.mehrmarkt.mehrmarktsystem.model.ware.GekaufteWare;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class BestellungServiceImpl implements BestellungService{
    @Autowired
    private BestellungRepository bestellungRepository;

    @Autowired
    private LagerProduktRepository lagerProduktRepository;

    @Autowired
    private LagerService lagerService;

    @Override
    public Bestellung saveBestellung(Bestellung bestellung) {
        return bestellungRepository.save(bestellung);
    }

    @Override
    public List<Bestellung> getAllBestellungen() {
        return bestellungRepository.findAll();
    }

    @Override
    public Bestellung getBestellung(int id) {
        try {
            return bestellungRepository.findById(id).get();
        } catch (Exception e){
            return null;
        }

    }

    @Override
    public List<Bestellung> getAnstehendeBestellungen() {

        return bestellungRepository.getAllByTatsLieferdatumIsNull();
    }

    @Override
    public int getGesamteAnstehendeMenge() {
        if(bestellungRepository.getGesamteAnstehendeMenge() == null){
            return 0;
        }
        return bestellungRepository.getGesamteAnstehendeMenge();
    }

    @Override
    public List<Bestellung> getGelieferteBestellungen(int lieferant_id) {
        return bestellungRepository.getAllByLieferantIdAndTatsLieferdatumIsNotNull(lieferant_id);
    }

    @Override
    public List<Bestellung> getGelieferteBestellungen() {
        return bestellungRepository.getAllByTatsLieferdatumIsNotNull();
    }

    @Override
    public Integer countGelieferteBestellungen(int lieferant_id) {
        return bestellungRepository.countAllByLieferantIdAndTatsLieferdatumIsNotNull(lieferant_id);
    }

    @Override
    public void storniereBestellung(int id) {

        Bestellung bestellung = bestellungRepository.findById(id)
                .orElseThrow(BestellungNotFoundException::new);
        if(bestellung.getTatsLieferdatum() != null){
            throw new BestellungCannotBeDeletedException();
        }
        Set<Lager> lagersToBeUpdated = new HashSet<>();
        Lager lager = null;
        Lager standardLager = lagerService.getStandardLager().get();
        for (GekaufteWare gekaufteWare : bestellung.getWaren()){
            Optional<LagerProdukt> lagerProdukt = lagerProduktRepository.getByEAN(gekaufteWare.getProduct().getEAN());
            if(lagerProdukt.isPresent()){
                lager = lagerProdukt.get().getLager();
            }else {
                lager = standardLager;
            }
            lager.setAnstehendeMenge(lager.getAnstehendeMenge() - gekaufteWare.getMenge());
            lagersToBeUpdated.add(lager);
        }
        for (Lager lager1 :
                lagersToBeUpdated) {
            lagerService.updateLager(lager);
        }
        bestellungRepository.deleteById(id);

    }


}
