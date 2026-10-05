type YesNoModalProps = {
  open: boolean;
  header: string;
  message: string;
  OnNoClick: () => void;
  OnYesClick: () => void;
};

export default function YesNoModal({
  open,
  header,
  message,
  OnNoClick,
  OnYesClick,
}: YesNoModalProps) {
  return (
    <div className={`${!open ? "hidden" : ""}`}>
      <div className="fixed inset-0 place-items-center grid text-blue-500 bg-black/70">
        <div className="border border-white/20 rounded  flex-col  gap-5 flex bg-blue-950">
          <div className="border-b border-white/20 p-2 text-white text-xl font-medium bg-blue-900">
            {header}
          </div>
          <div className="p-2">
            <p>{message}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="bg-blue-700/25 hover:cursor-pointer hover:bg-blue-800 text-white px-2 rounded font-medium"
                onClick={OnYesClick}
              >
                Yes
              </button>
              <button
                className="bg-red-700/25 hover:cursor-pointer hover:bg-red-800 text-white px-2 rounded font-medium"
                onClick={OnNoClick}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
