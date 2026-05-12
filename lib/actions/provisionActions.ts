import { getPrisma } from "@/lib/prisma";

export async function provisionTestAccounts() {
  const db = getPrisma();
  if (!db) return { success: false, message: "DB_OFFLINE" };

  const testAccounts = [
    { id: "ADMIN-MASTER", name: "Administrator", username: "admin", role: "SYSTEM_ADMIN" },
    { id: "COUNSELOR-TEST", name: "Myael Ursolino", username: "counselor", role: "GUIDANCE_COUNSELOR" },
    { id: "ADVISER-TEST", name: "Lloyd Dacles", username: "adviser", role: "ADVISER" },
    { id: "PRESIDENT-TEST", name: "Juan Dela Cruz", username: "president", role: "STUDENT_APPLICANT" }
  ];

  console.log("[PROVISIONING] Initializing Institutional Test Accounts...");

  for (const acc of testAccounts) {
    await db.user.upsert({
      where: { id: acc.id },
      update: { role: acc.role },
      create: {
        id: acc.id,
        name: acc.name,
        username: acc.username,
        password: acc.username, // Default password matches username for tests
        role: acc.role,
        vault: {}
      }
    });
  }

  console.log("[PROVISIONING] All Institutional Identities Synchronized.");
  return { success: true };
}
