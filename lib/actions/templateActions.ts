"use server";

export async function generateTemplate(type: string, studentName: string) {
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  
  if (type === "Letter of Intent") {
    return `
OFFICE OF STUDENT AFFAIRS AND SERVICES
Institutional Scholarship Department

LETTER OF INTENT

Date: ${date}

TO: THE OSAS DIRECTOR
University of the Philippines

Dear Sir/Madam,

I, ${studentName}, a student of this prestigious institution, am writing to formally express my intent to apply for the Scholarship Program. 

My primary motivation for applying is to alleviate the financial burden on my family and to focus more effectively on my academic goals. I am committed to maintaining the required Grade Point Average (GPA) and actively participating in university service activities as mandated by the scholarship guidelines.

Attached herewith are the necessary documents for your review and consideration.

Thank you for this opportunity.

Sincerely,

__________________________
${studentName}
(Signature over Printed Name)
    `.trim();
  }

  if (type === "Sketch of House") {
    return `
OFFICE OF STUDENT AFFAIRS AND SERVICES
Socio-Economic Verification Module

SKETCH OF HOUSE LOCATION (TEMPLATE)

Student Name: ${studentName}
Date: ${date}

INSTRUCTIONS:
1. Please draw a clear map starting from the nearest major landmark (Church, School, or Barangay Hall).
2. Indicate major street names and house numbers.
3. Use a permanent black ink.
4. Mark your residence with a "STAR" symbol.

[ DOCUMENT AREA: PLEASE ATTACH DRAWING HERE ]

Verified by: __________________________ (Barangay Official)
    `.trim();
  }

  return `Template not available for this document type.`;
}
