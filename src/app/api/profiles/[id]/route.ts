import { NextResponse } from "next/server";

const mockProfileDB = new Map();

mockProfileDB.set("user-123", {
  id: "user-123",
  userId: "user-123",
  firstName: "Sarah",
  lastName: "Connor",
  contactEmail: "sarah.connor@example.com",
  phoneNumber: "+1 (555) 019-2839",
  department: "Engineering",
  designation: "Senior Frontend Developer",
  joinDate: "2023-01-15T00:00:00.000Z",
});

// Next.js 15+: params is a Promise
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profile = mockProfileDB.get(id);

  if (!profile) {
    return new NextResponse("Profile not found", { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const existingProfile = mockProfileDB.get(id);

  if (!existingProfile) {
    return new NextResponse("Profile not found", { status: 404 });
  }

  const updatedProfile = { ...existingProfile, ...body };
  mockProfileDB.set(id, updatedProfile);

  return NextResponse.json(updatedProfile);
}
