package com.springboot.VetService.Exceptions;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AllExceptionCoverageTest {

    @Test
    void testAllExceptions() {

        VetServiceException ex1 =
                new VetServiceException("error");

        assertEquals("error", ex1.getMessage());

        RuntimeException ex2 =
                new RuntimeException("runtime");

        assertEquals("runtime", ex2.getMessage());
    }

}