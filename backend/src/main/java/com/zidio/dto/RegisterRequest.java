package com.zidio.dto;

public record RegisterRequest(String email, String password, String role, String name) {}