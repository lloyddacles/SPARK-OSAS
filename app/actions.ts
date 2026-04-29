"use server";

import { revalidatePath } from "next/cache";

export async function getDashboardStats() {
  return {
    studentsCount: 12450,
    requestsCount: 842,
    appointmentsCount: 128,
    scholarshipsCount: 45,
  };
}

export async function getEvents() {
  return [
    {
      id: "ev1",
      title: 'Career Fair 2026',
      description: 'Connect with top companies and explore career opportunities.',
      location: 'University Grand Hall',
      startTime: new Date('2026-11-05T09:00:00Z'),
      endTime: new Date('2026-11-05T17:00:00Z'),
      capacity: 500,
    },
    {
      id: "ev2",
      title: 'Mental Health Awareness Workshop',
      description: 'A comprehensive workshop on maintaining mental wellness during exams.',
      location: 'OSAS Conference Room',
      startTime: new Date('2026-11-12T14:00:00Z'),
      endTime: new Date('2026-11-12T16:00:00Z'),
      capacity: 150,
    }
  ];
}

export async function getScholarships() {
  return [
    {
      id: "sc1",
      name: "President's Merit Grant",
      provider: 'University Foundation',
      description: 'Full tuition coverage for top academic performers.',
      deadline: new Date('2026-12-15T23:59:59Z'),
      isActive: true
    },
    {
      id: "sc2",
      name: 'STEM Excellence Scholarship',
      provider: 'TechCorp Global',
      description: 'Financial assistance for outstanding students in STEM.',
      deadline: new Date('2026-11-30T23:59:59Z'),
      isActive: true
    }
  ];
}

// Example mutation
export async function createServiceRequest(formData: FormData) {
  // Mock function, no database operation
  const type = formData.get("type") as string;
  const description = formData.get("description") as string;
  
  console.log("Mock Request Created:", type, description);

  revalidatePath("/requests");
}
