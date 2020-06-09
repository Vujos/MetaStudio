package app.controllers;

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

import app.models.SkillGeneral;
import app.services.SkillGeneralService;

@CrossOrigin(origins = { "http://localhost:4200" })
@RestController
@RequestMapping("/api/skillGenerals")
public class SkillGeneralController {

    @Autowired
    SkillGeneralService skillGeneralService;

    @RequestMapping()
    public ResponseEntity<Iterable<SkillGeneral>> getSkillGenerals() {
        return new ResponseEntity<Iterable<SkillGeneral>>(skillGeneralService.getSkillGenerals(), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<SkillGeneral> getSkillGeneralById(@PathVariable String id) {
        Optional<SkillGeneral> skillGeneral = skillGeneralService.getSkillGeneralById(id);
        if (skillGeneral.isPresent()) {
            return new ResponseEntity<SkillGeneral>(skillGeneral.get(), HttpStatus.OK);
        }
        return new ResponseEntity<SkillGeneral>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseEntity<SkillGeneral> addSkillGeneral(@RequestBody SkillGeneral skillGeneral) {
        return new ResponseEntity<SkillGeneral>(skillGeneral, skillGeneralService.addSkillGeneral(skillGeneral));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<SkillGeneral> updateSkillGeneral(@PathVariable String id, @RequestBody SkillGeneral skillGeneral) {
        skillGeneralService.updateSkillGeneral(id, skillGeneral);
        return new ResponseEntity<SkillGeneral>(skillGeneral, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<SkillGeneral> removeSkillGeneral(@PathVariable String id) {
        try {
            skillGeneralService.removeSkillGeneral(id);
        } catch (Exception e) {
            return new ResponseEntity<SkillGeneral>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<SkillGeneral>(HttpStatus.NO_CONTENT);
    }

}
