import ComicReader from "../../../../components/ComicReader";

type Params = { params: { comicId: string; chapterId: string } };

async function getComic(comicId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/comics/${comicId}`, {
    cache: "no-store", // always fetch fresh data
  });
  if (!res.ok) throw new Error("Failed to load comic");
  return res.json();
}

// ✅ Allow on-demand routes
export const dynamicParams = true;

// ✅ Incremental Static Regeneration (optional)
// This means Next.js will cache the page for 60s, then refresh it automatically
export const revalidate = 60;

export default async function ReaderPage({ params }: Params) {
  const { comicId, chapterId } = params;
  const data = await getComic(comicId);

  const chapter = data.comic.chapters?.find((ch: any) => ch.id === chapterId);

  if (!chapter) {
    return <div>Chapter not found</div>;
  }

  const comicWithChapter = {
    ...data.comic,
    pages: chapter.pages,
    title: `${data.comic.title} - ${chapter.title}`,
  };

  return <ComicReader comic={comicWithChapter} />;
}