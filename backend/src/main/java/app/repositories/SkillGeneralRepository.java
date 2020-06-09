package app.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import app.models.SkillGeneral;

@Repository
public interface SkillGeneralRepository extends MongoRepository<SkillGeneral, Long> {
    Optional<SkillGeneral> findByName(String name);

    Optional<SkillGeneral> findById(String id);
}