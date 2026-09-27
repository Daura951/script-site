import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MultiInput from "../components/MultiInput";
import ScriptPreview from "../components/ScriptPreview";
import SearchDateInput from "../components/SearchDateInput";
import { Env } from "../Env";
import { apiFetch } from "../hooks/ApiClient";
import { User } from "../types/LoginTypes";
import { Scripts, ScriptSearch, SearchDate, Tag } from "../types/ScriptTypes";

export default function ScriptsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [scriptTitle, setScriptTitle] = useState("")
  const [createDate, setCreateDate] = useState<SearchDate>({sort: 'ASC'})
  const [modifyDate, setModifyDate] = useState<SearchDate>({sort: 'ASC'})


  const scriptsQuery = useQuery({
    queryKey: ["scriptQuery"],
    queryFn: async (): Promise<Scripts> =>{

      const search:ScriptSearch = {scriptTitle: scriptTitle, authors: users, tags: tags, createDate: createDate, modifyDate:modifyDate}

      return apiFetch(`${Env.API_BASE_URL}/scripts`, {
        method: "POST",
        body: search,
        schema: Scripts,
      })},
  });



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
            <label htmlFor="title">Script Title</label>
            <input
              id="title"
              type="text"
              className="bg-blue-900/40 outline-none p-2 "
              placeholder="Script Title"
              value={scriptTitle}
              onChange={(e) => setScriptTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="tags">Tags</label>
            <MultiInput
              placeholder="tags"
              url={`${Env.API_BASE_URL}/tags`}
              schema={Tag}
              values={tags}
              onChange={(t) => setTags(t)}
              comparator={(tag) => tag.id}
              getLabel={(tag) => tag.tag}
              getType={(tag) => tag.type}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5 md:gap-21">
          <SearchDateInput OnChange={(d) => setCreateDate(d)} label="Create Date" />
          <SearchDateInput OnChange={(m) => setModifyDate(m)} label="Modify Date" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="usernames">Authors</label>
          <MultiInput
            placeholder="authors"
            url={`${Env.API_BASE_URL}/users`}
            schema={User}
            values={users}
            onChange={(u) => setUsers(u)}
            comparator={(user) => user.id}
            getLabel={(user) => user.username}
            getType={() => ""}
          />
        </div>
        <button className="mt-4 rounded border border-white/20 p-2 hover:cursor-pointer hover:bg-blue-800" onClick={() => scriptsQuery.refetch()}>
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
