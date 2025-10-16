import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Page from '@/models/page';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const { no, money, interest, date } = body;

    if (no === undefined || money === undefined) {
      return NextResponse.json(
        { success: false, error: 'No and money are required' },
        { status: 400 }
      );
    }

    const page = await Page.findById(params.id);

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    const newEntry = {
      no: Number(no),
      money: Number(money),
      interest: interest !== undefined ? Number(interest) : 0,
      date: date ? new Date(date) : new Date(),
    };

    page.entries.push(newEntry);
    await page.save();

    return NextResponse.json({ success: true, data: page }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create entry' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const { entryId, no, money, interest, date } = body;

    if (!entryId) {
      return NextResponse.json(
        { success: false, error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    const page = await Page.findById(params.id);

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    const entry = (page.entries as any).id(entryId);

    if (!entry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    if (no !== undefined) entry.no = Number(no);
    if (money !== undefined) entry.money = Number(money);
    if (interest !== undefined) entry.interest = Number(interest);
    if (date !== undefined) entry.date = new Date(date);

    await page.save();

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('entryId');

    if (!entryId) {
      return NextResponse.json(
        { success: false, error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    const page = await Page.findById(params.id);

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    const entry = (page.entries as any).id(entryId);

    if (!entry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    entry.deleteOne();
    await page.save();

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
}
