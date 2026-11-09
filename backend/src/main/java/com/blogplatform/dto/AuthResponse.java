package com.blogplatform.dto;

public record AuthResponse(String token, Long id, String username, String email) {
}
