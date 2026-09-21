export default function ScriptsPage() {
  return (
    <div className="pb-10 pt-20 flex flex-col flex-1 text-white items-center  bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
      <div className="flex flex-col gap-4">
        <header>
          <h1 className="text-xl md:text-6xl font-bold">Scripts</h1>
        </header>
        <p className="max-w-100 md:max-w-250 text-center">View Scripts</p>
      </div>

      <div className="mt-10 border p-4 rounded-lg flex flex-col gap-4 border-white/20 bg-blue-950 w-fit">
        <h2 className="text-center text-lg md:text-4xl">Search</h2>

        <div className=" flex justify-between gap-10">
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
            <input
              id="tags"
              type="text"
              className="bg-blue-900/40 outline-none p-2"
              placeholder="tags"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
