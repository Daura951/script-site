import React, { useState } from "react";

type TagInputProps = {
  values: string[];
  onChange: (tags: string[]) => void;
};

export default function TagInput({ values, onChange }: TagInputProps) {
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>(values);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { key } = e;
    const newTag = tag.trim();

    if (
      (key === "Enter" || key === "," || key === "tab") &&
      newTag.length &&
      !tags.includes(newTag)
    ) {
      e.preventDefault();
      setTags((prev) => {
        const latestTags = [...prev, newTag];
        onChange(latestTags);
        return latestTags;
      });
      setTag("");
    } else if (key === "Backspace" && !newTag.length && tags.length) {
      const tagsCopy = tags;
      const lastTag = tagsCopy.pop();
      setTags(tagsCopy);
      onChange(tagsCopy);
      setTag(lastTag ?? "");
    }
  };

  const removeTag = (i: number) => {
    setTags((prev) => {
      const latestTags = prev.filter((_, id) => i !== id);
      onChange(latestTags);
      return latestTags;
    });
  };

  return (
    <div className="bg-blue-900/40 p-2">
      <div className="flex flex-wrap gap-4 max-w-xl">
        {tags.map((tag, i) => (
          <div key={i} className="flex  bg-gray-600">
            <p className="px-2">{tag}</p>
            <button
              onClick={() => removeTag(i)}
              className="bg-gray-800 px-1.5 hover:cursor-pointer"
            >
              &times;
            </button>
          </div>
        ))}
        <input
          type="text"
          onChange={(e) => setTag(e.target.value)}
          value={tag}
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder="tags"
          className="outline-none"
        />
      </div>
    </div>
  );
}
