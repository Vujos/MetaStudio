package app.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import app.models.Team;

@Repository
public interface TeamRepository extends MongoRepository<Team, Long> {
    Optional<Team> findByIdAndDeleted(String id, Boolean deleted);
    Optional<Team> findById(String id);
}