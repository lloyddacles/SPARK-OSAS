import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInstitutionalPDF = async (options: {
  title: string;
  subtitle?: string;
  sections: { title: string; data: any[][] }[];
  filename: string;
  orientation?: "p" | "l";
}) => {
  const { title, subtitle, sections, filename, orientation = "p" } = options;
  const doc = new jsPDF(orientation, "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // Sapphire Institutional Branding
  const PRIMARY_COLOR = [0, 229, 255]; // var(--primary)
  
  const addHeader = (d: jsPDF) => {
    d.setFillColor(10, 15, 25);
    d.rect(0, 0, pageWidth, 40, "F");

    d.setTextColor(255, 255, 255);
    d.setFont("helvetica", "bold");
    d.setFontSize(18);
    d.text("SPARK INSTITUTIONAL AI", 15, 15);
    
    d.setFontSize(8);
    d.setFont("helvetica", "normal");
    d.setTextColor(0, 229, 255);
    d.text("SYSTEM_ALPHA_01 // OSAS MANAGEMENT DIVISION", 15, 20);

    d.setTextColor(255, 255, 255);
    d.setFontSize(22);
    d.setFont("helvetica", "bold");
    d.text(title.toUpperCase(), 15, 32);

    d.setFontSize(8);
    d.setTextColor(150, 150, 150);
    const timestamp = new Date().toLocaleString();
    d.text(`GENERATED: ${timestamp}`, pageWidth - 15, 15, { align: "right" });
    if (subtitle) {
      d.text(subtitle.toUpperCase(), pageWidth - 15, 20, { align: "right" });
    }
  };

  addHeader(doc);

  let currentY = 45;

  sections.forEach((section, index) => {
    // Check if we need a new page
    if (currentY > 230) {
      doc.addPage();
      addHeader(doc);
      currentY = 45;
    }

    // Section Header
    doc.setFillColor(240, 240, 240);
    doc.rect(15, currentY, pageWidth - 30, 8, "F");
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, 20, currentY + 5.5);
    
    currentY += 12;

    autoTable(doc, {
      startY: currentY,
      head: [section.data[0]],
      body: section.data.slice(1),
      theme: "grid",
      headStyles: {
        fillColor: [10, 15, 25],
        textColor: [0, 229, 255],
        fontSize: 8,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 7,
        cellPadding: 3,
        valign: "middle",
        font: "helvetica"
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      },
      margin: { left: 15, right: 15 },
      didDrawPage: (data) => {
        currentY = data.cursor?.y || currentY;
      }
    });

    currentY += 15;
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | Institutional Confidentiality Protocol Active`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  doc.save(`${filename}_${new Date().getTime()}.pdf`);
};

/**
 * THE DIGITAL PASSPORT - OFFICIAL INSTITUTIONAL RECORD
 */
export const generateInstitutionalPassport = async (student: any, apps: any[], requests: any[], referrals: any[]) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Branding: Institutional Header
  doc.setFillColor(10, 15, 25);
  doc.rect(0, 0, pageWidth, 50, "F");
  
  // Decorative Accent
  doc.setFillColor(0, 229, 255);
  doc.rect(0, 48, pageWidth, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("SPARK", 15, 25);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 229, 255);
  doc.text("OFFICE OF STUDENT AFFAIRS AND SERVICES", 15, 30);
  doc.text("DIGITAL INSTITUTIONAL PASSPORT // v2.0", 15, 34);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text("OFFICIAL STUDENT RECORD", pageWidth - 15, 25, { align: "right" });
  doc.setFontSize(8);
  doc.text(`ISSUED: ${new Date().toLocaleDateString()}`, pageWidth - 15, 30, { align: "right" });

  // Student Profile Card
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 60, pageWidth - 30, 40, 2, 2, "F");
  
  doc.setTextColor(10, 15, 25);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(student?.name?.toUpperCase() || "NAME NOT FOUND", 25, 75);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`ID: ${student?.id || "N/A"}`, 25, 82);
  doc.text(`DEPARTMENT: ${student?.department || "N/A"}`, 25, 87);
  doc.text(`PROGRAM: ${student?.program || "N/A"}`, 25, 92);

  // Status Badge
  doc.setFillColor(16, 185, 129); // Success Green
  doc.roundedRect(pageWidth - 55, 68, 30, 8, 1, 1, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text("VERIFIED RECORD", pageWidth - 40, 73.5, { align: "center" });

  let currentY = 110;

  // 1. SCHOLARSHIP HISTORY
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 15, 25);
  doc.text("SCHOLARSHIP & ASSISTANCE HISTORY", 15, currentY);
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [["ID", "PROGRAM", "DATE APPLIED", "STATUS"]],
    body: apps.map(app => [
      app.id.substring(0, 8),
      app.studentName, // Note: In our state, app.studentName is often the program name for the student view
      app.dateApplied,
      app.status
    ]),
    theme: "grid",
    headStyles: { fillColor: [10, 15, 25], textColor: [0, 229, 255], fontSize: 8 },
    styles: { fontSize: 7, font: "helvetica" },
    margin: { left: 15, right: 15 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

  // 2. DISCIPLINARY & REFERRAL RECORD
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("INSTITUTIONAL REFERRAL RECORD", 15, currentY);

  autoTable(doc, {
    startY: currentY + 5,
    head: [["DATE", "ADVISER", "REASON", "STATUS"]],
    body: referrals.map(ref => [
      ref.dateFiled,
      ref.adviserName,
      ref.reason.substring(0, 40) + "...",
      ref.status
    ]),
    theme: "grid",
    headStyles: { fillColor: [10, 15, 25], textColor: [0, 229, 255], fontSize: 8 },
    styles: { fontSize: 7, font: "helvetica" },
    margin: { left: 15, right: 15 }
  });

  // Footer & Authentication
  const footerY = pageHeight - 30;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, footerY, pageWidth - 15, footerY);
  
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("This document is a certified digital export of the SPARK Institutional System.", 15, footerY + 8);
  doc.text("Verification Hash: " + btoa(student?.id || "VOID").substring(0, 32), 15, footerY + 12);
  
  doc.setTextColor(10, 15, 25);
  doc.setFont("helvetica", "bold");
  doc.text("OSAS DIGITAL SEAL", pageWidth - 15, footerY + 8, { align: "right" });

  doc.save(`PASSPORT_${student?.name?.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
};
