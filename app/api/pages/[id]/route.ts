import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Page from "@/models/page";

// ------------------------ GET PAGE BY ID ------------------------
export async function GET(request: NextRequest, context: any) {
  const { id } = context.params;

  try {
    await dbConnect();
    const page = await Page.findById(id);

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error("GET /pages/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}

// ------------------------ UPDATE PAGE ------------------------
export async function PUT(request: NextRequest, context: any) {
  const { id } = context.params;

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

    const page = await Page.findByIdAndUpdate(
      id,
      { title, type },
      { new: true, runValidators: true }
    );

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error("PUT /pages/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update page" },
      { status: 500 }
    );
  }
}

// ------------------------ DELETE PAGE ------------------------
export async function DELETE(request: NextRequest, context: any) {
  const { id } = context.params;

  try {
    await dbConnect();
    const page = await Page.findByIdAndDelete(id);

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error("DELETE /pages/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete page" },
      { status: 500 }
    );
  }
}
