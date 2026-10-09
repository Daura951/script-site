import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Env } from "../Env";
import Loader from "../components/Loader";
import { SmallScriptPreview } from "../components/ScriptPreview";
import { AuthContext, type AuthContextType } from "../context/AuthContext";
import { apiFetch } from "../hooks/ApiClient";
import { Scripts } from "../types/ScriptTypes";

export default function UserPage() {
  const authContext = useContext(AuthContext);
  const { id } = authContext as AuthContextType;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["likedScripts", id],
      initialPageParam: 0,
      queryFn: async ({ pageParam }): Promise<Scripts> =>
        apiFetch(
          `${Env.API_BASE_URL}/users/${id}/liked?size=4&page=${pageParam}`,
          {
            schema: Scripts,
          },
        ),
      getNextPageParam: (lastPage) =>
        lastPage.page.number + 1 < lastPage.page.totalPages
          ? lastPage.page.number + 1
          : undefined,
      enabled: !!id,
    });

  const scripts = data?.pages.flatMap((page) => page.content) ?? [];

  useEffect(() => {
    const media = window.matchMedia("(max-width:767px)");
    const updateScreenSize = () => setIsMobile(media.matches);
    updateScreenSize();
    media.addEventListener("change", updateScreenSize);
    return () => media.removeEventListener("change", updateScreenSize);
  }, []);
  const step = isMobile ? 1 : 4;

  return (
    <div className="pb-10 pt-20 flex flex-col flex-1 text-white items-center  bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
      <div className="bg-blue-950 p-2 border border-white/20 w-xs md:w-5xl rounded">
        <h1 className="text-center font-medium text-lg">UserPage</h1>

        <div className="bg-white/5 border border-white/20 p-4 mt-4 rounded">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-lg">Liked Scripts</h2>
          </div>
          <div className="flex gap-2 items-center justify-between">
            <button
              className="p-2 rounded border border-white/20 hover:bg-white/10 transition hover:cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={currentIndex === 0}
              onClick={() =>
                setCurrentIndex((prev) => Math.max(0, prev - step))
              }
            >
              <ChevronLeftIcon className="size-5" />
            </button>
            <div className="overflow-hidden min-w-0">
              {isLoading ? (
                <Loader />
              ) : (
                <div
                  className="flex gap-2 [--slide-width:128px] md:[--slide-width:208px] transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(calc(var(--slide-width) * -${currentIndex}))`,
                  }}
                >
                  {scripts.map((script) => (
                    <div key={script.id} className="shrink-0">
                      <SmallScriptPreview script={script} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              className="p-2 rounded border border-white/20 hover:bg-white/10 transition hover:cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={async () => {
                const nextIndex = currentIndex + step;

                if (nextIndex >= scripts.length && hasNextPage) {
                  const result = await fetchNextPage();
                  if (result.isFetchNextPageError) return;

                  const totalScripts =
                    result.data?.pages.reduce(
                      (total, page) => total + page.content.length,
                      0,
                    ) ?? scripts.length;
                  if (nextIndex < totalScripts) {
                    setCurrentIndex(nextIndex);
                  }
                  return;
                }
                if (nextIndex < scripts.length) {
                  setCurrentIndex(nextIndex);
                }
              }}
              disabled={
                isFetchingNextPage ||
                (!hasNextPage && currentIndex + 4 >= scripts.length)
              }
            >
              <ChevronRightIcon className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
