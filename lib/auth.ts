// This is a mocked auth helper specifically for the 'features/attendance-karan' branch.
// In the integrated version, this will import NextAuth session logic.

export async function getServerSession() {
  // Mocking a logged-in employee for isolated development and testing
  return {
    user: {
      id: "mock-user-123",
      email: "karan@dayflow.com",
      name: "Karan",
      role: "EMPLOYEE"
    }
  };
}
