import { useNavigate } from "react-router";
import type { Script } from "../types/ScriptTypes";
import { TagButton } from "./TagButtons";

type ScriptPreviewProps = {
  script: Script;
};

export default function ScriptPreview({ script }: ScriptPreviewProps) {
  const nav = useNavigate();

  return (
    <div
      className="border p-2 rounded-lg border-white/20 w-xs md:w-5xl flex flex-col gap-2 bg-blue-950 shadow hover:shadow-blue-200 hover:cursor-pointer"
      onClick={() => nav(`/script/${script.id}`)}
    >
      <div>
        <h2>{script.title}</h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            nav(`/users/${script.author.id}`);
          }}
          className="hover:underline hover:cursor-pointer"
        >
          {script.author.username}
        </button>
      </div>
      <hr />
      <p className="text-white/50 text-ellipsis overflow-hidden">
        {script.content}
      </p>

      <div className="flex flex-wrap md:flex-nowrap gap-2">
        {script.tags.map((tag, i) => (
          <TagButton tag={tag} key={i} />
        ))}
      </div>
    </div>
  );
}
