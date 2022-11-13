package com.mehrmarkt.mehrmarktsystem.Service.ware;

import com.mehrmarkt.mehrmarktsystem.Repository.GekaufteWareRepository;
import com.mehrmarkt.mehrmarktsystem.model.ware.GekaufteWare;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GekaufteWareServiceImpl implements GekaufteWareService {

    @Autowired
    private GekaufteWareRepository gekaufteWareRepository;


    @Override
    public GekaufteWare addWare(GekaufteWare gekaufteWare) {
        return gekaufteWareRepository.save(gekaufteWare);
    }
}
