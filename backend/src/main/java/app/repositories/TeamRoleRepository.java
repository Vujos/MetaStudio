package app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import app.models.TeamRole;

@Repository
public interface TeamRoleRepository extends JpaRepository<TeamRole, Long> {

}