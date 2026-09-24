import { useState } from "react";
import { Tag } from "../types/ScriptTypes";
import SearchableDropdown from "./SearchableDropdown";
import { ClosableTagButton } from "./TagButtons";
import { Env } from "../Env";

type TagInputProps = {
  values: Tag[];
};

export default function TagInput({ values }: TagInputProps) {
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<Tag[]>(values);

  const handleTagSelection = (t: Tag) => {
    if (!tags.some((v) => v.id == t.id)) {
      setTags((prev) => [...prev, t]);
      setTag("");
    }
  };

  const removeTag = (i: number) => {
    setTags((prev) => {
      const latestTags = prev.filter((t) => i !== t.id);
      return latestTags;
    });
  };

  return (
    <div>
      <div className="bg-blue-900/40 p-2">
        <div className="flex flex-wrap gap-4 max-w-xl">
          {tags.map((tag, i) => (
            <ClosableTagButton tag={tag} removeTag={removeTag} key={i} />
          ))}
          <input
            type="text"
            onChange={(e) => setTag(e.target.value)}
            value={tag}
            placeholder="tags"
            className="outline-none"
          />
        </div>
      </div>
      <SearchableDropdown
        url={`${Env.API_BASE_URL}/tags`}
        input={tag}
        schema={Tag}
        getLabel={(tag) => tag.tag}
        onSelect={handleTagSelection}
      />
    </div>
  );
}
