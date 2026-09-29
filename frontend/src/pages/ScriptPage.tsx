import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Script } from "../types/ScriptTypes";
import { apiFetch } from "../hooks/ApiClient";
import { Env } from "../Env";
import { InputButton } from "../components/MultiInputButtons";
import ReactMarkdown from "react-markdown";

export default function ScriptPage() {
  const { scriptId } = useParams<{ scriptId: string }>();
  const id = Number(scriptId);
  const nav = useNavigate();

  const { data: script, isLoading } = useQuery({
    queryKey: ["scriptQuery"],
    queryFn: async (): Promise<Script> =>
      apiFetch(`${Env.API_BASE_URL}/scripts/${id}`, {
        method: "GET",
        schema: Script,
      }),
  });

  return (
    <div className="pb-10 pt-20  flex justify-center flex-col flex-1 text-white items-center  bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
      {isLoading && (
        <div className="flex gap-2">
          <span className="sr-only">Loading...</span>
          <div className="bg-white w-8 h-8 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="bg-white w-8 h-8 rounded-full animate-bounce [animation-delau:-0.15s]" />
          <div className="bg-white w-8 h-8 rounded-full animate-bounce" />
        </div>
      )}
      <div className="bg-blue-950 border rounded-lg border-white/20 w-full max-w-xs md:max-w-5xl">
        <div className="p-2 flex flex-col gap-2 items-start">
          <h1 className="text-2xl font-medium">{script?.title}</h1>
          <button
            className="text-xl hover:underline hover:cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              nav(`/users/${script?.author?.id}`);
            }}
          >
            {script?.author?.username}
          </button>
        </div>

        <div className="border-y p-4 border-white/20 text-left my-4">
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                <img {...props} className="mb-6 max-w-full  block m-auto" />
              ),
              p: ({ node, ...props }) => (
                <p {...props} className="mb-4 leading-relaxed" />
              ),
            }}
          >
            {script?.content?.replace(
              /\]\(\/images\//g,
              `](${Env.BASE_URL}/images/`,
            )}
          </ReactMarkdown>
        </div>
        <div className="mb-2 ">
          <div className="flex flex-wrap md:flex-nowrap gap-2 mt-2 p-2">
            {script?.tags?.map((tag, i) => (
              <InputButton label={tag.tag} valueType={tag.type} key={i} />
            ))}
          </div>
          <div className=" text-slate-400 px-2">
            {script?.createDate && (
              <p>Created: {new Date(script.createDate).toLocaleDateString()}</p>
            )}
            {script?.modifyDate && (
              <p>Modifed: {new Date(script.modifyDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
