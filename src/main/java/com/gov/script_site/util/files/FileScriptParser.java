package com.gov.script_site.util.files;

import com.gov.script_site.entity.Script;
import com.gov.script_site.model.ScriptCreateDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public abstract class FileScriptParser {

    private String fileType;

    public abstract void parseFile(ScriptCreateDTO fileUpload, Script script) throws Exception;

}
