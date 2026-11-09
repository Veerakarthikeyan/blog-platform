package com.blogplatform.dto;

import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        String content,
        Long authorId,
        String authorName,
        Long postId,
        LocalDateTime createdAt) {
}
