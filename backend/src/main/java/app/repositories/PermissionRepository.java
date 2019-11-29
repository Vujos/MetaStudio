package app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import app.models.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {

}