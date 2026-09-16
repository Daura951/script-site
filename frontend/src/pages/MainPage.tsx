import MircophoneIcon from "../components/MircophoneIcon";
import SearchIcon from "../components/SearchIcon";
import WritingIcon from "../components/WritingIcon";

export default function MainPage() {
  return (
    <>
      <div className=" pb-10 pt-4 flex flex-col text-white items-center justify-center bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
        <div className="flex flex-col items-center gap-4 mt-16">
          <div>
            <h1 className="text-6xl font-bold">Guild of Voices</h1>
          </div>
          <p className="max-w-250 text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
            dignissimos, asperiores explicabo eligendi repudiandae magni quidem
            debitis odio aliquam necessitatibus aperiam ratione voluptates qui
            assumenda pariatur enim quaerat? Cum, magni.
          </p>

          <div className=" flex gap-4 items-center">
            <button className=" p-2 rounded-lg w-50 bg-blue-900">
              Sign Up
            </button>
            <button className=" p-2 rounded-lg w-50 bg-blue-900">Log in</button>
          </div>
        </div>
      </div>
      <div className="m-5 flex gap-10 items-center justify-center">
        <div className="w-50 p-2 h-60">
          <div className="w-10 h-10 bg-purple-500 rounded-3xl flex items-center justify-center">
            <MircophoneIcon className="w-6 h-6" />
          </div>
          <h1 className="font-bold">Perform</h1>
          <p className="text-wrap mt-2">
            Perform scripts from GOV's vast library of human made scripts.
          </p>
        </div>
        <div className="w-50 p-2 h-60">
          <div className="w-10 h-10 bg-red-500 rounded-3xl flex items-center justify-center">
            <WritingIcon className="w-6 h-6" />
          </div>
          <h1 className="font-bold">Perform</h1>
          <p className="text-wrap mt-2">
            Perform scripts from GOV's vast library of human made scripts.
          </p>
        </div>
        <div className="w-50 p-2 h-60">
          <div className="w-10 h-10 bg-blue-500 rounded-3xl flex items-center justify-center">
            <SearchIcon className="w-6 h-6" />
          </div>
          <h1 className="font-bold">Perform</h1>
          <p className="text-wrap mt-2">
            Perform scripts from GOV's vast library of human made scripts.
          </p>
        </div>
      </div>
    </>
  );
}
