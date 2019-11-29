package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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

    public Optional<Role> getRoleById(Long id) {
        return roleRepo.findById(id);
    }

    public void addRole(Role role) {
        roleRepo.save(role);
    }

    public void removeRole(Long id) {
        Optional<Role> role = roleRepo.findById(id);
        roleRepo.delete(role.get());
    }

    public void updateRole(Long id, Role role) {
        Optional<Role> Rol = roleRepo.findById(id);
        if(Rol.isPresent()) {
            role.setId(Rol.get().getId());
            roleRepo.save(role);
        }
    }

}
