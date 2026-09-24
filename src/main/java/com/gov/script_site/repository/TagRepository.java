package com.gov.script_site.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gov.script_site.entity.Tag;
import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {

    List<Tag> findByTagIn(List<String> tags);

    List<Tag> findByTagStartingWithIgnoreCase(String tag);
}
