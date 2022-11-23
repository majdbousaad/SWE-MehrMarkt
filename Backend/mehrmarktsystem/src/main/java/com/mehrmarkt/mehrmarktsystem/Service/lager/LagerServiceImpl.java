package com.mehrmarkt.mehrmarktsystem.Service.lager;

import com.mehrmarkt.mehrmarktsystem.Repository.LagerRepository;
import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LagerServiceImpl implements LagerService{

    @Autowired
    private LagerRepository lagerRepository;

    @Override
    public Lager createLager(String lagerort) {

        Lager lager = new Lager(lagerort);
        lagerRepository.save(lager);
        return lager;


    }

    @Override
    public Lager getLager(String lagerort) {
        Lager lager;
        if(existsByName(lagerort)) {
            lager = lagerRepository.getLagerByName(lagerort);
        } else {
            lager = createLager(lagerort);
        }
        return lager;

    }

    @Override
    public boolean existsByName(String lagerort) {
        return lagerRepository.existsLagerByName(lagerort);
    }

    @Override
    public void updateLager(Lager lager) {

        lagerRepository.save(lager);
    }

    @Override
    public int updateMaxSize(String lagerort, int maxSize) {
        return lagerRepository.updateSize(lagerort, maxSize);
    }

    @Override
    public List<Lager> getAllLager() {
        return lagerRepository.findAll();
    }
}
