import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ImageDisplay from "../components/ImageDisplay";
import Loader from "../components/Loader";
import MarkdownParser from "../components/MarkdownParser";
import MultiInput from "../components/MultiInput";
import { Env } from "../Env";
import { apiFetch } from "../hooks/ApiClient";
import { Script, ScriptImage, Tag } from "../types/ScriptTypes";
import ImageCropper from "../components/ImageCropper";

export default function ScriptEditPage() {
  const { scriptId } = useParams<{ scriptId: string }>();
  const id = Number(scriptId);
  const [typedScriptContent, setTypedScriptContent] = useState("");
  const [scriptImages, setScriptImages] = useState<ScriptImage[]>([]);
  const [scriptTitle, setScriptTitle] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [editImage, setEditImage] = useState<{
    image: File;
    scriptImage: ScriptImage | null;
  } | null>(null);

  const {
    data: script,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["scriptEditQuery", id],
    queryFn: async (): Promise<Script> =>
      apiFetch(`${Env.API_BASE_URL}/scripts/${id}`, {
        method: "GET",
        schema: Script,
      }),
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  const imageUploadMutation = useMutation({
    mutationKey: ["imageUpload", scriptId],
    mutationFn: async ({
      image,
      scriptImage,
    }: {
      image: File;
      scriptImage: ScriptImage | null;
    }) => {
      const formData = new FormData();
      formData.append("imageFile", image);
      if (scriptImage) {
        formData.append("imageId", String(scriptImage?.id));
      }

      const response = await fetch(
        `${Env.API_BASE_URL}/scripts/${scriptId}/images`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Unable to upload image. Please try again");
      }

      const result = await response.json();
      const parse = ScriptImage.safeParse(result);

      if (parse.success) {
        await refetch();
        setEditImage(null);
        return parse.data;
      }
      throw Error(parse.error.issues[0].message);
    },
  });

  useEffect(() => {
    if (!script) return;

    if (typedScriptContent.trim() === "") {
      setTypedScriptContent(script?.content ?? "");
    }

    if (scriptTitle.trim() === "") {
      setScriptTitle(script?.title ?? "");
    }
    setScriptImages(script?.images ?? []);
  }, [script]);

  return (
    <div className="pb-10 pt-20  flex justify-center flex-col flex-1 text-white items-center  bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
      {isLoading && <Loader />}

      {editImage && (
        <ImageCropper
          imageToEdit={editImage}
          onCancel={() => {
            setEditImage(null);
          }}
          onCrop={(img) => {
            imageUploadMutation.mutateAsync(img);
          }}
        />
      )}

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
                  assetId={script.assetId ?? ""}
                  OnImageEdit={setEditImage}
                  OnChange={setScriptImages}
                  OnImageUpload={(image, scriptImage) =>
                    imageUploadMutation.mutateAsync({ image, scriptImage })
                  }
                />
              </div>
            )}

            <button className="bg-blue-500 p-2 rounded w-full hover:cursor-pointer hover:bg-blue-600">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
