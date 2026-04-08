"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Bookmarks to `/works` — main portfolio is one page at `/` with `#works` */
export default function WorksIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#works");
  }, [router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-transparent text-sm text-[#94a3b8]">
      Opening portfolio…
    </div>
  );
}
