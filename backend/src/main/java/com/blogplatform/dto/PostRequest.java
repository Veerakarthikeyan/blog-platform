package com.blogplatform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 200, message = "Title can be at most 200 characters")
        String title,

        @NotBlank(message = "Content is required")
        String content) {
}
