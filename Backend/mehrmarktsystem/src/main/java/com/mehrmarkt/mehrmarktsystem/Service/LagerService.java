package com.mehrmarkt.mehrmarktsystem.Service;

import com.mehrmarkt.mehrmarktsystem.model.Lager;

public interface LagerService {
    Lager createLager();

    Lager getLager();

    void updateLager(Lager lager);

    int updateMaxSize(int maxSize);

}
