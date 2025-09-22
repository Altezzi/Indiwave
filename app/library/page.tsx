// app/library/page.tsx
import { headers } from "next/headers";
import LibraryContent from "../../components/LibraryContent";
import BackToTopButton from "../../components/BackToTopButton";
import LibraryLayout from "../../components/LibraryLayout";
import { CoverFallbackProvider } from "../../components/CoverFallbackProvider";

// Force fresh data on every request
export const revalidate = 0;

// Show all manga without pagination

type Comic = {
  id: string;
  title: string;
  cover: string;
  author?: string;
  artist?: string;
  year?: string | number;
  tags?: string[];
  chapters?: Array<{ id: string; title: string; pages?: string[] }>;
  [key: string]: any;
};

function getBaseUrl() {
  const h = headers();

  // Prefer real host from the request (works on Netlify)
  const forwardedHost = h.get("x-forwarded-host");
  const host = forwardedHost || h.get("host");

  // Netlify also exposes these during build/runtime
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL || // set this in Netlify to your canonical domain
    process.env.URL ||                  // eg. https://<site>.netlify.app
    process.env.DEPLOY_PRIME_URL;       // preview URL on PR builds

  const proto = h.get("x-forwarded-proto") || "https";
  const candidate = host ? `${proto}://${host}` : envUrl;

  // Final fallback for local dev
  return candidate?.startsWith("http") ? candidate : "http://localhost:3000";
}

async function getComics(): Promise<{ comics: Comic[] } | Comic[]> {
  const origin = getBaseUrl();

  // Force fresh data - no caching
  const res = await fetch(`${origin}/api/comics`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    // During first-ever build, if your API depends on runtime state, avoid failing the whole build.
    // Render an empty library but allow ISR to repopulate on first requests.
    return { comics: [] };
  }

  return res.json();
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: { page?: string; genre?: string; search?: string };
}) {
  const data = await getComics();
  const allComics: Comic[] = Array.isArray(data) ? data : data.comics ?? [];

  return (
    <div style={{ position: "relative", minHeight: "300vh" }}>
      {/* Background Image with Artistic Effects */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url('/shika-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          zIndex: -3,
        }}
      />
      {/* Overlay Effects */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "linear-gradient(45deg, rgba(138, 180, 255, 0.1) 0%, rgba(255, 182, 193, 0.05) 50%, rgba(138, 180, 255, 0.1) 100%)",
          zIndex: -2,
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(138, 180, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 182, 193, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(138, 180, 255, 0.1) 0%, transparent 50%)",
          zIndex: -1,
        }}
      />

      {/* Content Container */}
      <LibraryLayout>
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "40px", padding: "40px 20px" }}>
          <h1
            style={{
              margin: "0 0 16px",
              fontSize: "36px",
              fontWeight: 700,
              color: "var(--fg)",
            }}
          >
            Comic Library
          </h1>
          <p
            style={{
              margin: "0 auto 24px",
              fontSize: "18px",
              color: "var(--fg)",
              maxWidth: "600px",
            }}
          >
            Explore our collection of amazing comics from independent creators and
            public domain classics.
          </p>
          
          {/* Library Stats */}
          <div
            style={{
              margin: "0 auto 24px",
              fontSize: "16px",
              color: "var(--fg)",
              opacity: 0.8,
            }}
          >
            📚 {allComics.length} total manga in library
          </div>

          {/* Search and Filter Bar */}
          <CoverFallbackProvider>
            <LibraryContent
              allComics={allComics}
            />
          </CoverFallbackProvider>
        </div>
      </LibraryLayout>

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
}