package app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import app.models.ProjectTeamProject;

@Repository
public interface ProjectTeamProjectRepository extends JpaRepository<ProjectTeamProject, Long> {

}