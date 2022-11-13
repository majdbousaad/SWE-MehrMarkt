package com.mehrmarkt.mehrmarktsystem.Service;

import com.mehrmarkt.mehrmarktsystem.Repository.LagerRepository;
import com.mehrmarkt.mehrmarktsystem.model.Lager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LagerServiceImpl implements LagerService{

    @Autowired
    private LagerRepository lagerRepository;

    @Override
    public Lager createLager() {

        Lager lager = new Lager();
        lagerRepository.save(lager);
        return lager;


    }

    @Override
    public Lager getLager() {
        if(lagerRepository.existsById(1)) {
            return lagerRepository.findById(1).get();
        }
        return createLager();

    }

    @Override
    public void updateLager(Lager lager) {

        lagerRepository.save(lager);
    }

    @Override
    public int updateMaxSize(int maxSize) {
        return lagerRepository.updateSize(maxSize);
    }
}
