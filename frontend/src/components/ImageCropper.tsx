import { useEffect, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import type { ScriptImage } from "../types/ScriptTypes";

type ImageCropperProps = {
  imageToEdit: { image: File; scriptImage: ScriptImage | null };
  onCancel: () => void;
  onCrop: (editCrop: { image: File; scriptImage: ScriptImage | null }) => void;
};
export default function ImageCropper({
  imageToEdit,
  onCancel,
  onCrop,
}: ImageCropperProps) {
  const [editImage, setEditImage] = useState(() =>
    URL.createObjectURL(imageToEdit.image),
  );
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(imageToEdit.image);
    setEditImage(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageToEdit]);

  const getCroppedImage = async () => {
    if (!croppedAreaPixels) return;

    const imageElement = new Image();
    imageElement.src = editImage;

    //wait for image to load
    await new Promise<void>((resolve, reject) => {
      imageElement.onload = () => resolve();
      imageElement.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      imageElement,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
    );

    //wait for canvas to convert image to binary
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png", 0.9);
    });

    if (!blob) return;

    const croppedFile = new File([blob], imageToEdit.image.name, {
      type: "image/png",
    });

    onCrop({ image: croppedFile, scriptImage: imageToEdit.scriptImage });
  };

  return (
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
            <button className=" bg-green-500 px-2 py-1 rounded hover:bg-green-600 hover:cursor-pointer">
              Replace
            </button>
            <button
              className="bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 hover:cursor-pointer"
              onClick={getCroppedImage}
            >
              Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
