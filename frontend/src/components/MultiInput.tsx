import { useState } from "react";
import type z from "zod";
import { ClosableInputButton } from "./MultiInputButtons";
import SearchableDropdown from "./SearchableDropdown";

type MultiInputProps<T extends z.ZodType> = {
  placeholder: string;
  url: string;
  schema: T;
  values: z.infer<T>[];
  onChange: (items: z.infer<T>[]) => void;
  comparator: (item: z.infer<T>) => any;
  getLabel: (item: z.infer<T>) => string;
  getType: (item: z.infer<T>) => string;
  bgColor: string;
  inputStyle: string;
};

export default function MultiInput<T extends z.ZodType>({
  placeholder,
  url,
  schema,
  values,
  onChange,
  comparator,
  getLabel,
  getType,
  bgColor,
  inputStyle,
}: MultiInputProps<T>) {
  const [input, setInput] = useState("");
  const [valueList, setValueList] = useState<z.infer<T>[]>(values);

  const handleValueSelection = (t: z.infer<T>) => {
    if (!valueList.some((v) => comparator(v) == comparator(t))) {
      const updateValues = [...valueList, t];
      setValueList(updateValues);
      setInput("");
      onChange(updateValues);
    }
  };

  const removeValue = (item: z.infer<T>) => {
    const updatedValues = valueList.filter(
      (t) => comparator(item) !== comparator(t),
    );
    setValueList(updatedValues);
    onChange(updatedValues);
  };

  return (
    <div>
      <div className={`${bgColor} p-2`}>
        <div className="flex flex-wrap gap-4">
          {valueList.map((tag, i) => (
            <ClosableInputButton
              value={tag}
              removeItem={() => removeValue(tag)}
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
            className={`${inputStyle}`}
          />
        </div>
      </div>
      <SearchableDropdown
        url={url}
        input={input}
        schema={schema}
        getLabel={getLabel}
        onSelect={handleValueSelection}
      />
    </div>
  );
}
