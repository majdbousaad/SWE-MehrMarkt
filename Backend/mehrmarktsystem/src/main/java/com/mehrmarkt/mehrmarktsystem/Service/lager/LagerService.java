package com.mehrmarkt.mehrmarktsystem.Service.lager;

import com.mehrmarkt.mehrmarktsystem.model.lager.Lager;

import java.util.List;
import java.util.Optional;

public interface LagerService {
    Lager createLager(String lagerort);

    Lager getLager(String lagerort);

    boolean existsByName(String lagerort);

    void updateLager(Lager lager);

    int updateMaxSize(String lagerort, int maxSize);

    List<Lager> getAllLager();

    Optional<Lager> getLagerIfExists(String lagerort);

    Optional<Lager> getStandardLager();

    void initializeLagerIfNotInitialized();

}
