package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.models.SDLC;
import app.repositories.SDLCRepository;

@Service
public class SDLCService {

    @Autowired
    private SDLCRepository sDLCRepo;

    public SDLCService() {
    }

    public Iterable<SDLC> getSDLCs() {
        return sDLCRepo.findAll();
    }

    public Optional<SDLC> getSDLCById(Long id) {
        return sDLCRepo.findById(id);
    }

    public void addSDLC(SDLC sDLC) {
        sDLCRepo.save(sDLC);
    }

    public void removeSDLC(Long id) {
        Optional<SDLC> sDLC = sDLCRepo.findById(id);
        sDLCRepo.delete(sDLC.get());
    }

    public void updateSDLC(Long id, SDLC sDLC) {
        Optional<SDLC> SDL = sDLCRepo.findById(id);
        if(SDL.isPresent()) {
            sDLC.setId(SDL.get().getId());
            sDLCRepo.save(sDLC);
        }
    }

}
