package com.gov.script_site.entity;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tags")
@NoArgsConstructor
@Data
public class Tag {

    public enum TagType {
        VO_GENRE, ACTING_GENRE, SCRIPT_TYPE
    };

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String tag;

    private Instant createDate;

    @ManyToMany(mappedBy = "tags")
    @EqualsAndHashCode.Exclude
    private Set<Script> scripts;

    @Enumerated(EnumType.STRING)
    private TagType type;

    public Tag(String tag, TagType type) {
        this.tag = tag;
        this.type = type;
        this.createDate = Instant.now();
        this.scripts = new HashSet<>();
    }

}