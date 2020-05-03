package app.project_manager.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import app.project_manager.models.List;

@Repository
public interface ListRepository extends MongoRepository<List, Long> {
    Optional<List> findById(String id);
}