import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import type { ZodSafeParseResult } from "zod";
import WritingIcon from "../components/WritingIcon";
import { apiFetch } from "../hooks/ApiClient";
import { fileUpload, FileUploadRequest, Script } from "../types/ScriptTypes";
import { Env } from "../Env";
import { useNavigate } from "react-router";

export default function ScriptSubmissionPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileResult, setFileResult] = useState<ZodSafeParseResult<File> | null>(
    null,
  );
  const nav = useNavigate();

  const scriptMutation = useMutation({
    mutationFn: async (data: FileUploadRequest) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("script", data.script);

      const response = await fetch(`${Env.API_BASE_URL}/scripts/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Something went wrong, please try again");
      }

      const scriptId = await response.text();
      nav(`/scripts/edit/${scriptId}`);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const result = fileUpload.safeParse(file);

    if (!result.success) {
      setFileResult(result);
      return;
    }
    if (file) {
      const request: FileUploadRequest = {
        title: file.name,
        script: file,
      };
      await scriptMutation.mutateAsync(request);
    }
  };

  return (
    <div className="pb-10 pt-20  flex justify-center flex-col flex-1 text-white items-center  bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
      <div className="bg-blue-950 p-2 text-center border rounded border-white/20 w-xl ">
        <h1 className="text-2xl font-medium">Submit a Script</h1>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => handleFileUpload(e)}
        />

        <div className="flex justify-between gap-4 mt-4">
          <button
            className="p-4 flex flex-col items-center justify-center gap-2 rounded bg-blue-900  hover:bg-blue-800 hover:cursor-pointer w-full h-75"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg
              className="w-10 h-10"
              viewBox="0 -0.5 17 17"
              version="1.1"
              fill="#ffffff"
              stroke="#ffffff"
            >
              <path d="M14,8.047 L14,12.047 L2,12.047 L2,8.047 L0,8.047 L0,15 L15.969,15 L15.969,8.047 L14,8.047 Z" />
              <path d="M7.997,0 L5,3.963 L7.016,3.984 L7.016,8.969 L8.953,8.969 L8.953,3.984 L10.953,3.984 L7.997,0 Z" />
            </svg>
            <p>Upload</p>
          </button>

          <button className="p-4 flex flex-col justify-center items-center  gap-2 rounded bg-blue-900  hover:bg-blue-800 hover:cursor-pointer w-full">
            <WritingIcon className="w-10 h-10" />
            <p>Write</p>
          </button>
        </div>
        {fileResult && (
          <ul className="p-2 ml-4 text-left list-disc">
            {fileResult.error?.issues.map((issue, i) => (
              <li key={i} className="text-red-500">
                {issue.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
