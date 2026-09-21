export default function TeamPage() {
  return (
    <>
      <div className="pb-10 pt-4 flex flex-col text-white items-center justify-center bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
        <div className="flex flex-col items-center gap-2 mt-16">
          <header>
            <h1 className="text-xl md:text-6xl font-bold">Team</h1>
          </header>
          <p className="max-w-100 md:max-w-250 text-center">Meet our team!</p>
        </div>
      </div>
      <div className="mt-4">
        <h2>Team content like pictures, bios, etc</h2>
      </div>
    </>
  );
}
