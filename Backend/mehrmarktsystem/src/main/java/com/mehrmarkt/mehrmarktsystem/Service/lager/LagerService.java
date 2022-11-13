package com.mehrmarkt.mehrmarktsystem.Service.lager;

import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;

public interface LagerService {
    Lager createLager();

    Lager getLager();

    void updateLager(Lager lager);

    int updateMaxSize(int maxSize);

}
