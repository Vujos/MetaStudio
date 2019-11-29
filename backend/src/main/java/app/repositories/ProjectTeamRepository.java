package app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import app.models.ProjectTeam;

@Repository
public interface ProjectTeamRepository extends JpaRepository<ProjectTeam, Long> {

}