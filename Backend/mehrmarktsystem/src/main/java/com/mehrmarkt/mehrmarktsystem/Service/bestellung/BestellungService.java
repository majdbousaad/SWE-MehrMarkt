package com.mehrmarkt.mehrmarktsystem.Service.bestellung;

import com.mehrmarkt.mehrmarktsystem.model.bestellung.Bestellung;
import com.mehrmarkt.mehrmarktsystem.model.bestellung.BestellungCannotBeDeletedException;
import com.mehrmarkt.mehrmarktsystem.model.bestellung.BestellungNotFoundException;

import java.util.List;

public interface BestellungService {

     Bestellung saveBestellung(Bestellung bestellung);
     List<Bestellung> getAllBestellungen();

     Bestellung getBestellung(int id);

     List<Bestellung> getAnstehendeBestellungen();
     int getGesamteAnstehendeMenge();

     List<Bestellung> getGelieferteBestellungen(int lieferant_id);

     List<Bestellung> getGelieferteBestellungen();

     Integer countGelieferteBestellungen(int lieferant_id);

     void storniereBestellung(int id)
             throws BestellungCannotBeDeletedException,
             BestellungNotFoundException;
}
