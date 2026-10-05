package com.gov.script_site.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "scriptImages")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ScriptImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long scriptOrder;

    @ManyToOne
    @JoinColumn(name = "scriptId")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Script script;

    private String name;

    private Integer cropX, cropY, cropPositionX, cropPositionY, cropWidth, cropHeight, zoom;

    public ScriptImage(Long scriptOrder, Script script, String name) {
        this.scriptOrder = scriptOrder;
        this.script = script;
        this.name = name;
        cropX = 0;
        cropY = 0;
        cropPositionX = 0;
        cropPositionY = 0;
        zoom = 1;
        cropWidth = 300;
        cropHeight = 300;
    }

}
