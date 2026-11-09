package com.blogplatform.controller;

import com.blogplatform.dto.PageResponse;
import com.blogplatform.dto.PostRequest;
import com.blogplatform.dto.PostResponse;
import com.blogplatform.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public PageResponse<PostResponse> list(@RequestParam(required = false) String search,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "6") int size) {
        return postService.list(search, page, size);
    }

    @GetMapping("/mine")
    public PageResponse<PostResponse> mine(Authentication auth,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "50") int size) {
        return postService.listMine(auth.getName(), page, size);
    }

    @GetMapping("/{id}")
    public PostResponse get(@PathVariable Long id) {
        return postService.get(id);
    }

    @PostMapping
    public ResponseEntity<PostResponse> create(@Valid @RequestBody PostRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.create(request, auth.getName()));
    }

    @PutMapping("/{id}")
    public PostResponse update(@PathVariable Long id, @Valid @RequestBody PostRequest request,
                               Authentication auth) {
        return postService.update(id, request, auth.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        postService.delete(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
