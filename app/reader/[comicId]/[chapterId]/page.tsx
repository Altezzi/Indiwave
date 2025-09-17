import ComicReader from "../../../../components/ComicReader";

type Params = { params: { comicId: string; chapterId: string } };

async function getComic(comicId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/comics/${comicId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load comic");
  return res.json();
}

export default async function ReaderPage({ params }: Params) {
  const { comicId, chapterId } = params;
  const data = await getComic(comicId);
  
  // Find the specific chapter
  const chapter = data.comic.chapters?.find((ch: any) => ch.id === chapterId);
  
  if (!chapter) {
    return <div>Chapter not found</div>;
  }

  // Create a comic object with the chapter's pages
  const comicWithChapter = {
    ...data.comic,
    pages: chapter.pages,
    title: `${data.comic.title} - ${chapter.title}`
  };

  return <ComicReader comic={comicWithChapter} />;
}

