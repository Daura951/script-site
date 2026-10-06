package com.gov.script_site.entity;

import java.time.Instant;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "scripts")
@NoArgsConstructor
@Data
public class Script {

    public enum ScriptStatus {
        DRAFT, PENDING_APPROVAL, APPROVED
    };

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

    private Instant createDate = Instant.now();

    private Instant modifyDate;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "script_tag_link", joinColumns = @JoinColumn(name = "script_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    @EqualsAndHashCode.Exclude
    private Set<Tag> tags = new HashSet<>();

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "liked_user_script_link", joinColumns = @JoinColumn(name = "script_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    @EqualsAndHashCode.Exclude
    private Set<User> likedByUsers = new HashSet<>();

    @OneToMany(mappedBy = "script", cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    private Set<ScriptImage> images = new HashSet<>();

    private UUID assetId;

    @Enumerated(EnumType.STRING)
    private ScriptStatus status;

    public Script(User author, String title, String content, Set<Tag> tags) {
        this.author = author;
        this.title = title;
        this.content = content;
        this.tags = tags;
        this.status = ScriptStatus.DRAFT;
        this.createDate = Instant.now();
    }

    public Script(User author, String title, String content) {
        this.author = author;
        this.title = title;
        this.content = content;
        this.tags = new HashSet<>();
        this.status = ScriptStatus.APPROVED;
        this.createDate = Instant.now();
    }

    public void addTags(Collection<Tag> tags) {
        for (Tag t : tags) {
            this.tags.add(t);
            t.getScripts().add(this);
        }
    }

    public void addImages(Collection<ScriptImage> images) {
        for (ScriptImage i : images) {
            this.images.add(i);
        }
    }

    public void addImage(ScriptImage image) {
        this.images.add(image);
    }

}
