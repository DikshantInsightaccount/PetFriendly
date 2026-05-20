package com.springboot.VetService.Exception;

import com.springboot.VetService.Exceptions.VetServiceException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ExceptionCoverageTest {

    @Test
    void testVetServiceException() {

        VetServiceException ex =
                new VetServiceException("Test Exception");

        assertEquals(
                "Test Exception",
                ex.getMessage()
        );
    }
}