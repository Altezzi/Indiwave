import { NextResponse } from "next/server";
import data from "../../../../data/comics.json";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const comic = data.comics.find((c) => c.id === params.id);
  if (!comic) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json({ comic });
}
