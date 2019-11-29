package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.models.Process;
import app.repositories.ProcessRepository;

@Service
public class ProcessService {

    @Autowired
    private ProcessRepository processRepo;

    public ProcessService() {
    }

    public Iterable<Process> getProcesses() {
        return processRepo.findAll();
    }

    public Optional<Process> getProcessById(Long id) {
        return processRepo.findById(id);
    }

    public void addProcess(Process process) {
        processRepo.save(process);
    }

    public void removeProcess(Long id) {
        Optional<Process> process = processRepo.findById(id);
        processRepo.delete(process.get());
    }

    public void updateProcess(Long id, Process process) {
        Optional<Process> Pro = processRepo.findById(id);
        if(Pro.isPresent()) {
            process.setId(Pro.get().getId());
            processRepo.save(process);
        }
    }

}
