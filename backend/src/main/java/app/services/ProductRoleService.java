package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.models.ProductRole;
import app.repositories.ProductRoleRepository;

@Service
public class ProductRoleService {

    @Autowired
    private ProductRoleRepository productRoleRepo;

    public ProductRoleService() {
    }

    public Iterable<ProductRole> getProductRoles() {
        return productRoleRepo.findAll();
    }

    public Optional<ProductRole> getProductRoleById(Long id) {
        return productRoleRepo.findById(id);
    }

    public void addProductRole(ProductRole productRole) {
        productRoleRepo.save(productRole);
    }

    public void removeProductRole(Long id) {
        Optional<ProductRole> productRole = productRoleRepo.findById(id);
        productRoleRepo.delete(productRole.get());
    }

    public void updateProductRole(Long id, ProductRole productRole) {
        Optional<ProductRole> Pro = productRoleRepo.findById(id);
        if(Pro.isPresent()) {
            productRole.setId(Pro.get().getId());
            productRoleRepo.save(productRole);
        }
    }

}
