import { useQuery } from "@tanstack/react-query";
import z, { url } from "zod";
import { apiFetch } from "../hooks/ApiClient";

type SearchableDropdownProps<T extends z.ZodType> = {
  url: string;
  input: string;
  schema: T;
  getLabel: (item: z.infer<T>) => string;
  onSelect: (item: z.infer<T>) => void;
};

export default function SearchableDropdown<T extends z.ZodType>({
  url,
  input,
  schema,
  getLabel,
  onSelect,
}: SearchableDropdownProps<T>) {
  const searchableQuery = useQuery({
    queryKey: ["searchableQuery", input],
    queryFn: async (): Promise<z.infer<T>[]> =>
      apiFetch(`${url}?filter=${input}`, {
        schema: z.array(schema),
      }),
    enabled: input.trim().length > 0,
  });

  return (
    <>
      {!searchableQuery.isLoading && searchableQuery.data && (
        <div className=" mt-1 bg-blue-950 border text-center border-white/20 w-full rounded max-h-25 overflow-y-auto">
          {searchableQuery.data.map((item, id) => (
            <button
              key={id}
              className="hover:cursor-pointer hover:bg-blue-800 w-full border-b border-white/20"
              onClick={() => onSelect(item)}
            >
              {getLabel(item)}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
