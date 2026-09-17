import { useNavigate } from "react-router";
import InfoCard from "../components/InfoCard";
import MircophoneIcon from "../components/MircophoneIcon";
import SearchIcon from "../components/SearchIcon";
import WritingIcon from "../components/WritingIcon";

export default function MainPage() {
  const nav = useNavigate();

  return (
    <>
      <div className="pb-10 pt-4 flex flex-col text-white items-center justify-center bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
        <div className="flex flex-col items-center gap-4 mt-16">
          <div>
            <h1 className="text-xl md:text-6xl font-bold">Guild of Voices</h1>
          </div>
          <p className="max-w-70 md:max-w-100 text-center">
            (Some intro text) Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Quas dignissimos, asperiores explicabo eligendi repudiandae
            magni quidem debitis odio aliquam necessitatibus aperiam ratione
            voluptates qui assumenda pariatur enim quaerat? Cum, magni.
          </p>

          <div className=" flex flex-col md:flex-row gap-4 items-center">
            <button
              className=" p-2 rounded-lg w-25 md:w-50 bg-blue-900 hover:bg-blue-800 hover:cursor-pointer"
              onClick={() => nav("/signup")}
            >
              Sign Up
            </button>
            <button
              className=" p-2 rounded-lg w-25 md:w-50 bg-blue-900 hover:bg-blue-800 hover:cursor-pointer"
              onClick={() => nav("/login")}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
      <div className="m-5 flex flex-col md:flex-row gap-10 items-center justify-center">
        <InfoCard
          title="Perform"
          body="Perform scripts from GOV's vast library of human made scripts."
          iconColor="bg-purple-500"
          icon={<MircophoneIcon className="w-6 h-6" />}
        />

        <InfoCard
          title="Write"
          body="Have a script of your own? Now you can submit your script to be a
            part of GOV's library."
          iconColor="bg-red-500"
          icon={<WritingIcon className="w-6 h-6" />}
        />

        <InfoCard
          title="Search"
          body="Easily navigate and search GOV's repository of scripts based on a
            variety of genres, tags, and more!"
          iconColor="bg-blue-500"
          icon={<SearchIcon className="w-6 h-6" />}
        />
      </div>
    </>
  );
}
