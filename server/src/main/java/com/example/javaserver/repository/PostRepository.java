package com.example.javaserver.repository;

import com.example.javaserver.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Integer> {}
