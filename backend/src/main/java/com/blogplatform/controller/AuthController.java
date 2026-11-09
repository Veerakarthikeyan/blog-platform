package com.blogplatform.controller;

import com.blogplatform.dto.AuthResponse;
import com.blogplatform.dto.LoginRequest;
import com.blogplatform.dto.RegisterRequest;
import com.blogplatform.exception.ApiException;
import com.blogplatform.model.User;
import com.blogplatform.repository.UserRepository;
import com.blogplatform.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        String username = request.username().trim();
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByUsername(username)) {
            throw ApiException.conflict("Username is already taken");
        }
        if (userRepository.existsByEmail(email)) {
            throw ApiException.conflict("Email is already registered");
        }

        User user = userRepository.save(new User(username, email, passwordEncoder.encode(request.password())));
        return ResponseEntity.status(HttpStatus.CREATED).body(toAuthResponse(user));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.username().trim())
                .orElseThrow(() -> ApiException.unauthorized("Invalid username or password"));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw ApiException.unauthorized("Invalid username or password");
        }
        return toAuthResponse(user);
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse(jwtUtil.generateToken(user.getUsername()),
                user.getId(), user.getUsername(), user.getEmail());
    }
}
