package com.springboot.VetService.Util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UtilCoverageTest {

    @Test
    void testResponseMessageDefaultConstructor() {

        ResponseMessage<String> response =
                new ResponseMessage<>();

        response.setMessage("Success");
        response.setStatus(200);
        response.setData("Data");

        assertEquals("Success",
                response.getMessage());

        assertEquals(200,
                response.getStatus());

        assertEquals("Data",
                response.getData());
    }

    @Test
    void testResponseMessageParameterizedConstructor() {

        ResponseMessage<String> response =
                new ResponseMessage<>(
                        "Created",
                        201,
                        "Payload"
                );

        assertEquals("Created",
                response.getMessage());

        assertEquals(201,
                response.getStatus());

        assertEquals("Payload",
                response.getData());
    }
}