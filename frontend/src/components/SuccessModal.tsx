type SuccessModalProps = {
  isSuccess: boolean;
  message: string;
  okFn: () => void;
};

export default function SuccessModal({
  isSuccess,
  message,
  okFn,
}: SuccessModalProps) {
  return (
    <div className="fixed inset-0 place-items-center grid bg-white/10">
      <div className="bg-white w-75 md:w-100 border border-blue-400/20 rounded-md">
        <div className="p-4">
          <div className="flex items-start gap-2">
            <div className="bg-white outline outline-blue-400 rounded-full size-9 flex items-center justify-center">
              {isSuccess ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  data-slot="icon"
                  aria-hidden="true"
                  className="size-6 text-blue-400"
                >
                  <path
                    d="M4.5 12.75l6 6 9-13.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  data-slot="icon"
                  aria-hidden="true"
                  className="size-6 text-blue-400"
                >
                  <path
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              )}
            </div>
            <div className="mt-1 font-medium">
              {isSuccess ? "Success" : "Failure"}
            </div>
          </div>
          <div className="mt-2 ">{message}</div>
        </div>
        <div className="bg-blue-400 rounded-b flex items-center justify-center px-6 py-3">
          <button
            className="px-3 py-2 bg-white/10 rounded hover:cursor-pointer hover:bg-white/20"
            onClick={okFn}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
