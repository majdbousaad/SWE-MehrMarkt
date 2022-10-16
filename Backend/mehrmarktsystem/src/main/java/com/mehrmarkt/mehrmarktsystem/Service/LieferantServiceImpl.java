package com.mehrmarkt.mehrmarktsystem.Service;


import com.mehrmarkt.mehrmarktsystem.Repository.LieferantRepository;
import com.mehrmarkt.mehrmarktsystem.model.Lieferant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LieferantServiceImpl implements LieferantService {

    @Autowired
    private LieferantRepository lieferantRepository;

    @Override
    public Lieferant saveLieferant(Lieferant lieferant) {
        return null;
    }
}
