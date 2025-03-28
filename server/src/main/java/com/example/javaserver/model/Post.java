package com.example.javaserver.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;
    private String content;
    private String author;

    @Column(name = "creatd_at") // 컬럼명이 creatd_at인 점 주의!
    private LocalDateTime createdAt;

    public Post() {}

    // Getter & Setter
    public int getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getAuthor() { return author; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setAuthor(String author) { this.author = author; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
