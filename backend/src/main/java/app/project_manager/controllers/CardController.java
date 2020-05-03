package app.project_manager.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import app.project_manager.models.Card;
import app.project_manager.services.CardService;

@CrossOrigin(origins = { "http://localhost:4200" })
@RestController
@RequestMapping("/api/cards")
public class CardController {

    @Autowired
    CardService cardService;

    @RequestMapping()
    public ResponseEntity<Iterable<Card>> getCards() {
        return new ResponseEntity<Iterable<Card>>(cardService.getCards(), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<Card> getCardById(@PathVariable String id) {
        Optional<Card> card = cardService.getCardById(id);
        if (card.isPresent()) {
            return new ResponseEntity<Card>(card.get(), HttpStatus.OK);
        }
        return new ResponseEntity<Card>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseEntity<Card> addCard(@RequestBody Card card) {
        return new ResponseEntity<Card>(card, cardService.addCard(card));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Card> updateCard(@PathVariable String id, @RequestBody Card card) {
        cardService.updateCard(id, card);
        return new ResponseEntity<Card>(card, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Card> removeCard(@PathVariable String id) {
        try {
            cardService.removeCard(id);
        } catch (Exception e) {
            return new ResponseEntity<Card>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Card>(HttpStatus.NO_CONTENT);
    }

}
