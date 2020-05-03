package app.project_manager.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import app.project_manager.models.Task;

@Repository
public interface TaskRepository extends MongoRepository<Task, Long> {
    Optional<Task> findById(String id);
}