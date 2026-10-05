import type { Area } from "react-easy-crop";
import { Env } from "../Env";

export const loadImage = async (assetUrl: string, imageName: string) => {
  const response = await fetch(
    `${Env.BASE_URL}/images/${assetUrl}/${imageName}?v=${Date.now()}`,
  );

  if (!response.ok) {
    throw new Error("Unable to load image");
  }

  const blob = await response.blob();
  const file = new File([blob], imageName, {
    type: "image/png",
  });
  return file;
};

export const cropImage = async (
  croppedAreaPixels: Area | null,
  image: string,
) => {
  if (!croppedAreaPixels) return;
  if (!image) return;

  const imageElement = new Image();
  imageElement.src = image;

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

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png", 0.9);
  });

  return blob;
};
