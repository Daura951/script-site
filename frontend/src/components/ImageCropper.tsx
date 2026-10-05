import { useEffect, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { loadImage } from "../hooks/ImageHooks";
import type { ScriptImage } from "../types/ScriptTypes";

type ImageCropperProps = {
  imageToEdit: ScriptImage;
  onCancel: () => void;
  onCrop: (edit: ScriptImage) => void;
  assetId: string;
};

export type croppedProps = {
  crop: Point;
  zoom: number;
  croppedAreaPixels: Area | null;
};
export default function ImageCropper({
  imageToEdit,
  onCancel,
  onCrop,
  assetId,
}: ImageCropperProps) {
  const [editImage, setEditImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({
    x: imageToEdit.cropPositionX,
    y: imageToEdit.cropPositionY,
  });
  const [zoom, setZoom] = useState(imageToEdit.zoom);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    let imageUrl: string | null = null;
    const getImage = async () => {
      imageUrl = URL.createObjectURL(
        await loadImage(assetId, imageToEdit.name),
      );

      setEditImage(imageUrl);
    };
    getImage();
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageToEdit]);

  return (
    <>
      {editImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 ">
          <div className="bg-white p-4 h-125 w-175 relative rounded-lg overflow-hidden">
            <div>
              <button
                className="bg-red-500 absolute top-0 right-0  px-4  z-50 hover:bg-red-600 hover:cursor-pointer"
                onClick={() => {
                  onCancel();
                }}
              >
                X
              </button>
            </div>
            <div className="relative mt-3 border-2 rounded border-black h-[calc(100%-55px)] w-full">
              <Cropper
                image={editImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) => {
                  setCroppedAreaPixels(croppedAreaPixels);
                }}
                objectFit="cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1"
              />
              <div className="justify-end flex gap-2">
                <button
                  className="bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 hover:cursor-pointer"
                  onClick={() => {
                    if (!croppedAreaPixels) return;
                    onCrop({
                      ...imageToEdit,
                      cropX: croppedAreaPixels.x,
                      cropY: croppedAreaPixels.y,
                      cropPositionX: crop.x,
                      cropPositionY: crop.y,
                      cropWidth: croppedAreaPixels.width,
                      cropHeight: croppedAreaPixels.height,
                      zoom,
                    });
                  }}
                >
                  Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
