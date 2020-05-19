package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import app.models.Card;
import app.models.List;
import app.repositories.ListRepository;

@Service
public class ListService {

    @Autowired
    private ListRepository listRepo;

    @Autowired
    private CardService cardService;

    public ListService() {
    }

    public Iterable<List> getLists() {
        return listRepo.findAll();
    }

    public Optional<List> getListById(String id) {
        return listRepo.findById(id);
    }

    public HttpStatus addList(List list) {
        for (Card card : list.getCards()) {
            cardService.addCard(card);
        }
        listRepo.save(list);
        return HttpStatus.CREATED;
    }

    public void removeList(String id) {
        Optional<List> list = listRepo.findById(id);
        listRepo.delete(list.get());
    }

    public void updateList(String id, List list) {
        Optional<List> oldList = listRepo.findById(id);
        if (oldList.isPresent()) {
            list.setId(oldList.get().getId());
            for (Card card : list.getCards()) {
                String cardId = card.getId();
                Optional<Card> oldCard = cardService.getCardById(cardId);
                if (oldCard.isPresent()) {
                    cardService.updateCard(cardId, card);
                }
                if (cardId == null) {
                    cardService.addCard(card);
                }
            }
            listRepo.save(list);
        }
    }

}
