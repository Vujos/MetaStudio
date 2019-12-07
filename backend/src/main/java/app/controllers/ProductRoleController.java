package app.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonView;

import app.models.ProductRole;
import app.services.ProductRoleService;
import app.utils.View.HideOptionalProperties;

@CrossOrigin(origins={"http://localhost:4200"})
@RestController
@RequestMapping("/productrole")
public class ProductRoleController {

    @Autowired
    ProductRoleService productRoleService;

    @JsonView(HideOptionalProperties.class)
    @RequestMapping()
    public ResponseEntity<Iterable<ProductRole>> getProductRoles() {
        return new ResponseEntity<Iterable<ProductRole>>(productRoleService.getProductRoles(), HttpStatus.OK);
    }

    @JsonView(HideOptionalProperties.class)
    @RequestMapping(value="/{id}", method=RequestMethod.GET)
    public ResponseEntity<ProductRole> getProductRoleById(@PathVariable Long id) {
        Optional<ProductRole> productRole = productRoleService.getProductRoleById(id);
        if(productRole.isPresent()) {
            return new ResponseEntity<ProductRole>(productRole.get(), HttpStatus.OK);
        }
        return new ResponseEntity<ProductRole>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value="", method=RequestMethod.POST)
    public ResponseEntity<ProductRole> addProductRole(@RequestBody ProductRole productRoles) {
        productRoleService.addProductRole(productRoles);
        return new ResponseEntity<ProductRole>(productRoles, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.PUT)
    public ResponseEntity<ProductRole> updateProductRole(@PathVariable Long id, @RequestBody ProductRole productRoles) {
        productRoleService.updateProductRole(id, productRoles);
        return new ResponseEntity<ProductRole>(productRoles, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.DELETE)
    public ResponseEntity<ProductRole> removeProductRole(@PathVariable Long id) {
        try {
            productRoleService.removeProductRole(id);
        }catch (Exception e) {
            return new ResponseEntity<ProductRole>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<ProductRole>(HttpStatus.NO_CONTENT);
    }

}
