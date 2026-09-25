import { useState } from "react";
import type z from "zod";
import { ClosableInputButton } from "./MultiInputButtons";
import SearchableDropdown from "./SearchableDropdown";

type MultiInputProps<T extends z.ZodType> = {
  placeholder: string;
  url: string;
  schema: T;
  values: z.infer<T>[];
  comparator: (item: z.infer<T>) => any;
  getLabel: (item: z.infer<T>) => string;
  getType: (item: z.infer<T>) => string;
};

export default function MultiInput<T extends z.ZodType>({
  placeholder,
  url,
  schema,
  values,
  comparator,
  getLabel,
  getType,
}: MultiInputProps<T>) {
  const [input, setInput] = useState("");
  const [valueList, setValueList] = useState<z.infer<T>[]>(values);

  const handleTagSelection = (t: z.infer<T>) => {
    if (!valueList.some((v) => comparator(v) == comparator(t))) {
      setValueList((prev) => [...prev, t]);
      setInput("");
    }
  };

  const removeTag = (item: z.infer<T>) => {
    setValueList((prev) => {
      const latestTags = prev.filter((t) => comparator(item) !== comparator(t));
      return latestTags;
    });
  };

  return (
    <div>
      <div className="bg-blue-900/40 p-2">
        <div className="flex flex-wrap gap-4 max-w-xl">
          {valueList.map((tag, i) => (
            <ClosableInputButton
              value={tag}
              removeItem={() => removeTag(tag)}
              label={getLabel(tag)}
              valueType={getType(tag)}
              key={i}
            />
          ))}
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder={placeholder}
            className="outline-none w-full"
          />
        </div>
      </div>
      <SearchableDropdown
        url={url}
        input={input}
        schema={schema}
        getLabel={getLabel}
        onSelect={handleTagSelection}
      />
    </div>
  );
}
