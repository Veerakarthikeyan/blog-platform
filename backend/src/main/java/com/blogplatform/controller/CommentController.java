package com.blogplatform.controller;

import com.blogplatform.dto.CommentRequest;
import com.blogplatform.dto.CommentResponse;
import com.blogplatform.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/posts/{postId}/comments")
    public List<CommentResponse> list(@PathVariable Long postId) {
        return commentService.listForPost(postId);
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> add(@PathVariable Long postId,
                                               @Valid @RequestBody CommentRequest request,
                                               Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.add(postId, request, auth.getName()));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        commentService.delete(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
