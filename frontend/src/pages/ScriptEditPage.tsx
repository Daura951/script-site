import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Env } from "../Env";
import { apiFetch } from "../hooks/ApiClient";
import { Script } from "../types/ScriptTypes";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

export default function ScriptEditPage() {
  const { scriptId } = useParams<{ scriptId: string }>();
  const id = Number(scriptId);
  const [typedScriptContent, setTypedScriptContent] = useState("");
  const [scriptContent, setScriptContent] = useState("");

  const { data: script, isLoading } = useQuery({
    queryKey: ["scriptEditQuery"],
    queryFn: async (): Promise<Script> =>
      apiFetch(`${Env.API_BASE_URL}/scripts/${id}`, {
        method: "GET",
        schema: Script,
      }),
  });

  useEffect(() => {
    const content = script?.content.replace(
      /\]\(\/images\//g,
      `](${Env.BASE_URL}/images/${script.assetId}/`,
    );
    setTypedScriptContent(content ?? "");
  }, [script]);

  useEffect(() => {
    const content = typedScriptContent.replace(
      /\{img_([1-9]+)\}/g,
      (_, imageNumber) =>
        `![img ${imageNumber} Image](${Env.BASE_URL}/images/${script?.assetId}/script_img_${imageNumber}.png)`,
    );

    console.log(content);
    setScriptContent(content);
  }, [typedScriptContent]);

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
      <div className="bg-blue-950  pt-2  items-center justify-between rounded flex">
        <textarea
          className="bg-white p-2 rounded text-black w-2xl h-125"
          value={typedScriptContent}
          onChange={(e) => setTypedScriptContent(e.target.value)}
        />
        <div className="p-2 rounded max-w-2xl h-125 overflow-auto whitespace-pre-wrap">
          <ReactMarkdown>{scriptContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
