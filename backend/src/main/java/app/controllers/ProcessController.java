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

import com.fasterxml.jackson.annotation.JsonView;

import app.models.Process;
import app.services.ProcessService;
import app.utils.View.HideOptionalProperties;

@CrossOrigin(origins={"http://localhost:4200"})
@RestController
@RequestMapping("/process")
public class ProcessController {

    @Autowired
    ProcessService processService;

    @JsonView(HideOptionalProperties.class)
    @RequestMapping()
    public ResponseEntity<Iterable<Process>> getProcesses() {
        return new ResponseEntity<Iterable<Process>>(processService.getProcesses(), HttpStatus.OK);
    }

    @JsonView(HideOptionalProperties.class)
    @RequestMapping(value="/{id}", method=RequestMethod.GET)
    public ResponseEntity<Process> getProcessById(@PathVariable Long id) {
        Optional<Process> process = processService.getProcessById(id);
        if(process.isPresent()) {
            return new ResponseEntity<Process>(process.get(), HttpStatus.OK);
        }
        return new ResponseEntity<Process>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value="", method=RequestMethod.POST)
    public ResponseEntity<Process> addProcess(@RequestBody Process Processes) {
        processService.addProcess(Processes);
        return new ResponseEntity<Process>(Processes, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.PUT)
    public ResponseEntity<Process> updateProcess(@PathVariable Long id, @RequestBody Process Processes) {
        processService.updateProcess(id, Processes);
        return new ResponseEntity<Process>(Processes, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.DELETE)
    public ResponseEntity<Process> removeProcess(@PathVariable Long id) {
        try {
            processService.removeProcess(id);
        }catch (Exception e) {
            return new ResponseEntity<Process>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Process>(HttpStatus.NO_CONTENT);
    }

}
