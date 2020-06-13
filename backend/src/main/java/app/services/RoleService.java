package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import app.models.Role;
import app.repositories.RoleRepository;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepo;

    public RoleService() {
    }

    public Iterable<Role> getRoles() {
        return roleRepo.findAll();
    }

    public Iterable<Role> getRolesPageable(Integer page, Integer pageSize) {
        return roleRepo.findAll(PageRequest.of(page, pageSize));
    }

    public Optional<Role> getRoleById(String id) {
        return roleRepo.findById(id);
    }

    public HttpStatus addRole(Role role) {
        roleRepo.save(role);
        return HttpStatus.CREATED;
    }

    public void removeRole(String id) {
        Optional<Role> role = roleRepo.findById(id);
        roleRepo.delete(role.get());
    }

    public void updateRole(String id, Role role) {
        Optional<Role> oldRole = roleRepo.findById(id);
        if (oldRole.isPresent()) {
            role.setId(oldRole.get().getId());
            roleRepo.save(role);
        }
    }

}
