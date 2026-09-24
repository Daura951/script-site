import { useQuery } from "@tanstack/react-query";
import TagInput from "../components/TagInput";
import { Env } from "../Env";
import { apiFetch } from "../hooks/ApiClient";
import { Scripts, Tag } from "../types/ScriptTypes";
import ScriptPreview from "../components/ScriptPreview";

export default function ScriptsPage() {
  const scriptsQuery = useQuery({
    queryKey: ["scriptQuery"],
    queryFn: async (): Promise<Scripts> =>
      apiFetch(`${Env.API_BASE_URL}/scripts`, {
        schema: Scripts,
      }),
  });

  const tags: Tag[] = [];

  return (
    <div className="pb-10 pt-20 flex flex-col flex-1 text-white items-center  bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
      <div className="flex flex-col gap-4">
        <header>
          <h1 className="text-xl md:text-6xl font-bold">Scripts</h1>
        </header>
        <p className="max-w-100 md:max-w-250 text-center">View Scripts</p>
      </div>

      <div className="mt-10 border p-4 rounded-lg flex flex-col gap-4 border-white/20 bg-blue-950 md:w-fit w-xs">
        <h2 className="text-center text-lg md:text-4xl">Search</h2>

        <div className="flex flex-col md:flex-row justify-between gap-5 md:gap-10">
          <div className="flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="bg-blue-900/40 outline-none p-2"
              placeholder="Script Name"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="tags">Tags</label>
            <TagInput values={tags} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5 md:gap-21">
          <div className="flex flex-col">
            <label htmlFor="createDate">Create Date</label>
            <input
              type="date"
              id="createDate"
              className="bg-blue-900/40 p-2 text-white/50 [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="modifyDate">Modify Date</label>
            <input
              type="date"
              id="modifyDate"
              className="bg-blue-900/40 p-2 text-white/50 [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>
        <button className="mt-4 rounded border border-white/20 p-2 hover:cursor-pointer hover:bg-blue-800">
          Search
        </button>
      </div>

      {!scriptsQuery.isLoading && (
        <>
          <div className="mt-10 border p-4 rounded-lg flex flex-col gap-4 border-white/20 bg-blue-950 w-fit truncate">
            {scriptsQuery.data?.content?.map((script, i) => (
              <ScriptPreview script={script} key={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
