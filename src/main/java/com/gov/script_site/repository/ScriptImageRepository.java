package com.gov.script_site.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gov.script_site.entity.ScriptImage;

public interface ScriptImageRepository extends JpaRepository<ScriptImage, UUID> {

}
