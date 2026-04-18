import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Image as ImageIcon, Plus, Check, Sun, Moon } from "lucide-react";
import profileImg from "@/assets/profile-sophie.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sophie Bennett — Product Designer" },
      { name: "description", content: "Product Designer who focuses on simplicity & usability." },
    ],
  }),
});

function VerifiedBadge() {
  return (
    <span className="relative inline-flex h-5 w-5 items-center justify-center">
      <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full text-[oklch(0.72_0.19_145)]" fill="currentColor">
        <path d="M12 1.5l2.39 1.74 2.95-.32 1.43 2.6 2.6 1.43-.32 2.95L22.5 12l-1.74 2.39.32 2.95-2.6 1.43-1.43 2.6-2.95-.32L12 22.5l-2.39-1.74-2.95.32-1.43-2.6-2.6-1.43.32-2.95L1.5 12l1.74-2.39-.32-2.95 2.6-1.43L6.95 2.92l2.95.32L12 1.5z" />
      </svg>
      <Check className="relative h-3 w-3 text-white" strokeWidth={3.5} />
    </span>
  );
}

function Index() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <button
        type="button"
        onClick={() => setDark((d) => !d)}
        aria-label="Toggle theme"
        className="fixed left-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm ring-1 ring-border transition-colors hover:bg-secondary"
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <article className="w-full max-w-[320px] rounded-[28px] bg-card p-3 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.18)]">
        <div className="overflow-hidden rounded-[20px]">
          <img
            src={profileImg}
            alt="Sophie Bennett"
            width={768}
            height={896}
            className="h-[300px] w-full object-cover"
          />
        </div>

        <div className="px-2 pb-2 pt-5">
          <div className="flex items-center gap-1.5">
            <h1 className="text-[18px] font-semibold tracking-tight text-foreground">
              Sophie Bennett
            </h1>
            <VerifiedBadge />
          </div>

          <p className="mt-2 text-[14px] leading-snug text-muted-foreground">
            Product Designer who focuses
            <br />
            on simplicity &amp; usability.
          </p>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-4 text-[13px] text-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-[15px] w-[15px]" strokeWidth={1.8} />
                <span>312</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ImageIcon className="h-[15px] w-[15px]" strokeWidth={1.8} />
                <span>48</span>
              </span>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary/70"
            >
              Follow
              <Plus className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </article>
    </main>
  );
}
