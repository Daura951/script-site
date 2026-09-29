import { useState } from "react";
import { SearchDate } from "../types/ScriptTypes";

type SearchDateInputProps = {
  label: string;
  OnChange: (item: SearchDate) => void;
};

export default function SearchDateInput({
  label,
  OnChange,
}: SearchDateInputProps) {
  const [search, setSearch] = useState<SearchDate>({ sort: "ASC" });

  const handleClick = (sort: string) => {
    const newSearch = {
      ...search,
      sort,
    };
    if (search.date) {
      setSearch(newSearch);
      OnChange(newSearch);
    }
  };

  return (
    <div className="flex flex-col ">
      <label htmlFor="createDate">{label}</label>
      <div className="flex">
        <input
          type="date"
          id="createDate"
          className="bg-blue-900/40 px-0.5 py-1 text-white/50 [&::-webkit-calendar-picker-indicator]:invert w-50 "
          onChange={(e) => {
            const selectedDate = e.target.valueAsDate;
            if (selectedDate) {
              const newSearch = {
                ...search,
                date: selectedDate,
              };
              setSearch(newSearch);
              OnChange(newSearch);
            }
          }}
        />
        <div>
          <button
            disabled={!search.date}
            className={`px-1.5 py-1.5 ${search?.sort === "ASC" ? "bg-blue-700" : "bg-slate-800"} text-sm hover:cursor-pointer disabled:cursor-default disabled:opacity-50 disabled:bg-slate-800`}
            onClick={() => handleClick("ASC")}
          >
            ASC
          </button>
          <button
            disabled={!search.date}
            className={`px-1.5 py-1.5 ${search?.sort === "DESC" ? "bg-blue-700" : "bg-slate-800"} text-sm hover:cursor-pointer disabled:cursor-default disabled:opacity-50 disabled:bg-slate-800`}
            onClick={() => handleClick("DESC")}
          >
            DESC
          </button>
        </div>
      </div>
    </div>
  );
}
