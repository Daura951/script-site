import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Loader from "../components/Loader";
import MarkdownParser from "../components/MarkdownParser";
import MultiInput from "../components/MultiInput";
import { Env } from "../Env";
import { apiFetch } from "../hooks/ApiClient";
import { Script, ScriptImage, Tag } from "../types/ScriptTypes";
import ImageDisplay from "../components/ImageDisplay";

export default function ScriptEditPage() {
  const { scriptId } = useParams<{ scriptId: string }>();
  const id = Number(scriptId);
  const [typedScriptContent, setTypedScriptContent] = useState("");
  const [scriptImages, setScriptImages] = useState<ScriptImage[]>([]);
  const [scriptTitle, setScriptTitle] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);

  const { data: script, isLoading } = useQuery({
    queryKey: ["scriptEditQuery", id],
    queryFn: async (): Promise<Script> =>
      apiFetch(`${Env.API_BASE_URL}/scripts/${id}`, {
        method: "GET",
        schema: Script,
      }),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  useEffect(() => {
    if (!script) return;

    setTypedScriptContent(script?.content ?? "");
    setScriptTitle(script?.title ?? "");
    setScriptImages(script?.images ?? []);
  }, [script]);

  return (
    <div className="pb-10 pt-20  flex justify-center flex-col flex-1 text-white items-center  bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
      {isLoading && <Loader />}
      {script && (
        <div className="bg-blue-950  pt-2  items-center justify-between rounded flex flex-col">
          <div className="flex">
            <textarea
              className="bg-white p-2 rounded text-black w-2xl h-125"
              value={typedScriptContent}
              onChange={(e) => setTypedScriptContent(e.target.value)}
            />
            <div className="p-2 rounded max-w-2xl h-125 overflow-auto whitespace-pre-wrap prose prose-invert">
              <MarkdownParser
                markdown={typedScriptContent}
                assetId={script.assetId ?? ""}
                images={scriptImages}
              />
            </div>
          </div>

          <div className="p-2 w-full border-t border-white/20 flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                value={scriptTitle}
                placeholder="Title"
                className="bg-white rounded text-black px-2"
              />
            </div>
            <div className="flex flex-col">
              <label>Tags</label>
              <MultiInput
                placeholder="tags"
                url={`${Env.API_BASE_URL}/tags`}
                schema={Tag}
                values={tags}
                onChange={(t) => setTags(t)}
                comparator={(tag) => tag.id}
                getLabel={(tag) => tag.tag}
                getType={(tag) => tag.type}
                bgColor="bg-white rounded"
                inputStyle="w-full text-black px-2"
              />
            </div>
            {scriptImages && (
              <div className="flex flex-col gap-2">
                <label>Images</label>
                <ImageDisplay
                  images={scriptImages}
                  scriptId={script.id}
                  assetId={script.assetId ?? ""}
                  OnChange={setScriptImages}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
