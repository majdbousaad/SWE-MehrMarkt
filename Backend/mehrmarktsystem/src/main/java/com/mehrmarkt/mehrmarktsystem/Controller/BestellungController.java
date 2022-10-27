package com.mehrmarkt.mehrmarktsystem.Controller;

import com.mehrmarkt.mehrmarktsystem.Service.BestellungService;
import com.mehrmarkt.mehrmarktsystem.Service.LieferantService;
import com.mehrmarkt.mehrmarktsystem.Service.ProductService;
import com.mehrmarkt.mehrmarktsystem.model.Bestellung;
import com.mehrmarkt.mehrmarktsystem.model.Product;
import com.mehrmarkt.mehrmarktsystem.model.Ware;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bestellung")
public class BestellungController {

    @Autowired
    private BestellungService bestellungService;

    @Autowired
    private LieferantService lieferantService;

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public String add(@RequestBody Bestellung bestellung){

        for (Ware ware : bestellung.getWaren()){
            Product product = productService.getById(ware.getProduct().getId());
            ware.setProduct(product);
        }


        bestellung.setGesamtPreis(bestellung.calculateGesamtPreis());

        bestellung.setLieferant(
                lieferantService.getById(bestellung.getLieferant().getId())
        );
        bestellung.calculateVors_lieferdatum();
        bestellungService.saveBestellung(bestellung);
        return "New Bestellung is added";
    }

    @GetMapping("/all")
    public List<Bestellung> getAllBestellungen(){
        return bestellungService.getAllBestellungen();
    }
}
