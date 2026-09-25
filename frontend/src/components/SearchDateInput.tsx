import { useState } from "react";

type SearchDateInputProps = {
  label: string;
};

export default function SearchDateInput({ label }: SearchDateInputProps) {
  const [ascEnabled, setAscEnabled] = useState(true);

  const handleClick = (isAsc: boolean) => {
    setAscEnabled(isAsc);
  };

  return (
    <div className="flex flex-col ">
      <label htmlFor="createDate">{label}</label>
      <div className="flex">
        <input
          type="date"
          id="createDate"
          className="bg-blue-900/40 px-0.5 py-1 text-white/50 [&::-webkit-calendar-picker-indicator]:invert "
        />
        <div>
          <button
            className={`px-0.5 py-1.5 ${ascEnabled ? "bg-red-600" : "bg-slate-800"} text-sm hover:cursor-pointer`}
            onClick={() => handleClick(true)}
          >
            ASC
          </button>
          <button
            className={`px-0.5 py-1.5 ${!ascEnabled ? "bg-blue-600" : "bg-slate-800"} text-sm hover:cursor-pointer`}
            onClick={() => handleClick(false)}
          >
            DSC
          </button>
        </div>
      </div>
    </div>
  );
}
