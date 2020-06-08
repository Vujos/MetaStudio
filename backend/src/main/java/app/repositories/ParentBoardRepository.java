package app.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import app.models.ParentBoard;

@Repository
public interface ParentBoardRepository extends MongoRepository<ParentBoard, Long> {
    Optional<ParentBoard> findById(String id);
}