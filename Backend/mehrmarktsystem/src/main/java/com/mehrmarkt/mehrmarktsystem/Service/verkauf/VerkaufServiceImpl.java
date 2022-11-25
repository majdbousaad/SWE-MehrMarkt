package com.mehrmarkt.mehrmarktsystem.Service.verkauf;

import com.mehrmarkt.mehrmarktsystem.Repository.VerkaufRepository;
import com.mehrmarkt.mehrmarktsystem.Repository.VerkaufteWareRespository;
import com.mehrmarkt.mehrmarktsystem.model.verkauf.Verkauf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VerkaufServiceImpl implements VerkaufService {

    @Autowired
    private VerkaufRepository verkaufRepository;

    @Autowired
    private VerkaufteWareRespository verkaufteWareRespository;
    @Override
    public Verkauf saveVerkauf(Verkauf verkauf) {
        return verkaufRepository.save(verkauf);
    }

    @Override
    public List<Verkauf> getAllVerkaufen() {
        return verkaufRepository.findAll();
    }

    @Override
    public Optional<Verkauf> getVerkauf(int id) {
        return verkaufRepository.findById(id);
    }

    @Override
    public Integer getAnzahlVerkaeufe(LocalDateTime beginn, LocalDateTime end) {
        return verkaufteWareRespository.getAnzahlVerkaufe(beginn, end);
    }

    @Override
    public Object getBeliebsteProdukte() {
        return verkaufteWareRespository.getBeliebsteProdukte();
    }


}
