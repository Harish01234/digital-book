import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Page from "@/models/page";

// ------------------------ GET ALL PAGES OR SINGLE PAGE ------------------------
export async function GET(_request: NextRequest, context: any) {
  const { id } = context.params || {};

  try {
    await dbConnect();

    if (id) {
      // Fetch a single page if ID is provided
      const page = await Page.findById(id);
      if (!page) {
        return NextResponse.json(
          { success: false, error: "Page not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: page });
    }

    // Otherwise, fetch all pages
    const pages = await Page.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: pages });
  } catch (error) {
    console.error("GET /pages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

// ------------------------ CREATE PAGE ------------------------
export async function POST(request: NextRequest, _context: any) {
  try {
    await dbConnect();
    const body = await request.json();
    const { title, type } = body;

    if (!title || !type) {
      return NextResponse.json(
        { success: false, error: "Title and type are required" },
        { status: 400 }
      );
    }

    if (type !== "deoya" && type !== "neoya") {
      return NextResponse.json(
        { success: false, error: "Type must be either 'deoya' or 'neoya'" },
        { status: 400 }
      );
    }

    const page = await Page.create({ title, type, entries: [] });
    return NextResponse.json({ success: true, data: page }, { status: 201 });
  } catch (error) {
    console.error("POST /pages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create page" },
      { status: 500 }
    );
  }
}
