import { NextResponse } from "next/server";

// Mock data response for dashboard
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || "employee";

  if (role === "admin") {
    return NextResponse.json({
      stats: [
        { title: "Total Headcount", value: "2,451", trend: { value: 12, isPositive: true } },
        { title: "Today's Attendance", value: "92%", trend: { value: 2.1, isPositive: true } },
        { title: "Pending Leaves", value: "43" },
        { title: "Payroll Cycle", value: "4 Days" }
      ]
    });
  }

  return NextResponse.json({
    stats: [
      { title: "Weekly Hours", value: "32.5h", trend: { value: 5, isPositive: true } },
      { title: "PTO Balance", value: "14 Days" },
      { title: "Next Holiday", value: "Sep 2" },
      { title: "Latest Payslip", value: "Aug 15" }
    ]
  });
}
