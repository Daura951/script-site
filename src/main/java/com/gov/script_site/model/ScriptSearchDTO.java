package com.gov.script_site.model;

import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ScriptSearchDTO {
    private String scriptTitle;
    private List<TagDTO> tags;
    private List<UserDTO> authors;
    private SearchDateDTO createDate;
    private SearchDateDTO modifyDate;

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class SearchDateDTO {
        private Instant date;
        private String sort;
    }
}
