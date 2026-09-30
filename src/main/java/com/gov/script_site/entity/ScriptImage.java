package com.gov.script_site.entity;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "scriptImages")
@AllArgsConstructor
@Data
public class ScriptImage {

    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "script_id")
    @EqualsAndHashCode.Exclude
    private Script script;

    private String path;
}
