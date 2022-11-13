package com.mehrmarkt.mehrmarktsystem.Service.lieferant;


import com.mehrmarkt.mehrmarktsystem.Repository.LieferantRepository;
import com.mehrmarkt.mehrmarktsystem.model.lieferant.Lieferant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LieferantServiceImpl implements LieferantService {

    @Autowired
    private LieferantRepository lieferantRepository;

    @Override
    public Lieferant saveLieferant(Lieferant lieferant) {
        return lieferantRepository.save(lieferant);
    }

    @Override
    public List<Lieferant> getAllLieferanten() {
        return lieferantRepository.findAll();
    }

    @Override
    public Lieferant getById(int lieferant_id) {
        return lieferantRepository.findById(lieferant_id).get();
    }


}
