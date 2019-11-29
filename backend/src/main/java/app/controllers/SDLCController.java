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

import app.models.SDLC;
import app.services.SDLCService;
import app.utils.View.HideOptionalProperties;

@CrossOrigin(origins={"http://localhost:4200"})
@RestController
@RequestMapping("/sdlc")
public class SDLCController {

    @Autowired
    SDLCService sDLCService;

    @JsonView(HideOptionalProperties.class)
    @RequestMapping()
    public ResponseEntity<Iterable<SDLC>> getSDLCs() {
        return new ResponseEntity<Iterable<SDLC>>(sDLCService.getSDLCs(), HttpStatus.OK);
    }

    @JsonView(HideOptionalProperties.class)
    @RequestMapping(value="/{id}", method=RequestMethod.GET)
    public ResponseEntity<SDLC> getSDLCById(@PathVariable Long id) {
        Optional<SDLC> sDLC = sDLCService.getSDLCById(id);
        if(sDLC.isPresent()) {
            return new ResponseEntity<SDLC>(sDLC.get(), HttpStatus.OK);
        }
        return new ResponseEntity<SDLC>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value="", method=RequestMethod.POST)
    public ResponseEntity<SDLC> addSDLC(@RequestBody SDLC SDLCs) {
        sDLCService.addSDLC(SDLCs);
        return new ResponseEntity<SDLC>(SDLCs, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.PUT)
    public ResponseEntity<SDLC> updateSDLC(@PathVariable Long id, @RequestBody SDLC SDLCs) {
        sDLCService.updateSDLC(id, SDLCs);
        return new ResponseEntity<SDLC>(SDLCs, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.DELETE)
    public ResponseEntity<SDLC> removeSDLC(@PathVariable Long id) {
        try {
            sDLCService.removeSDLC(id);
        }catch (Exception e) {
            return new ResponseEntity<SDLC>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<SDLC>(HttpStatus.NO_CONTENT);
    }

}
