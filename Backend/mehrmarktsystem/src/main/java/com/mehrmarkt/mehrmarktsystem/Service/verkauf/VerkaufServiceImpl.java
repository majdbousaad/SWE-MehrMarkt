package com.mehrmarkt.mehrmarktsystem.Service.verkauf;

import com.mehrmarkt.mehrmarktsystem.Repository.VerkaufRepository;
import com.mehrmarkt.mehrmarktsystem.model.verkauf.Verkauf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VerkaufServiceImpl implements VerkaufService {

    @Autowired
    private VerkaufRepository verkaufRepository;

    @Override
    public Verkauf saveVerkauf(Verkauf verkauf) {
        return verkaufRepository.save(verkauf);
    }

    @Override
    public List<Verkauf> getAllVerkaufen() {
        return verkaufRepository.findAll();
    }

    @Override
    public Verkauf getVerkauf(int id) {
        return verkaufRepository.findById(id).get();
    }
}
