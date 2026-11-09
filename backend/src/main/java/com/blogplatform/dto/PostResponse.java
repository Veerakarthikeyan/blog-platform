package com.blogplatform.dto;

import java.time.LocalDateTime;

public record PostResponse(
        Long id,
        String title,
        String content,
        Long authorId,
        String authorName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        long commentCount) {
}
