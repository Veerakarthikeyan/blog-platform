package com.blogplatform.service;

import com.blogplatform.dto.CommentRequest;
import com.blogplatform.dto.CommentResponse;
import com.blogplatform.exception.ApiException;
import com.blogplatform.model.Comment;
import com.blogplatform.model.Post;
import com.blogplatform.model.User;
import com.blogplatform.repository.CommentRepository;
import com.blogplatform.repository.PostRepository;
import com.blogplatform.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> listForPost(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw ApiException.notFound("Post not found with id " + postId);
        }
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public CommentResponse add(Long postId, CommentRequest request, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> ApiException.notFound("Post not found with id " + postId));
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
        Comment comment = new Comment();
        comment.setContent(request.content().trim());
        comment.setPost(post);
        comment.setAuthor(author);
        return toResponse(commentRepository.save(comment));
    }

    /** A comment can be deleted by its author or by the owner of the post. */
    @Transactional
    public void delete(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> ApiException.notFound("Comment not found with id " + commentId));
        boolean isCommentAuthor = comment.getAuthor().getUsername().equals(username);
        boolean isPostOwner = comment.getPost().getAuthor().getUsername().equals(username);
        if (!isCommentAuthor && !isPostOwner) {
            throw ApiException.forbidden("You cannot delete this comment");
        }
        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment c) {
        return new CommentResponse(c.getId(), c.getContent(),
                c.getAuthor().getId(), c.getAuthor().getUsername(),
                c.getPost().getId(), c.getCreatedAt());
    }
}
