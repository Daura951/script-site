import { useRef } from "react";
import { ScriptImage } from "../types/ScriptTypes";
import ImageCard from "./ImageCard";

type ImageDisplayProps = {
  images: ScriptImage[];
  assetId: string;
  OnImageEdit: (imageEdit: {
    image: File;
    scriptImage: ScriptImage | null;
  }) => void;
  OnChange: (imgs: ScriptImage[]) => void;
  OnImageUpload: (
    img: File,
    scriptImage: ScriptImage | null,
  ) => Promise<ScriptImage>;
};

export default function ImageDisplay({
  images,
  OnImageUpload,
  assetId,
  OnImageEdit,
  OnChange,
}: ImageDisplayProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const removeImage = (id: number) => {
    const newImages = images.filter((img) => img.id !== id);
    OnChange(newImages);
  };

  const addImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const upload = await OnImageUpload(file, null);
      const newImages = [...images, upload];
      OnChange(newImages);
      OnImageEdit({ image: file, scriptImage: upload });
    }
  };

  return (
    <>
      <div className="items-center justify-center flex flex-wrap gap-4">
        {images.map((image) => (
          <ImageCard
            image={image}
            removeImage={removeImage}
            onEditClicked={(edit: {
              image: File;
              scriptImage: ScriptImage | null;
            }) => OnImageEdit(edit)}
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
