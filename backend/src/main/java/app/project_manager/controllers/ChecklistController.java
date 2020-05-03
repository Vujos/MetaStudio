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

import app.project_manager.models.Checklist;
import app.project_manager.services.ChecklistService;

@CrossOrigin(origins = { "http://localhost:4200" })
@RestController
@RequestMapping("/api/checklists")
public class ChecklistController {

    @Autowired
    ChecklistService checklistService;

    @RequestMapping()
    public ResponseEntity<Iterable<Checklist>> getChecklists() {
        return new ResponseEntity<Iterable<Checklist>>(checklistService.getChecklists(), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<Checklist> getChecklistById(@PathVariable String id) {
        Optional<Checklist> checklist = checklistService.getChecklistById(id);
        if (checklist.isPresent()) {
            return new ResponseEntity<Checklist>(checklist.get(), HttpStatus.OK);
        }
        return new ResponseEntity<Checklist>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseEntity<Checklist> addChecklist(@RequestBody Checklist checklist) {
        return new ResponseEntity<Checklist>(checklist, checklistService.addChecklist(checklist));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Checklist> updateChecklist(@PathVariable String id, @RequestBody Checklist checklist) {
        checklistService.updateChecklist(id, checklist);
        return new ResponseEntity<Checklist>(checklist, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Checklist> removeChecklist(@PathVariable String id) {
        try {
            checklistService.removeChecklist(id);
        } catch (Exception e) {
            return new ResponseEntity<Checklist>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Checklist>(HttpStatus.NO_CONTENT);
    }

}
