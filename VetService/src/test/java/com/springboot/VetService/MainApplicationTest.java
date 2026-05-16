package com.springboot.VetService;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MainApplicationTest {

    @Test
    void testApplicationClass() {

        VetServiceApplication app =
                new VetServiceApplication();

        assertNotNull(app);
    }
}