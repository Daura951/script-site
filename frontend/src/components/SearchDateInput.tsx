import { useState } from "react";
import { SearchDate } from "../types/ScriptTypes";

type SearchDateInputProps = {
  label: string;
  OnChange: (item:SearchDate)=>void;
};

export default function SearchDateInput({ label, OnChange }: SearchDateInputProps) {
  const [search, setSearch] = useState<SearchDate>({sort: 'ASC'});

  const handleClick = (isAsc: boolean) => {
    setSearch({...search, sort: isAsc ? 'ASC' : 'DSC'})
    OnChange(search)
    
  };

  return (
    <div className="flex flex-col ">
      <label htmlFor="createDate">{label}</label>
      <div className="flex">
        <input
          type="date"
          id="createDate"
          className="bg-blue-900/40 px-0.5 py-1 text-white/50 [&::-webkit-calendar-picker-indicator]:invert"
          onChange={(e)=> {
            const selectedDate = e.target.valueAsDate; 
            if(selectedDate) 
            {
              console.log(selectedDate)
              setSearch({...search, date: selectedDate})
              OnChange(search)
            }
          }}
        />
        <div>
          <button
            className={`px-0.5 py-1.5 ${search?.sort === 'ASC' ? "bg-blue-700" : "bg-slate-800"} text-sm hover:cursor-pointer`}
            onClick={() => handleClick(true)}
          >
            ASC
          </button>
          <button
            className={`px-0.5 py-1.5 ${search?.sort === 'DSC' ? "bg-blue-700" : "bg-slate-800"} text-sm hover:cursor-pointer`}
            onClick={() => handleClick(false)}
          >
            DSC
          </button>
        </div>
      </div>
    </div>
  );
}
