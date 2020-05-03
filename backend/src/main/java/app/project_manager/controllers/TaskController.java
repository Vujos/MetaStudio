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

import app.project_manager.models.Task;
import app.project_manager.services.TaskService;

@CrossOrigin(origins = { "http://localhost:4200" })
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    TaskService taskService;

    @RequestMapping()
    public ResponseEntity<Iterable<Task>> getTasks() {
        return new ResponseEntity<Iterable<Task>>(taskService.getTasks(), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        Optional<Task> task = taskService.getTaskById(id);
        if (task.isPresent()) {
            return new ResponseEntity<Task>(task.get(), HttpStatus.OK);
        }
        return new ResponseEntity<Task>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseEntity<Task> addTask(@RequestBody Task task) {
        return new ResponseEntity<Task>(task, taskService.addTask(task));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Task> updateTask(@PathVariable String id, @RequestBody Task task) {
        taskService.updateTask(id, task);
        return new ResponseEntity<Task>(task, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Task> removeTask(@PathVariable String id) {
        try {
            taskService.removeTask(id);
        } catch (Exception e) {
            return new ResponseEntity<Task>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Task>(HttpStatus.NO_CONTENT);
    }

}
