package com.mehrmarkt.mehrmarktsystem.Service.verkauf;

import com.mehrmarkt.mehrmarktsystem.model.verkauf.Verkauf;
import org.hibernate.validator.internal.constraintvalidators.bv.time.futureorpresent.FutureOrPresentValidatorForJapaneseDate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface VerkaufService {

    Verkauf saveVerkauf(Verkauf verkauf);
    List<Verkauf> getAllVerkaufen();

    Optional<Verkauf> getVerkauf(int id);

    Integer getAnzahlVerkaeufe(LocalDateTime beginn, LocalDateTime end);

    Object getBeliebsteProdukte();
}
