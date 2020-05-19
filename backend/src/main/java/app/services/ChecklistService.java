package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import app.models.Checklist;
import app.models.Task;
import app.repositories.ChecklistRepository;

@Service
public class ChecklistService {

    @Autowired
    private ChecklistRepository checklistRepo;

    @Autowired
    private TaskService taskService;

    public ChecklistService() {
    }

    public Iterable<Checklist> getChecklists() {
        return checklistRepo.findAll();
    }

    public Optional<Checklist> getChecklistById(String id) {
        return checklistRepo.findById(id);
    }

    public HttpStatus addChecklist(Checklist checklist) {
        checklistRepo.save(checklist);
        for (Task task : checklist.getTasks()) {
            taskService.addTask(task);
        }
        return HttpStatus.CREATED;
    }

    public void removeChecklist(String id) {
        Optional<Checklist> checklist = checklistRepo.findById(id);
        checklistRepo.delete(checklist.get());
    }

    public void updateChecklist(String id, Checklist checklist) {
        Optional<Checklist> oldChecklist = checklistRepo.findById(id);
        if (oldChecklist.isPresent()) {
            checklist.setId(oldChecklist.get().getId());
            for (Task task : checklist.getTasks()) {
                String taskId = task.getId();
                Optional<Task> oldTask = taskService.getTaskById(taskId);
                if (oldTask.isPresent()) {
                    taskService.updateTask(taskId, task);
                }
                if (taskId == null) {
                    taskService.addTask(task);
                }
            }
            checklistRepo.save(checklist);
        }
    }

}
