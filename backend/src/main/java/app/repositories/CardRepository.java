package app.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import app.models.Card;

@Repository
public interface CardRepository extends MongoRepository<Card, Long> {
    Optional<Card> findById(String id);
}