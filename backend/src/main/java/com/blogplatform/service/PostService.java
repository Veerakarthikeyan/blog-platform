package com.blogplatform.service;

import com.blogplatform.dto.PageResponse;
import com.blogplatform.dto.PostRequest;
import com.blogplatform.dto.PostResponse;
import com.blogplatform.exception.ApiException;
import com.blogplatform.model.Post;
import com.blogplatform.model.User;
import com.blogplatform.repository.CommentRepository;
import com.blogplatform.repository.PostRepository;
import com.blogplatform.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository,
                       CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<PostResponse> list(String search, int page, int size) {
        Pageable pageable = pageable(page, size);
        Page<Post> result = (search == null || search.isBlank())
                ? postRepository.findAll(pageable)
                : postRepository.findByTitleContainingIgnoreCase(search.trim(), pageable);
        return toPage(result);
    }

    @Transactional(readOnly = true)
    public PageResponse<PostResponse> listMine(String username, int page, int size) {
        return toPage(postRepository.findByAuthorUsername(username, pageable(page, size)));
    }

    @Transactional(readOnly = true)
    public PostResponse get(Long id) {
        return toResponse(find(id));
    }

    @Transactional
    public PostResponse create(PostRequest request, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
        Post post = new Post();
        post.setTitle(request.title().trim());
        post.setContent(request.content().trim());
        post.setAuthor(author);
        return toResponse(postRepository.save(post));
    }

    @Transactional
    public PostResponse update(Long id, PostRequest request, String username) {
        Post post = find(id);
        if (!post.getAuthor().getUsername().equals(username)) {
            throw ApiException.forbidden("You can only edit your own posts");
        }
        post.setTitle(request.title().trim());
        post.setContent(request.content().trim());
        return toResponse(postRepository.save(post));
    }

    @Transactional
    public void delete(Long id, String username) {
        Post post = find(id);
        if (!post.getAuthor().getUsername().equals(username)) {
            throw ApiException.forbidden("You can only delete your own posts");
        }
        postRepository.delete(post);
    }

    // ---------- helpers ----------
    private Post find(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Post not found with id " + id));
    }

    private Pageable pageable(int page, int size) {
        return PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50),
                Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    private PageResponse<PostResponse> toPage(Page<Post> page) {
        return new PageResponse<>(
                page.getContent().stream().map(this::toResponse).toList(),
                page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
    }

    private PostResponse toResponse(Post p) {
        return new PostResponse(
                p.getId(), p.getTitle(), p.getContent(),
                p.getAuthor().getId(), p.getAuthor().getUsername(),
                p.getCreatedAt(), p.getUpdatedAt(),
                commentRepository.countByPostId(p.getId()));
    }
}
