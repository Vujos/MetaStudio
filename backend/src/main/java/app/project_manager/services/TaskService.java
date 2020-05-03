package app.project_manager.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import app.project_manager.models.Task;
import app.project_manager.repositories.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepo;

    public TaskService() {
    }

    public Iterable<Task> getTasks() {
        return taskRepo.findAll();
    }

    public Optional<Task> getTaskById(String id) {
        return taskRepo.findById(id);
    }

    public HttpStatus addTask(Task task) {
        taskRepo.save(task);
        return HttpStatus.CREATED;
    }

    public void removeTask(String id) {
        Optional<Task> task = taskRepo.findById(id);
        taskRepo.delete(task.get());
    }

    public void updateTask(String id, Task task) {
        Optional<Task> oldTask = taskRepo.findById(id);
        if (oldTask.isPresent()) {
            task.setId(oldTask.get().getId());
            taskRepo.save(task);
        }
    }

}
