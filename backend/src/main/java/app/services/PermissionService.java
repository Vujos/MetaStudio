package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.models.Permission;
import app.repositories.PermissionRepository;

@Service
public class PermissionService {

    @Autowired
    private PermissionRepository permissionRepo;

    public PermissionService() {
    }

    public Iterable<Permission> getPermissions() {
        return permissionRepo.findAll();
    }

    public Optional<Permission> getPermissionById(Long id) {
        return permissionRepo.findById(id);
    }

    public void addPermission(Permission permission) {
        permissionRepo.save(permission);
    }

    public void removePermission(Long id) {
        Optional<Permission> permission = permissionRepo.findById(id);
        permissionRepo.delete(permission.get());
    }

    public void updatePermission(Long id, Permission permission) {
        Optional<Permission> Per = permissionRepo.findById(id);
        if(Per.isPresent()) {
            permission.setId(Per.get().getId());
            permissionRepo.save(permission);
        }
    }

}
