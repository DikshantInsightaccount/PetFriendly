package com.Spring.AuthService.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ResponseMessageTest {

    @Test
    void testResponseMessageConstructor() {

        ResponseMessage<String> response =
                new ResponseMessage<>(
                        "Success",
                        200,
                        "Data"
                );

        assertEquals(
                "Success",
                response.getMessage()
        );

        assertEquals(
                200,
                response.getStatus()
        );

        assertEquals(
                "Data",
                response.getData()
        );
    }

    @Test
    void testResponseMessageSettersAndGetters() {

        ResponseMessage<String> response =
                new ResponseMessage<>();

        response.setMessage("Created");
        response.setStatus(201);
        response.setData("User");

        assertEquals(
                "Created",
                response.getMessage()
        );

        assertEquals(
                201,
                response.getStatus()
        );

        assertEquals(
                "User",
                response.getData()
        );
    }

    @Test
    void testResponseMessageWithNullData() {

        ResponseMessage<String> response =
                new ResponseMessage<>(
                        "No Data",
                        204,
                        null
                );

        assertEquals(
                "No Data",
                response.getMessage()
        );

        assertEquals(
                204,
                response.getStatus()
        );

        assertNull(
                response.getData()
        );
    }
}