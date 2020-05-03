package app.project_manager.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import app.project_manager.models.Checklist;

@Repository
public interface ChecklistRepository extends MongoRepository<Checklist, Long> {
    Optional<Checklist> findById(String id);
}