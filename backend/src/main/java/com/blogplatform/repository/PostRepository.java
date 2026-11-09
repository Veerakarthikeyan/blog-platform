package com.blogplatform.repository;

import com.blogplatform.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<Post> findByAuthorUsername(String username, Pageable pageable);
}
