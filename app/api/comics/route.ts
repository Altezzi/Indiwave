import { NextResponse } from "next/server";
import data from "../../../data/comics.json";

export async function GET() {
  return NextResponse.json({ comics: data.comics.map(({ pages, ...rest }) => rest) });
}
