import React, { useEffect, useState } from "react";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkBreaks from "remark-breaks";
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

            const cropped = await cropImage(
              {
                x: scriptImage.cropX,
                y: scriptImage.cropY,
                width: scriptImage.cropWidth,
                height: scriptImage.cropHeight,
              },
              URL.createObjectURL(file),
            );
            console.log(cropped);
            if (!cropped) {
              console.warn(`Could not crop image ${imageNumber}`);
              break;
            }

            const imageUrl = URL.createObjectURL(cropped);

            result = result.replace(
              match[0],
              `![img ${imageNumber} Image](${imageUrl})`,
            );

            break;
          }
        }
      }
      setParsed(result);
    };
    parseMarkdown();
  }, [markdown, images, assetId]);

  return (
    <div className="text-center">
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        urlTransform={(url) =>
          url.startsWith("blob:") ? url : defaultUrlTransform(url)
        }
        components={{
          p: ({ node, children, ...props }) => {
            const hasImage = React.Children.toArray(children).some(
              (child) => React.isValidElement(child) && child.type === "img",
            );

            if (hasImage) {
              return (
                <p
                  className="m-0 inline-block align-top mr-2 mb-4 text-center"
                  {...props}
                >
                  {children}
                </p>
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
    </div>
  );
}
