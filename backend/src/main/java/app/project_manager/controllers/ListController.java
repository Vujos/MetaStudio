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

import app.project_manager.models.List;
import app.project_manager.services.ListService;

@CrossOrigin(origins = { "http://localhost:4200" })
@RestController
@RequestMapping("/api/lists")
public class ListController {

    @Autowired
    ListService listService;

    @RequestMapping()
    public ResponseEntity<Iterable<List>> getLists() {
        return new ResponseEntity<Iterable<List>>(listService.getLists(), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<List> getListById(@PathVariable String id) {
        Optional<List> list = listService.getListById(id);
        if (list.isPresent()) {
            return new ResponseEntity<List>(list.get(), HttpStatus.OK);
        }
        return new ResponseEntity<List>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseEntity<List> addList(@RequestBody List list) {
        return new ResponseEntity<List>(list, listService.addList(list));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<List> updateList(@PathVariable String id, @RequestBody List list) {
        listService.updateList(id, list);
        return new ResponseEntity<List>(list, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<List> removeList(@PathVariable String id) {
        try {
            listService.removeList(id);
        } catch (Exception e) {
            return new ResponseEntity<List>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<List>(HttpStatus.NO_CONTENT);
    }

}
