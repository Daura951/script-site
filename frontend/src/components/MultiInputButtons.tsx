type InputButtonProps = {
  valueType: string;
  label: string;
};
type ClosableInputButtonProps<T> = {
  value: T;
  valueType: string;
  label: string;
  removeItem: (item: T) => void;
};

const colorDictionary: { [id: string]: { bg: string; hoverBg: string } } = {
  ["VO_GENRE"]: { bg: "bg-red-600", hoverBg: "bg-red-800" },
  ["ACTING_GENRE"]: { bg: "bg-sky-600", hoverBg: "bg-sky-900" },
  ["SCRIPT_TYPE"]: { bg: "bg-green-600", hoverBg: "bg-green-800" },
  [""]: { bg: "bg-blue-600", hoverBg: "bg-blue-800" },
};

export const InputButton = ({ valueType, label }: InputButtonProps) => {
  return (
    <>
      <div className="hidden hover:bg-red-800 hover:bg-sky-900 hover:bg-green-800 hover:bg-blue-600" />
      <button
        className={`flex ${colorDictionary[valueType].bg} rounded hover:cursor-pointer ${"hover:" + colorDictionary[valueType].hoverBg}`}
      >
        <p className="px-2">{label}</p>
      </button>
    </>
  );
};

export const ClosableInputButton = <T,>({
  value,
  valueType,
  label,
  removeItem,
}: ClosableInputButtonProps<T>) => {
  return (
    <div className={`flex ${colorDictionary[valueType].bg} rounded`}>
      <p className="px-2">{label}</p>
      <button
        onClick={() => removeItem(value)}
        className={`${colorDictionary[valueType].hoverBg} px-1.5 hover:cursor-pointer`}
      >
        &times;
      </button>
    </div>
  );
};
