package com.gov.script_site.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gov.script_site.entity.Script;

public interface ScriptRepository extends JpaRepository<Script, Long> {

    @Query("SELECT s FROM Script s JOIN s.tags t  where s.title LIKE %:title% AND s.author.id IN :authorIds and t.id IN :tagIds")
    List<Script> searchScripts(@Param("title") String title, @Param("authorIds") List<UUID> userIds, @Param("tagIds") List<Long> tagIds);

}
