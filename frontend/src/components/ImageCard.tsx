import { useState } from "react";
import { Env } from "../Env";
import type { ScriptImage } from "../types/ScriptTypes";

type ImageCardProps = {
  image: ScriptImage;
  removeImage: (id: number) => void;
  onEditClicked: (imageEdit: ScriptImage) => void;
  assetId: string;
};

export default function ImageCard({
  image,
  removeImage,
  onEditClicked,
  assetId,
}: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleEditClick = async () => {
    onEditClicked(image);
  };

  return (
    <div
      className="w-50 overflow-hidden rounded border border-white/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

      <div className="relative h-40">
        <img
          src={`${Env.BASE_URL}/images/${assetId}/${image.name}?v=${Date.now()}`}
          alt={`Character Image ${image.id}`}
          className="w-full h-full object-cover"
        />
        {isHovered && (
          <button
            className="absolute bottom-0 left-0 w-full py-2 bg-blue-600 hover:cursor-pointer hover:bg-blue-700"
            onClick={() => handleEditClick()}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
