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

import app.models.Permission;
import app.services.PermissionService;
import app.utils.View.HideOptionalProperties;

@CrossOrigin(origins={"http://localhost:4200"})
@RestController
@RequestMapping("/permission")
public class PermissionController {

    @Autowired
    PermissionService permissionService;

    @JsonView(HideOptionalProperties.class)
    @RequestMapping()
    public ResponseEntity<Iterable<Permission>> getPermissions() {
        return new ResponseEntity<Iterable<Permission>>(permissionService.getPermissions(), HttpStatus.OK);
    }

    @JsonView(HideOptionalProperties.class)
    @RequestMapping(value="/{id}", method=RequestMethod.GET)
    public ResponseEntity<Permission> getPermissionById(@PathVariable Long id) {
        Optional<Permission> permission = permissionService.getPermissionById(id);
        if(permission.isPresent()) {
            return new ResponseEntity<Permission>(permission.get(), HttpStatus.OK);
        }
        return new ResponseEntity<Permission>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value="", method=RequestMethod.POST)
    public ResponseEntity<Permission> addPermission(@RequestBody Permission Permissions) {
        permissionService.addPermission(Permissions);
        return new ResponseEntity<Permission>(Permissions, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.PUT)
    public ResponseEntity<Permission> updatePermission(@PathVariable Long id, @RequestBody Permission Permissions) {
        permissionService.updatePermission(id, Permissions);
        return new ResponseEntity<Permission>(Permissions, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.DELETE)
    public ResponseEntity<Permission> removePermission(@PathVariable Long id) {
        try {
            permissionService.removePermission(id);
        }catch (Exception e) {
            return new ResponseEntity<Permission>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Permission>(HttpStatus.NO_CONTENT);
    }

}
