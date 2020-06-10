package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import app.models.Activity;
import app.models.Card;
import app.models.Checklist;
import app.models.Skill;
import app.repositories.CardRepository;
import app.repositories.SkillRepository;

@Service
public class CardService {

    @Autowired
    private CardRepository cardRepo;

    @Autowired
    private ChecklistService checklistService;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private SkillRepository skillRepo;

    public CardService() {
    }

    public Iterable<Card> getCards() {
        return cardRepo.findAll();
    }

    public Optional<Card> getCardById(String id) {
        Optional<Card> card = cardRepo.findById(id);
        if (card.isPresent()) {
            card.get().getSkills().removeIf(obj -> obj.getDeleted() == true);
        }
        return card;
    }

    public HttpStatus addCard(Card card) {
        for (Checklist checklist : card.getChecklists()) {
            checklistService.addChecklist(checklist);
        }
        for (Activity activity : card.getActivities()){
            activityService.addActivity(activity);
        }
        cardRepo.save(card);
        return HttpStatus.CREATED;
    }

    public void removeCard(String id) {
        Optional<Card> card = cardRepo.findById(id);
        cardRepo.delete(card.get());
    }

    public void updateCard(String id, Card card) {
        Optional<Card> oldCard = cardRepo.findById(id);
        if (oldCard.isPresent()) {
            card.setId(oldCard.get().getId());
            for (Checklist checklist : card.getChecklists()) {
                String checklistId = checklist.getId();
                Optional<Checklist> oldChecklist = checklistService.getChecklistById(checklistId);
                if (oldChecklist.isPresent()) {
                    checklistService.updateChecklist(checklistId, checklist);
                }
                if (checklistId == null) {
                    checklistService.addChecklist(checklist);
                }
            }
            for(Activity activity: card.getActivities()){
                if(activity.getId() == null){
                    activityService.addActivity(activity);
                }
            }
            for (Skill skill : card.getSkills()){
                skillRepo.save(skill);
            }
            cardRepo.save(card);
        }
    }

}
