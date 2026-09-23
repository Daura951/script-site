package com.gov.script_site.entity;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "scripts")
@NoArgsConstructor
@Data
public class Script {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @EqualsAndHashCode.Exclude
    private User author;

    private String title;

    @Lob
    private String content;

    private Instant createDate;

    private Instant modifyDate;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "script_tag_link", joinColumns = @JoinColumn(name = "script_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    @EqualsAndHashCode.Exclude
    private Set<Tag> tags;

    private Boolean approved;

    public Script(User author, String title, String content, Set<Tag> tags) {
        this.author = author;
        this.title = title;
        this.content = content;
        this.tags = tags;
        this.approved = false;
        this.createDate = Instant.now();
    }

    public Script(User author, String title, String content) {
        this.author = author;
        this.title = title;
        this.content = content;
        this.tags = new HashSet<>();
        this.approved = false;
        this.createDate = Instant.now();
    }

    public void addTag(Tag tag) {
        tags.add(tag);
        tag.getScripts().add(this);
    }

    public void removeTag(Tag tag) {
        tags.remove(tag);
        tag.getScripts().remove(this);
    }

}
