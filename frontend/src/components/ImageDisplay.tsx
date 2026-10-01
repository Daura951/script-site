import { useRef } from "react";
import { Env } from "../Env";
import { ScriptImage } from "../types/ScriptTypes";
import { useMutation } from "@tanstack/react-query";

type ImageDisplayProps = {
  images: ScriptImage[];
  scriptId: number;
  assetId: string;
  OnChange: (imgs: ScriptImage[]) => void;
};

export default function ImageDisplay({
  images,
  scriptId,
  assetId,
  OnChange,
}: ImageDisplayProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const imageUploadMutation = useMutation({
    mutationKey: ["imageUpload", scriptId],
    mutationFn: async (image: File) => {
      const formData = new FormData();
      formData.append("image", image);

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

  const removeImage = (id: number) => {
    const newImages = images.filter((img) => img.id !== id);
    OnChange(newImages);
  };

  const addImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const upload = await imageUploadMutation.mutateAsync(file);
      console.log(upload);
      const newImages = [...images, upload];
      OnChange(newImages);
    }
  };

  return (
    <div className="items-center justify-center flex flex-wrap gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="w-50 overflow-hidden rounded border border-white/20"
        >
          <div className="flex justify-between border-b border-white/20">
            <h2 className="p-2">img_{image.scriptOrder}</h2>
            <button
              className="px-4 bg-red-500 hover:bg-red-800 hover:cursor-pointer"
              onClick={() => removeImage(image.id)}
            >
              X
            </button>
          </div>

          <div className="h-40">
            <img
              src={`${Env.BASE_URL}/images/${assetId}/${image.name}`}
              alt={`Character Image ${image.id}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ))}
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/png, image/jpeg"
        onChange={(e) => addImage(e)}
      />
      <button
        className="w-50 h-50 overflow-hidden rounded border-dashed border-white/20 border hover:bg-blue-900 hover:cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        + Image
      </button>
    </div>
  );
}
