package app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import app.models.ProductRole;

@Repository
public interface ProductRoleRepository extends JpaRepository<ProductRole, Long> {

}