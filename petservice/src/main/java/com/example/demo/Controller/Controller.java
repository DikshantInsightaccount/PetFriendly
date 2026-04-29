package com.example.demo.Controller;


import com.example.demo.Service.PetService;
import com.example.demo.entities.Petentity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/pet")
@CrossOrigin()

public class Controller {
    private PetService petService;
    public Controller(PetService petService) {
        this.petService = petService;
    }
    @GetMapping(path="/",produces = MediaType.APPLICATION_JSON_VALUE)//handlermapping
    public ResponseEntity<List<Petentity>> findAllEmps(){
        return ResponseEntity.ok(petService.getAllpets());
    }
    @PostMapping(path = "/add", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Petentity> storeTodo(@RequestBody Petentity petentity) {
        return ResponseEntity.ok(petService.addpets(petentity));
    }
    @GetMapping(path="/{id}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Petentity> getOnePet(@PathVariable Long id){
        return ResponseEntity.ok(petService.getOnePet(id));
    }
    @GetMapping(path="/owner/{ownerId}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Petentity>> getPetsByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(petService.getPetsByOwner(ownerId));
    }


    @PutMapping(path="/updatepet/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Optional<Petentity>> updatePet(@PathVariable Long id,
                                                         @RequestBody Petentity updatedPet) {
        return ResponseEntity.ok(petService.updatePet(id, updatedPet));
    }

    @PatchMapping(path="/updatepatch/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Petentity> patchPet(@PathVariable Long id,
                                              @RequestBody Petentity patchPet) {
        return ResponseEntity.ok(petService.patchPet(id, patchPet));
    }
    @DeleteMapping(path="/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        return ResponseEntity.ok(petService.delete(id));
    }

}
