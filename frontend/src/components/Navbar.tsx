import { useState } from "react";
import { useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <nav className="relative w-full bg-white/8 backdrop-saturate-150 border-b border-white/15 backdrop-blur-xl after:bg-white/10 ">
      <div className="mx-auto sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="left-0 flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((prev) => !prev);
              }}
              className="rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-white/15"
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                data-slot="icon"
                aria-hidden="true"
                className="size-6 in-aria-expanded:hidden"
                aria-expanded={mobileMenuOpen}
              >
                <path
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                data-slot="icon"
                aria-hidden="true"
                className="size-6 not-in-aria-expanded:hidden"
              >
                <path
                  d="M6 18 18 6M6 6l12 12"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                src="/src/assets/Guild_logo_white.png"
                alt="Your Company"
                className="h-10 w-auto hover:scale-110 transition-transform cursor-pointer"
                onClick={() => navigate("/")}
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <button
                aria-current="page"
                className="rounded-md bg-purple-975/50 px-3 py-2 text-sm font-medium text-white hover:cursor-pointer"
              >
                Dashboard
              </button>
              <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white hover:cursor-pointer">
                Team
              </button>
              <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white hover:cursor-pointer">
                Projects
              </button>
              <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white hover:cursor-pointer">
                Calendar
              </button>
            </div>
          </div>
          {true && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="hover:cursor-pointer  relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
              ></button>
              <div className="relative ml-3">
                <button
                  popoverTarget="user-menu"
                  className={`[anchor-name:--user-menu] hover:cursor-pointer ${userOpen ? "" : "hover:scale-110 transition-transform"} relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500`}
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        id="mobile-menu"
        className={`sm:hidden ${mobileMenuOpen ? "block" : "hidden"}`}
      >
        <div className="space-y-1 px-2 pt-2 pb-3">
          <button
            aria-current="page"
            className="block rounded-md bg-gray-950/50 px-3 py-2 text-base font-medium text-white"
          >
            Dashboard
          </button>
          <button className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">
            Team
          </button>
          <button className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">
            Projects
          </button>
          <button className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">
            Calendar
          </button>
        </div>
      </div>
    </nav>
  );
}
