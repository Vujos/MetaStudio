package app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import app.models.SDLC;

@Repository
public interface SDLCRepository extends JpaRepository<SDLC, Long> {

}