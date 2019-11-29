package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.models.Product;
import app.repositories.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepo;

    public ProductService() {
    }

    public Iterable<Product> getProducts() {
        return productRepo.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepo.findById(id);
    }

    public void addProduct(Product product) {
        productRepo.save(product);
    }

    public void removeProduct(Long id) {
        Optional<Product> product = productRepo.findById(id);
        productRepo.delete(product.get());
    }

    public void updateProduct(Long id, Product product) {
        Optional<Product> Pro = productRepo.findById(id);
        if(Pro.isPresent()) {
            product.setId(Pro.get().getId());
            productRepo.save(product);
        }
    }

}
