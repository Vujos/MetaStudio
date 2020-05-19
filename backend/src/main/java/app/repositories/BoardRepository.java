package app.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import app.models.Board;

@Repository
public interface BoardRepository extends MongoRepository<Board, Long> {
    Optional<Board> findByIdAndDeleted(String id, Boolean deleted);
    Optional<Board> findById(String id);
}