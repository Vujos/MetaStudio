package app.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import app.models.ChildBoard;

@Repository
public interface ChildBoardRepository extends MongoRepository<ChildBoard, Long> {
    Optional<ChildBoard> findById(String id);
}