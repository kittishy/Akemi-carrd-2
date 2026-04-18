import { createFileRoute } from "@tanstack/react-router";
import { User, Image as ImageIcon, Plus, BadgeCheck } from "lucide-react";
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

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <article className="w-full max-w-[340px] rounded-[28px] bg-card p-3 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)]">
        <div className="overflow-hidden rounded-[20px]">
          <img
            src={profileImg}
            alt="Sophie Bennett"
            width={768}
            height={896}
            className="h-[340px] w-full object-cover"
          />
        </div>

        <div className="px-3 pb-3 pt-5">
          <div className="flex items-center gap-1.5">
            <h1 className="text-[19px] font-semibold tracking-tight text-foreground">
              Sophie Bennett
            </h1>
            <BadgeCheck className="h-5 w-5 fill-[oklch(0.72_0.18_145)] text-white" strokeWidth={2.5} />
          </div>

          <p className="mt-2 text-[14px] leading-snug text-muted-foreground">
            Product Designer who focuses on simplicity &amp; usability.
          </p>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-4 text-[13px] text-foreground/80">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" strokeWidth={1.8} />
                <span className="font-medium">312</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4" strokeWidth={1.8} />
                <span className="font-medium">48</span>
              </span>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-4 py-2 text-[13px] font-medium text-foreground shadow-sm transition-colors hover:bg-secondary/70"
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
