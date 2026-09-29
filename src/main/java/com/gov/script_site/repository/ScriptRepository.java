package com.gov.script_site.repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gov.script_site.entity.Script;

public interface ScriptRepository extends JpaRepository<Script, Long> {

    @Query("""
            SELECT s FROM Script s WHERE
                (:title IS NULL OR s.title LIKE %:title%) AND
                (:tagIds IS NULL OR EXISTS(SELECT t FROM s.tags t WHERE t.id IN :tagIds)) AND
                (:authorIds IS NULL OR s.author.id IN :authorIds) AND
                (:createDate IS NULL OR s.createDate >= :createDate) AND
                (:modDate IS NULL OR s.modifyDate >= :modDate)
                ORDER BY
                    CASE WHEN (:createSort IS NULL OR :createSort = 'ASC') THEN s.createDate END ASC,
                    CASE WHEN :createSort=  'DESC' THEN s.createDate END DESC,
                    CASE WHEN (:modSort IS NOT NULL AND :modSort = 'ASC') THEN s.modifyDate END ASC,
                    CASE WHEN (:modSort IS NOT NULL AND :modSort = 'DESC') THEN s.modifyDate END DESC
                 """)
    List<Script> searchScripts(@Param("title") String title, @Param("authorIds") List<UUID> userIds,
            @Param("tagIds") List<Long> tagIds, @Param("createDate") Instant createDate,
            @Param("createSort") String createSort, @Param("modDate") Instant modDate,
            @Param("modSort") String modSort);

}
