package com.mehrmarkt.mehrmarktsystem.Service.ware;

import com.mehrmarkt.mehrmarktsystem.Repository.WareRepository;
import com.mehrmarkt.mehrmarktsystem.model.ware.Ware;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WareServiceImpl implements WareService{

    @Autowired
    private WareRepository wareRepository;


}
