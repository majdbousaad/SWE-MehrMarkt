package com.mehrmarkt.mehrmarktsystem.Repository;

import com.mehrmarkt.mehrmarktsystem.model.produkt.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    Optional<Product> getByEAN(String ean);
    Optional<Product> getByEANAndLieferant_Id(String ean, int lieferant_id);
    boolean existsByEAN(String ean);
    
    boolean existsByEANAndLieferant_IdIsNot(String EAN, int lieferant_id);

    List<Product> getAllByLieferantId(int lieferant_id);
}
