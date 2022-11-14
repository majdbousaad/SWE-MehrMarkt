package com.mehrmarkt.mehrmarktsystem.Service.verkauf;

import com.mehrmarkt.mehrmarktsystem.model.verkauf.Verkauf;

import java.util.List;

public interface VerkaufService {

    Verkauf saveVerkauf(Verkauf verkauf);
    List<Verkauf> getAllVerkaufen();

    Verkauf getVerkauf(int id);

}
