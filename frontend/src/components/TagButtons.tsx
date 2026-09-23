import type { Tag } from "../types/ScriptTypes";

type TagButtonProps = {
  tag: Tag;
};
type ClosableTagButtonProps = {
  tag: Tag;
  removeTag: (id: number) => void;
};

const colorDictionary: { [id: string]: { bg: string; hoverBg: string } } = {
  ["VO_GENRE"]: { bg: "bg-red-600", hoverBg: "bg-red-800" },
  ["ACTING_GENRE"]: { bg: "bg-sky-600", hoverBg: "bg-sky-900" },
  ["SCRIPT_TYPE"]: { bg: "bg-green-600", hoverBg: "bg-green-800" },
};

export const TagButton = ({ tag }: TagButtonProps) => {
  return (
    <>
      <div className="hidden hover:bg-red-800 hover:bg-sky-900 hover:bg-green-800" />
      <button
        key={tag.id}
        className={`flex ${colorDictionary[tag.type].bg} rounded hover:cursor-pointer ${"hover:" + colorDictionary[tag.type].hoverBg}`}
      >
        <p className="px-2">{tag.tag}</p>
      </button>
    </>
  );
};

export const ClosableTagButton = ({
  tag,
  removeTag,
}: ClosableTagButtonProps) => {
  return (
    <div
      key={tag.id}
      className={`flex ${colorDictionary[tag.type].bg} rounded`}
    >
      <p className="px-2">{tag.tag}</p>
      <button
        onClick={() => removeTag(tag.id)}
        className={`${colorDictionary[tag.type].hoverBg} px-1.5 hover:cursor-pointer"`}
      >
        &times;
      </button>
    </div>
  );
};
