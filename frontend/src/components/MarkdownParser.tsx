import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { Env } from "../Env";
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
  let parsed = markdown.replace(/\{img_([1-9]+)\}/g, (match, imageNumber) => {
    const exists = images.some((img) => img.scriptOrder == imageNumber);

    return exists
      ? `![img ${imageNumber} Image](${Env.BASE_URL}/images/${assetId}/script_img_${imageNumber}.png)`
      : match;
  });
  parsed = parsed.replace(/(\r?\n\s*){2,}/g, (match) => {
    const newLineCnt = match.match(/\n/g)?.length || 0;
    return "\n&nbsp;\n".repeat(newLineCnt - 1);
  });

  return (
    <ReactMarkdown
      remarkPlugins={[remarkBreaks]}
      components={{
        p: ({ node, children, ...props }) => {
          const textContent = Array.isArray(children)
            ? children.join("")
            : children;

          const isEmpty = !textContent || String(textContent).trim() === "";

          if (isEmpty) {
            return <br />;
          }
          return (
            <p className="m-0 leading-snug" {...props}>
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
