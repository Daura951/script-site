import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function UserPage() {
  const authContext = useContext(AuthContext);

  return (
    <div className="pb-10 pt-20 flex flex-col flex-1 text-white items-center  bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
      <div className="bg-blue-950 p-2 border border-white/20 w-xs md:w-5xl rounded">
        <h1 className="text-center font-medium text-lg">UserPage</h1>

        <div className="bg-white/5 border border-white/20 p-2"></div>
      </div>
    </div>
  );
}
