import { useRef } from "react";
import { Env } from "../Env";
import { ScriptImage } from "../types/ScriptTypes";
import ImageCard from "./ImageCard";

type ImageDisplayProps = {
  images: ScriptImage[];
  assetId: string;
  OnImageEdit: (imageEdit: ScriptImage) => void;
  OnChange: (imgs: ScriptImage[]) => void;
  OnImageUpload: (img: File) => Promise<ScriptImage>;
};

export default function ImageDisplay({
  images,
  OnImageUpload,
  assetId,
  OnImageEdit,
  OnChange,
}: ImageDisplayProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const removeImage = async (id: number) => {
    let newImages = images;
    for (const scriptImage of newImages) {
      if (scriptImage.id === id) {
        const response = await fetch(
          `${Env.API_BASE_URL}/scripts/images/${id}`,
          { method: "DELETE" },
        );

        if (!response.ok) {
          throw new Error("Failed to delete image");
        }
        newImages = newImages.filter((img) => img.id !== id);
      }
    }

    OnChange(newImages);
  };

  const addImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const upload = await OnImageUpload(file);
      OnChange([...images, upload]);
      OnImageEdit(upload);
    }
  };

  return (
    <>
      <div className="items-center justify-center flex flex-wrap gap-4">
        {images.map((image) => (
          <ImageCard
            image={image}
            removeImage={removeImage}
            onEditClicked={OnImageEdit}
            assetId={assetId}
            key={image.id}
          />
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
    </>
  );
}
