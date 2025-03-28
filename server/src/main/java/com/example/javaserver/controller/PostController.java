package com.example.javaserver.controller;

import com.example.javaserver.model.Post;
import com.example.javaserver.repository.PostRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

import java.util.List;


@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping
    public List<Post> getPosts() {
        return postRepository.findAll();
    }

    @PostMapping
    public Post createPost(@RequestBody Post post) {
    post.setCreatedAt(LocalDateTime.now());
    return postRepository.save(post);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable int id) {
        postRepository.deleteById(id);
    }
@PutMapping("/{id}")
public Post updatePost(@PathVariable int id, @RequestBody Post updatedPost) {
    return postRepository.findById(id)
        .map(post -> {
            post.setTitle(updatedPost.getTitle());    // ✅ 세미콜론(;) 추가
            post.setContent(updatedPost.getContent()); // ✅ 변수명 수정 + 세미콜론
            post.setAuthor(updatedPost.getAuthor());   // ✅ 빠진 author도 설정
            return postRepository.save(post);          // ✅ 최종 저장
        })
        .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다. ID: " + id));
}
    
}
