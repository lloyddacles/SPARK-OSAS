"use server";

import { readData, writeData } from "@/lib/storage";
import { revalidatePath } from "next/cache";

export type VaultStatus = "Verified" | "Not Yet Verified" | "For Re-upload" | "Wrong Document" | "Blurred";

export async function uploadToVault(userId: string, docName: string) {
  const data = await readData();
  const userIndex = data.users.findIndex((u: any) => u.id === userId);
  
  if (userIndex !== -1) {
    if (!data.users[userIndex].vault) data.users[userIndex].vault = {};
    
    data.users[userIndex].vault[docName] = {
      uploaded: true,
      status: "Not Yet Verified",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      fileType: "application/pdf"
    };
    
    // Auto-sync still works but we might want to only sync "Verified" docs?
    // For now, let's keep it as is, but typically only Verified docs should lock the checkbox.
    
    await writeData(data);
    revalidatePath("/submissions");
    return data.users[userIndex];
  }
}

export async function verifyDocument(userId: string, docName: string, status: VaultStatus, remarks?: string) {
  const data = await readData();
  const userIndex = data.users.findIndex((u: any) => u.id === userId);
  
  if (userIndex !== -1) {
    if (data.users[userIndex].vault[docName]) {
      data.users[userIndex].vault[docName].status = status;
      data.users[userIndex].vault[docName].remarks = remarks;
      
      // Update Scholarship Apps if it's Verified
      if (status === "Verified") {
        data.scholarshipApps = data.scholarshipApps.map((app: any) => {
          if (app.studentId === userId) {
            if (app.requirements && docName in app.requirements) {
              app.requirements[docName] = true;
            }
          }
          return app;
        });
      } else {
         // If it's NOT verified, uncheck it from scholarship apps
         data.scholarshipApps = data.scholarshipApps.map((app: any) => {
          if (app.studentId === userId) {
            if (app.requirements && docName in app.requirements) {
              app.requirements[docName] = false;
            }
          }
          return app;
        });
      }
    }
    
    await writeData(data);
    revalidatePath("/submissions");
    revalidatePath("/scholarships");
    return data.users[userIndex];
}
}

export async function getAllStudentVaults() {
  const data = await readData();
  return data.users.filter((u: any) => u.role === "STUDENT_APPLICANT");
}
