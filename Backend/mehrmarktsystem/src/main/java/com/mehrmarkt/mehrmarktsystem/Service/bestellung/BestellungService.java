package com.mehrmarkt.mehrmarktsystem.Service.bestellung;

import com.mehrmarkt.mehrmarktsystem.model.bestellung.Bestellung;

import java.util.List;

public interface BestellungService {

     Bestellung saveBestellung(Bestellung bestellung);
     List<Bestellung> getAllBestellungen();

     Bestellung getBestellung(int id);

     List<Bestellung> getAnstehendeBestellungen();
     int getGesamteAnstehendeMenge();
}
