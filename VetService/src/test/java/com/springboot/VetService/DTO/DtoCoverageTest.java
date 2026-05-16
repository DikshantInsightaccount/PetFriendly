package com.springboot.VetService.DTO;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DtoCoverageTest {

    @Test
    void testVetSummaryDto() {

        VetSummaryDto dto =
                new VetSummaryDto(
                        1L,
                        100L,
                        "Dr John",
                        "john@test.com"
                );

        assertEquals(1L, dto.getVetId());
        assertEquals(100L, dto.getUserId());
        assertEquals("Dr John", dto.getName());
        assertEquals("john@test.com", dto.getEmail());
    }
}