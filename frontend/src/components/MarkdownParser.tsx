import React, { useEffect, useState } from "react";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import rehypeRaw from "rehype-raw";
import { cropImage, loadImage } from "../hooks/ImageHooks";
import type { ScriptImage } from "../types/ScriptTypes";

type MarkdownParserProps = {
  markdown: string;
  images: ScriptImage[];
  assetId: string;
};

export default function MarkdownParser({
  markdown,
  images,
  assetId,
}: MarkdownParserProps) {
  const [parsed, setParsed] = useState("");

  useEffect(() => {
    const parseMarkdown = async () => {
      let result = markdown;

      const matches = [...markdown.matchAll(/\{img_([1-9]+)\}/g)];

      for (const match of matches) {
        const imageNumber = match[1];
        for (const scriptImage of images) {
          if (String(scriptImage.scriptOrder) === imageNumber) {
            const file = await loadImage(assetId, scriptImage.name);
            const fileUrl = URL.createObjectURL(file);

            const img = new Image();
            img.src = fileUrl;

            await new Promise((resolve) => {
              img.onload = resolve;
            });
            const isNew =
              scriptImage.cropX === 0 &&
              scriptImage.cropY === 0 &&
              scriptImage.cropWidth === 292 &&
              scriptImage.cropHeight === 292;

            const size = Math.min(img.naturalWidth, img.naturalHeight);
            const x = isNew ? (img.naturalWidth - size) / 2 : scriptImage.cropX;
            const y = isNew
              ? (img.naturalHeight - size) / 2
              : scriptImage.cropY;
            const width = isNew ? size : scriptImage.cropWidth;
            const height = isNew ? size : scriptImage.cropHeight;

            const cropped = await cropImage(
              {
                x,
                y,
                width,
                height,
              },
              fileUrl,
            );
            if (!cropped) {
              console.warn(`Could not crop image ${imageNumber}`);
              break;
            }

            result = result.replace(
              match[0],
              `![img ${imageNumber} Image](${URL.createObjectURL(cropped)})`,
            );

            break;
          }
        }
      }
      const lineBreaks = result.replace(/\r?\n/g, "<br/>\n");
      setParsed(lineBreaks);
    };
    parseMarkdown();
  }, [markdown, images, assetId]);

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      urlTransform={(url) =>
        url.startsWith("blob:") ? url : defaultUrlTransform(url)
      }
      components={{
        p: ({ node, children, ...props }) => {
          const hasImage = React.Children.toArray(children).some(
            (child) => React.isValidElement(child) && child.type === "img",
          );

          if (hasImage) {
            const textChildren: React.ReactNode[] = [];
            const imageChildren: React.ReactNode[] = [];

            React.Children.forEach(children, (child) => {
              if (React.isValidElement(child) && child.type === "img") {
                imageChildren.push(child);
              } else {
                textChildren.push(child);
              }
            });

            return (
              <div className="my-2" {...props}>
                {imageChildren.length > 0 && (
                  <div className="flex flex-row flex-wrap gap-2 mb-2 justify-center">
                    {imageChildren.map((img, i) => (
                      <div key={i} className="md:w-fit w-30">
                        {img}
                      </div>
                    ))}
                  </div>
                )}
                {textChildren.length > 0 && (
                  <div className=" leading-snug">{textChildren}</div>
                )}
              </div>
            );
          }

          const textContent = Array.isArray(children)
            ? children.join("")
            : children;

          const isEmpty = !textContent || String(textContent).trim() === "";

          if (isEmpty) {
            return <br />;
          }
          return (
            <p className="m-0 leading-snug text-left" {...props}>
              {children}
            </p>
          );
        },
      }}
    >
      {parsed}
    </ReactMarkdown>
  );
}
