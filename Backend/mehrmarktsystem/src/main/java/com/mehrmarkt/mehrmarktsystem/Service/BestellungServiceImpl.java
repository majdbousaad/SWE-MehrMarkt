package com.mehrmarkt.mehrmarktsystem.Service;

import com.mehrmarkt.mehrmarktsystem.Repository.BestellungRepository;
import com.mehrmarkt.mehrmarktsystem.model.Bestellung;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BestellungServiceImpl implements BestellungService{
    @Autowired
    private BestellungRepository bestellungRepository;


    @Override
    public Bestellung saveBestellung(Bestellung bestellung) {
        return bestellungRepository.save(bestellung);
    }

    @Override
    public List<Bestellung> getAllBestellungen() {
        return bestellungRepository.findAll();
    }
}
