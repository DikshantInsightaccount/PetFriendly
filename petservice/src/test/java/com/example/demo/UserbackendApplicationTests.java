package com.example.demo;

import com.example.demo.Service.PetService;
import com.example.demo.entities.Petentity;
import com.example.demo.repositories.PetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserbackendApplicationTests {

	@Mock
	private PetRepository petRepository;

	@InjectMocks
	private PetService petService;

	private Petentity pet;

	@BeforeEach
	void setup() {
		MockitoAnnotations.openMocks(this);

		pet = new Petentity();

		pet.setName("Dog");
		pet.setOwnerId(100L);
		pet.setDeleted(false);
	}

	@Test
	void testGetAllPets() {
		when(petRepository.findByIsDeletedFalse()).thenReturn(List.of(pet));

		List<Petentity> result = petService.getAllpets();

		assertEquals(1, result.size());
		verify(petRepository).findByIsDeletedFalse();
	}
	@Test
	void testGetPetsByOwner() {
		when(petRepository.findByOwnerIdAndIsDeletedFalse(100L))
				.thenReturn(List.of(pet));

		List<Petentity> result = petService.getPetsByOwner(100L);

		assertEquals(1, result.size());
	}

	@Test
	void testGetPetSecure_Owner() {
		when(petRepository.findByIdAndIsDeletedFalse(1L))
				.thenReturn(Optional.of(pet));

		Petentity result = petService.getPetSecure(1L, 100L, "USER");

		assertNotNull(result);
	}

	@Test
	void testGetPetSecure_Admin() {
		when(petRepository.findByIdAndIsDeletedFalse(1L))
				.thenReturn(Optional.of(pet));

		Petentity result = petService.getPetSecure(1L, 200L, "ADMIN");

		assertNotNull(result);
	}


	@Test
	void testGetPetSecure_Forbidden() {
		when(petRepository.findByIdAndIsDeletedFalse(1L))
				.thenReturn(Optional.of(pet));

		assertThrows(ResponseStatusException.class, () ->
				petService.getPetSecure(1L, 200L, "USER"));
	}


	@Test
	void testGetPetSecure_NotFound() {
		when(petRepository.findByIdAndIsDeletedFalse(1L))
				.thenReturn(Optional.empty());

		assertThrows(ResponseStatusException.class, () ->
				petService.getPetSecure(1L, 100L, "USER"));
	}


	@Test
	void testAddPetSuccess() {

		when(petRepository.save(any())).thenReturn(pet);

		Petentity result = petService.addpets(pet);

		assertNotNull(result);
	}

	@Test
	void testAddPet_WithId() throws Exception {

		// ✅ set private id using reflection
		java.lang.reflect.Field field = Petentity.class.getDeclaredField("id");
		field.setAccessible(true);
		field.set(pet, 1L);

		assertThrows(ResponseStatusException.class, () ->
				petService.addpets(pet));
	}

	@Test
	void testAddPet_NoName() {

		pet.setName("");

		assertThrows(ResponseStatusException.class, () ->
				petService.addpets(pet));
	}

	@Test
	void testAddPet_NoOwner() {

		pet.setOwnerId(null);

		assertThrows(ResponseStatusException.class, () ->
				petService.addpets(pet));
	}


	@Test
	void testUpdatePet() {
		Petentity updated = new Petentity();
		updated.setName("Cat");

		when(petRepository.findByIdAndIsDeletedFalse(1L))
				.thenReturn(Optional.of(pet));
		when(petRepository.save(any())).thenReturn(pet);

		Petentity result = petService.updatePetSecure(1L, 100L, "USER", updated);

		assertEquals("Cat", result.getName());
	}


	@Test
	void testUpdatePet_NoName() {
		Petentity updated = new Petentity(); // name null

		when(petRepository.findByIdAndIsDeletedFalse(1L))
				.thenReturn(Optional.of(pet));

		assertThrows(ResponseStatusException.class, () ->
				petService.updatePetSecure(1L, 100L, "USER", updated));
	}


	@Test
	void testPatchPet_AllFields() {
		Petentity patch = new Petentity();
		patch.setName("Tiger");
		patch.setBreed("Persian");
		patch.setGender("Male");
		patch.setDateOfBirth(java.time.LocalDate.now());

		when(petRepository.findByIdAndIsDeletedFalse(1L))
				.thenReturn(Optional.of(pet));
		when(petRepository.save(any())).thenReturn(pet);

		Petentity result = petService.patchPetSecure(1L, 100L, "USER", patch);

		assertEquals("Tiger", result.getName());
		assertEquals("Persian", result.getBreed());
		assertEquals("Male", result.getGender());
		assertNotNull(result.getDateOfBirth());
	}


	@Test
	void testPatchPet_NoChange() {
		Petentity patch = new Petentity(); // all null

		when(petRepository.findByIdAndIsDeletedFalse(1L))
				.thenReturn(Optional.of(pet));
		when(petRepository.save(any())).thenReturn(pet);

		Petentity result = petService.patchPetSecure(1L, 100L, "USER", patch);

		assertEquals("Dog", result.getName());
	}


	@Test
	void testDeletePet() {
		when(petRepository.findByIdAndIsDeletedFalse(1L))
				.thenReturn(Optional.of(pet));
		when(petRepository.save(any())).thenReturn(pet);

		String result = petService.deleteSecure(1L, 100L, "USER");

		assertTrue(pet.isDeleted());
		assertEquals("Pet soft-deleted successfully", result);
	}

	@Test
	void testDeletePet_Forbidden() {
		when(petRepository.findByIdAndIsDeletedFalse(1L))
				.thenReturn(Optional.of(pet));

		assertThrows(ResponseStatusException.class, () ->
				petService.deleteSecure(1L, 200L, "USER"));
	}
}