package app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import app.models.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

}