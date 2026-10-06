import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ImageCropper from "../components/ImageCropper";
import ImageDisplay from "../components/ImageDisplay";
import Loader from "../components/Loader";
import MarkdownParser from "../components/MarkdownParser";
import MultiInput from "../components/MultiInput";
import YesNoModal from "../components/YesNoModal";
import { Env } from "../Env";
import { apiFetch } from "../hooks/ApiClient";
import {
  Script,
  ScriptImage,
  ScriptSubmission,
  Tag,
} from "../types/ScriptTypes";
import SuccessModal from "../components/SuccessModal";

export default function ScriptEditPage() {
  const { scriptId } = useParams<{ scriptId: string }>();
  const id = Number(scriptId);
  const [typedScriptContent, setTypedScriptContent] = useState("");
  const [scriptImages, setScriptImages] = useState<ScriptImage[]>([]);
  const [scriptTitle, setScriptTitle] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [editImage, setEditImage] = useState<ScriptImage | null>(null);
  const [showSubmitmodal, setShowSubmitModal] = useState(false);
  const [showScriptResultModal, setShowScriptResultModal] = useState(false);
  const nav = useNavigate();

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

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

  const imageUploadMutation = useMutation({
    mutationKey: ["imageUpload", scriptId],
    mutationFn: async (image: File) => {
      const formData = new FormData();
      formData.append("imageFile", image);

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
        return parse.data;
      }
      throw Error(parse.error.issues[0].message);
    },
  });

  const scriptSubmitMutation = useMutation({
    mutationKey: ["scriptSubmit", scriptId],
    mutationFn: async (): Promise<Script> => {
      const scriptSubmission: ScriptSubmission = {
        title: scriptTitle,
        tags: tags.map((tag) => tag.id),
        content: typedScriptContent,
        scriptImages: scriptImages,
      };
      const response = await fetch(`${Env.API_BASE_URL}/scripts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(scriptSubmission),
      });

      if (!response.ok) {
        throw new Error("Error has occured");
      }
      const result = await response.json();
      return Script.parse(result);
    },
    onSettled: () => {
      setShowScriptResultModal(true);
    },
  });

  useEffect(() => {
    if (!script) return;

    setTypedScriptContent(script?.content ?? "");
    setScriptTitle(script?.title ?? "");

    const images = script.images;
    if (images !== undefined) {
      const sortedImages = script.images?.sort(
        (a, b) => a.scriptOrder - b.scriptOrder,
      );
      setScriptImages(sortedImages ?? []);
    }
  }, [script]);

  const submitScript = async () => {
    setShowSubmitModal(false);
    await scriptSubmitMutation.mutateAsync();
  };

  return (
    <div className="pb-10 pt-20  flex justify-center flex-col flex-1 text-white items-center  bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
      {isLoading && !script && <Loader />}

      <div className="flex md:hidden  bg-blue-900 rounded-t  w-full">
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex-1 py-2 text-sm rounded-t ${activeTab === "edit" ? "bg-blue-600 font-semibold" : "text-white/70"}`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2 text-sm rounded-t ${activeTab === "preview" ? "bg-blue-600 font-semibold" : "text-white/70"}`}
        >
          Preview
        </button>
      </div>

      {editImage && (
        <ImageCropper
          imageToEdit={editImage}
          assetId={script?.assetId ?? ""}
          onCancel={() => {
            setEditImage(null);
          }}
          onCrop={(img) => {
            setScriptImages((images) =>
              images.map((image) => (image.id === img.id ? img : image)),
            );
            setEditImage(null);
          }}
        />
      )}

      {script && (
        <div className="bg-blue-950 items-center justify-between rounded flex flex-col">
          <div className="flex flex-col md:flex-row">
            <div
              className={`${activeTab === "preview" ? "hidden md:block" : "block"}`}
            >
              <textarea
                className="bg-white p-3 md:rounded-t text-black w-screen md:w-2xl h-80 md:h-125"
                value={typedScriptContent}
                onChange={(e) => setTypedScriptContent(e.target.value)}
              />
            </div>
            <div
              className={`${activeTab === "edit" ? "hidden md:block" : "block"}`}
            >
              <div className="bg-blue-900/40 md:border border-white/10 p-3 md:rounded-t w-full md:w-2xl h-80 md:h-125 overflow-auto ">
                <MarkdownParser
                  markdown={typedScriptContent}
                  images={scriptImages}
                  assetId={script.assetId ?? ""}
                />
              </div>
            </div>
          </div>

          <div className="p-2 w-full  border-white/20 flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                value={scriptTitle}
                placeholder="Title"
                className="bg-white rounded text-black px-2"
                onChange={(e) => setScriptTitle(e.target.value)}
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
                  OnImageUpload={(image) =>
                    imageUploadMutation.mutateAsync(image)
                  }
                />
              </div>
            )}

            <button
              className="bg-blue-500 p-2 rounded w-full hover:cursor-pointer hover:bg-blue-600"
              onClick={() => setShowSubmitModal(true)}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <YesNoModal
        open={showSubmitmodal}
        header="Confirm"
        message="Are you sure you would like to submit this script?"
        OnNoClick={() => setShowSubmitModal(false)}
        OnYesClick={submitScript}
      />
      {showScriptResultModal && (
        <SuccessModal
          onSuccess={() => nav(`/scripts/${scriptId}`)}
          onError={() => setShowScriptResultModal(false)}
          isSuccess={scriptSubmitMutation.isSuccess}
          message={
            scriptSubmitMutation.isSuccess
              ? "Script submitted successfully and is awaiting review"
              : (scriptSubmitMutation.error?.message ??
                "Failed to submit script")
          }
        />
      )}
    </div>
  );
}
