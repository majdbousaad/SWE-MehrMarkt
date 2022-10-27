package com.mehrmarkt.mehrmarktsystem.Service;

import com.mehrmarkt.mehrmarktsystem.Repository.WareRepository;
import com.mehrmarkt.mehrmarktsystem.model.Ware;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WareServiceImpl implements WareService{

    @Autowired
    private WareRepository wareRepository;

    @Override
    public Ware add(Ware ware) {
        return wareRepository.save(ware);
    }
}
