package com.gov.script_site.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gov.script_site.entity.Script;

public interface ScriptRepository extends JpaRepository<Script, Long> {

}
