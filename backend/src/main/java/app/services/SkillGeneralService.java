package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import app.models.SkillGeneral;
import app.repositories.SkillGeneralRepository;

@Service
public class SkillGeneralService {

    @Autowired
    private SkillGeneralRepository skillGeneralRepo;

    public SkillGeneralService() {
    }

    public Iterable<SkillGeneral> getSkillGenerals() {
        return skillGeneralRepo.findAll();
    }

    public Optional<SkillGeneral> getSkillGeneralById(String id) {
        return skillGeneralRepo.findById(id);
    }

    public HttpStatus addSkillGeneral(SkillGeneral skillGeneral) {
        skillGeneralRepo.save(skillGeneral);
        return HttpStatus.CREATED;
    }

    public void removeSkillGeneral(String id) {
        Optional<SkillGeneral> skillGeneral = skillGeneralRepo.findById(id);
        skillGeneralRepo.delete(skillGeneral.get());
    }

    public void updateSkillGeneral(String id, SkillGeneral skillGeneral) {
        Optional<SkillGeneral> oldSkillGeneral = skillGeneralRepo.findById(id);
        if (oldSkillGeneral.isPresent()) {
            skillGeneral.setId(oldSkillGeneral.get().getId());
            skillGeneralRepo.save(skillGeneral);
        }
    }

}
