import Navbar from "@/components/Navbar";

type Chip = { dot?: boolean; label: string };
type MetaItem = { label: string; value: React.ReactNode };

type PageHeroProps = {
  title: string;
  tagline?: string;
  description?: string;
  watermark?: string;
  chips?: Chip[];
  actions?: React.ReactNode;
  meta?: MetaItem[];
  metaEnd?: React.ReactNode;
  titleSize?: string;
  /** Compact title shown on small screens (kept to two words max). */
  mobileTitle?: string;
  extra?: React.ReactNode;
  /** Optional full-bleed photo background (shown clean, with no scrim). */
  bgImage?: string;
  /** Optional pill pinned to the far right of the chips row (like the homepage carousel). */
  chipsEnd?: React.ReactNode;
  /** Set false on pages whose layout already renders a Navbar (avoids a double navbar). */
  navbar?: boolean;
};

export default function PageHero({
  title,
  tagline,
  description,
  watermark,
  actions,
  meta,
  metaEnd,
  titleSize = "4.8rem",
  mobileTitle,
  extra,
  bgImage,
  navbar = true,
}: PageHeroProps) {
  const showMetaBar = (meta?.length ?? 0) > 0 || metaEnd;

  return (
    <section
      className={"relative min-h-screen w-full overflow-hidden"}
      style={
        bgImage
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {
              background:
                "linear-gradient(115deg, var(--club-accent) 0%, var(--club-accent-dark) 38%, #1d2a4d 80%, #151f3a 100%)",
            }
      }
    >
      {navbar && <Navbar overlay />}

      {!bgImage && (
        <>
          <div
            className={
              "absolute -top-32 -right-24 size-96 rounded-full blur-3xl opacity-30"
            }
            style={{ backgroundColor: "var(--club-accent)" }}
          />
          <div
            className={
              "absolute bottom-10 -left-24 size-96 rounded-full blur-3xl opacity-20"
            }
            style={{ backgroundColor: "var(--club-accent)" }}
          />
          <div
            className={
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[560px] rounded-full opacity-10 blur-3xl"
            }
            style={{ backgroundColor: "var(--club-accent)" }}
          />
          <div
            className={
              "absolute -right-20 -top-28 size-[30rem] rounded-full border"
            }
            style={{
              borderColor:
                "color-mix(in srgb, var(--club-accent) 40%, transparent)",
            }}
          />
          <div
            className={
              "absolute -right-12 -top-20 size-[21rem] rounded-full border"
            }
            style={{
              borderColor:
                "color-mix(in srgb, var(--club-accent) 22%, transparent)",
            }}
          />
          <div
            className={"absolute -top-10 right-4 h-px w-96"}
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--club-accent))",
            }}
          />
        </>
      )}
      {bgImage && (
        <>
          <div
            aria-hidden={"true"}
            className={
              "absolute -top-24 -left-20 size-72 md:size-96 rounded-full bg-navy/50 opacity-70 blur-3xl"
            }
          />
          <div
            aria-hidden={"true"}
            className={
              "absolute left-1/2 top-1/2 -translate-x-[55%] -translate-y-1/2 size-96 md:size-[32rem] rounded-full bg-navy/40 blur-3xl"
            }
          />
        </>
      )}
      {watermark && (
        <div
          className={
            "absolute bottom-0 right-4 hidden pb-0.5 select-none md:block"
          }
        >
          <span
            className={
              "block font-black leading-none tracking-tighter text-[color:var(--club-accent)]"
            }
            style={{
              fontSize: "clamp(9rem, 24vw, 16rem)",
              opacity: 0.14,
              textShadow: "0 0 28px rgba(21,31,58,0.7)",
            }}
          >
            {watermark}
          </span>
        </div>
      )}

      <div
        className={
          "relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 min-h-screen flex flex-col justify-center py-16"
        }
      >
        <div className={"flex flex-col gap-3 text-center md:text-left"}>
          {/* Reserved whitespace where tag pills used to sit — titles stay aligned without the tags. */}
          <div aria-hidden={"true"}>
            <span className={"block h-[30px]"} />
          </div>

          <h1
            className={"font-black tracking-tight leading-none text-white"}
            style={{
              fontSize: titleSize,
              textShadow:
                "0 2px 16px rgba(21,31,58,0.55), 0 1px 3px rgba(21,31,58,0.45)",
            }}
          >
            <span className={"hidden sm:inline"}>{title}</span>
            <span className={"sm:hidden"}>{mobileTitle ?? title}</span>
          </h1>
          {tagline && (
            <p
              className={"text-lg md:text-2xl font-medium"}
              style={{
                color: "var(--club-accent)",
                filter: "brightness(1.15)",
                textShadow:
                  "0 1px 4px rgba(21,31,58,0.7), 0 2px 14px rgba(21,31,58,0.55)",
              }}
            >
              {tagline}
            </p>
          )}
          {description && (
            <p
              className={
                "max-w-[90%] mx-auto sm:max-w-[50vw] sm:mx-0 text-sm md:text-base text-white leading-relaxed"
              }
              style={{
                textShadow:
                  "0 1px 3px rgba(21,31,58,0.8), 0 2px 14px rgba(21,31,58,0.6)",
              }}
            >
              {description}
            </p>
          )}

          {actions && (
            <div
              className={
                "flex flex-col items-center gap-5 mt-3 md:flex-row md:items-center md:justify-start"
              }
            >
              {actions}
            </div>
          )}

          {showMetaBar && (
            <div
              className={
                "mt-9 pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-sm md:justify-start md:gap-x-10"
              }
              style={{ textShadow: "0 1px 6px rgba(21,31,58,0.6)" }}
            >
              {meta?.map((m) => (
                <div key={m.label}>
                  <span
                    className={
                      "block text-[11px] uppercase tracking-widest text-white/70 mb-0.5"
                    }
                  >
                    {m.label}
                  </span>
                  <span className={"font-semibold text-white"}>{m.value}</span>
                </div>
              ))}
              {metaEnd && (
                <div
                  className={
                    "w-full justify-center md:w-auto md:ml-auto md:justify-start flex flex-wrap items-center gap-x-6 gap-y-2"
                  }
                >
                  {metaEnd}
                </div>
              )}
            </div>
          )}

          {extra}
        </div>
      </div>
    </section>
  );
}
