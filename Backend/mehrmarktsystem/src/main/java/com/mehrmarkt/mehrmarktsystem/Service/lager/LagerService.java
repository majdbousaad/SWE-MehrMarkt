package com.mehrmarkt.mehrmarktsystem.Service.lager;

import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;

public interface LagerService {
    Lager createLager(String lagerort);

    Lager getLager(String lagerort);

    boolean existsByName(String lagerort);

    void updateLager(Lager lager);

    int updateMaxSize(String lagerort, int maxSize);

}
