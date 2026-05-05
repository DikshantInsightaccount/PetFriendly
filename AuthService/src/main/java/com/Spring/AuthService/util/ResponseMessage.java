package com.Spring.AuthService.util;



public class ResponseMessage<T> {

    private String message;
    private int status;
    private T data;

    public ResponseMessage() {
    }

    public ResponseMessage(String message, int status, T data) {
        this.message = message;
        this.status = status;
        this.data = data;
    }

    // Getters and Setters

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
