package com.mehrmarkt.mehrmarktsystem.Service;

import com.mehrmarkt.mehrmarktsystem.model.Bestellung;

import java.util.List;

public interface BestellungService {

     Bestellung saveBestellung(Bestellung bestellung);
     List<Bestellung> getAllBestellungen();

     Bestellung getBestellung(int id);

     List<Bestellung> getAnstehendeBestellungen();
}
