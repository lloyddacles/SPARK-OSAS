import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data.json");

export async function readData() {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    // Return initial empty state if file doesn't exist
    return {
      organizations: [],
      activities: [],
      referrals: [],
      announcements: [],
      scholarships: [],
      scholarshipApps: [],
      batchConfigs: [],
      serviceRequests: [],
      serviceTypes: [],
      notifications: [],
      auditLogs: [],
      users: []
    };
  }
}

export async function writeData(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}
