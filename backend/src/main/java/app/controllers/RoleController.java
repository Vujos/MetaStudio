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

import app.models.Role;
import app.services.RoleService;

@CrossOrigin(origins = { "http://localhost:4200" })
@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    RoleService roleService;

    @RequestMapping()
    public ResponseEntity<Iterable<Role>> getRoles() {
        return new ResponseEntity<Iterable<Role>>(roleService.getRoles(), HttpStatus.OK);
    }

    @RequestMapping(value = "/{page}/{pageSize}")
    public ResponseEntity<Iterable<Role>> getRolesPageable(@PathVariable Integer page,
            @PathVariable Integer pageSize) {
        return new ResponseEntity<Iterable<Role>>(roleService.getRolesPageable(page, pageSize),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<Role> getRoleById(@PathVariable String id) {
        Optional<Role> role = roleService.getRoleById(id);
        if (role.isPresent()) {
            return new ResponseEntity<Role>(role.get(), HttpStatus.OK);
        }
        return new ResponseEntity<Role>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseEntity<Role> addRole(@RequestBody Role role) {
        return new ResponseEntity<Role>(role, roleService.addRole(role));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Role> updateRole(@PathVariable String id,
            @RequestBody Role role) {
        roleService.updateRole(id, role);
        return new ResponseEntity<Role>(role, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Role> removeRole(@PathVariable String id) {
        try {
            roleService.removeRole(id);
        } catch (Exception e) {
            return new ResponseEntity<Role>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Role>(HttpStatus.NO_CONTENT);
    }

}
