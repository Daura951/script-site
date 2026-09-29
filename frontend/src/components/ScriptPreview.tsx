import { useNavigate } from "react-router";
import type { Script } from "../types/ScriptTypes";
import { InputButton } from "./MultiInputButtons";
import ReactMarkdown from "react-markdown";

type ScriptPreviewProps = {
  script: Script;
};

export default function ScriptPreview({ script }: ScriptPreviewProps) {
  const nav = useNavigate();

  return (
    <div
      className="border  rounded-lg border-white/20 w-xs md:w-5xl flex flex-col gap-2 bg-blue-950 shadow hover:shadow-blue-200 hover:cursor-pointer"
      onClick={() => nav(`/scripts/${script.id}`)}
    >
      <div className="p-2">
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
      <div className="text-white/50 px-2 py-4 border-y border-white/20 truncate">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="inline">{children} </p>,
          }}
        >
          {script.content.replace(/!\[Page [0-9]* Image]\(\/images\/.*/, "")}
        </ReactMarkdown>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-2 mt-2 p-2">
        {script.tags.map((tag, i) => (
          <InputButton valueType={tag.type} label={tag.tag} key={i} />
        ))}
      </div>

      <div className="text-slate-400 px-2">
        <p>Created: {new Date(script.createDate).toLocaleDateString()}</p>
        {script.modifyDate && (
          <p>Modified: {new Date(script.modifyDate).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
}
