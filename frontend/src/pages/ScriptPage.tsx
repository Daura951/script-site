import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Env } from "../Env";
import Loader from "../components/Loader";
import MarkdownParser from "../components/MarkdownParser";
import { InputButton } from "../components/MultiInputButtons";
import { AuthContext, type AuthContextType } from "../context/AuthContext";
import { apiFetch } from "../hooks/ApiClient";
import { Script } from "../types/ScriptTypes";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

export default function ScriptPage() {
  const { scriptId } = useParams<{ scriptId: string }>();
  const id = Number(scriptId);
  const authContext = useContext(AuthContext);
  const { username, likedScripts } = authContext as AuthContextType;
  const nav = useNavigate();

  const [liked, setLiked] = useState(likedScripts?.includes(id));

  const { data: script, isLoading } = useQuery({
    queryKey: ["scriptQuery"],
    queryFn: async (): Promise<Script> =>
      apiFetch(`${Env.API_BASE_URL}/scripts/${id}`, {
        method: "GET",
        schema: Script,
      }),
  });

  const onLikeClick = async () => {
    const response = await fetch(`${Env.API_BASE_URL}/scripts/${id}/favorite`);

    if (!response.ok) {
      throw new Error("Error has occured");
    }

    setLiked((prev) => !prev);
  };

  return (
    <div className="pb-10 pt-20  flex justify-center flex-col flex-1 text-white items-center  bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
      {isLoading && <Loader />}
      <div className="bg-blue-950 border rounded-lg border-white/20 w-full max-w-xs md:max-w-5xl">
        <div className="p-2 flex  gap-2 items-start justify-between">
          <div>
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

          {username && script?.author.username === username && (
            <>
              {script?.status !== "APPROVED" && (
                <div className="p-2 bg-yellow-700/50 rounded border border-white/20">
                  Awaiting Approval
                </div>
              )}
              {script?.status === "APPROVED" && (
                <div className="p-2 bg-green-700/50 rounded border border-white/20">
                  Approved
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-y p-4 border-white/20 text-left my-4">
          <MarkdownParser
            assetId={script?.assetId ?? ""}
            images={script?.images ?? []}
            markdown={script?.content ?? ""}
          />
        </div>
        <div className="mb-2">
          <div className="flex flex-wrap md:flex-nowrap gap-2 mt-2 px-4">
            {script?.tags?.map((tag, i) => (
              <InputButton label={tag.tag} valueType={tag.type} key={i} />
            ))}
          </div>
          <div className="flex justify-between p-2">
            <div className=" text-slate-400 px-2">
              {script?.createDate && (
                <p>
                  Created: {new Date(script.createDate).toLocaleDateString()}
                </p>
              )}
              {script?.modifyDate && (
                <p>
                  Modifed: {new Date(script.modifyDate).toLocaleDateString()}
                </p>
              )}
            </div>
            {liked ? (
              <HeartSolid className="size-5" onClick={() => onLikeClick} />
            ) : (
              <HeartOutline className="size-5" onClick={() => onLikeClick} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
