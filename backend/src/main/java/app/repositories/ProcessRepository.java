package app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import app.models.Process;

@Repository
public interface ProcessRepository extends JpaRepository<Process, Long> {

}