package app.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import app.models.Skill;

@Repository
public interface SkillRepository extends MongoRepository<Skill, Long> {
    Optional<Skill> findByName(String name);

    Optional<Skill> findById(String id);
}