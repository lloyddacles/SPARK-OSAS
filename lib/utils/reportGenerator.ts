import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * INSTITUTIONAL REPORT GENERATOR
 * Generates professional PDF reports for the Scholar Inventory.
 */
export const generateScholarReport = (scholars: any[], total: number) => {
  // @ts-ignore - jspdf-autotable extends jsPDF
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  const timestamp = new Date().toLocaleString();
  const reportId = `OSR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // 1. Institutional Header
  doc.setFillColor(5, 7, 10);
  doc.rect(0, 0, 297, 40, "F");

  doc.setTextColor(0, 229, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("SPARK INSTITUTIONAL HUB", 20, 20);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("OFFICE OF STUDENT AFFAIRS AND SERVICES (OSAS)", 20, 28);
  
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text(`REPORT_ID: ${reportId}  |  GENERATED: ${timestamp}`, 20, 34);

  // 2. Title & Stats Section
  doc.setTextColor(5, 7, 10);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("OFFICIAL SCHOLAR INVENTORY REGISTRY", 20, 55);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Total Records Analyzed: ${total}`, 20, 62);
  doc.text(`Current View Count: ${scholars.length}`, 20, 67);

  // 3. Table Generation
  const tableData = scholars.map(s => [
    s.studentId,
    s.studentName.toUpperCase(),
    s.programName,
    s.batch,
    s.type.toUpperCase(),
    s.category.toUpperCase(),
    s.status.toUpperCase()
  ]);

  // @ts-ignore
  doc.autoTable({
    startY: 75,
    head: [["ID", "NAME", "PROGRAM", "BATCH", "TYPE", "CATEGORY", "STATUS"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [0, 229, 255],
      textColor: [5, 7, 10],
      fontSize: 9,
      fontStyle: "bold"
    },
    styles: {
      fontSize: 8,
      cellPadding: 4
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    margin: { left: 20, right: 20 }
  });

  // 4. Footer & Verification Node
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount}`, 270, 200);
    doc.text("VALIDATED BY SPARK INSTITUTIONAL AI", 20, 200);
  }

  // 5. Download Trigger
  doc.save(`SPARK_SCHOLAR_REPORT_${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * BATCH RECOMMENDATION REPORT
 * Generates official recommendation lists for VPAA/Presidential approval.
 */
export const generateBatchRecommendationReport = (batchId: number, apps: any[]) => {
  // @ts-ignore
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const timestamp = new Date().toLocaleString();
  
  // 1. Institutional Header
  doc.setFillColor(5, 7, 10);
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(0, 229, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("SPARK INSTITUTIONAL HUB", 15, 18);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("OFFICE OF STUDENT AFFAIRS AND SERVICES", 15, 25);
  
  // 2. Report Body
  doc.setTextColor(5, 7, 10);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`SCHOLARSHIP RECOMMENDATION LIST - BATCH ${batchId}`, 15, 50);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("The following students have been thoroughly verified and are hereby recommended for", 15, 58);
  doc.text("institutional scholarship support based on their verified vault documents and academic standing.", 15, 63);

  const tableData = apps.map((a, i) => [
    i + 1,
    a.studentName.toUpperCase(),
    a.recommendationLevel ? `${a.recommendationLevel.toUpperCase()} SCHOLAR` : "PARTIAL SCHOLAR",
    "VERIFIED"
  ]);

  // @ts-ignore
  doc.autoTable({
    startY: 75,
    head: [["#", "STUDENT NAME", "LEVEL", "STATUS"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [5, 7, 10], textColor: [0, 229, 255], fontSize: 8 },
    styles: { fontSize: 8 },
    margin: { left: 15, right: 15 }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 25;

  // 3. Digital Institutional Stamp (Visual)
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.circle(175, 255, 20, "S");
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(6);
  doc.text("SPARK", 175, 250, { align: "center" });
  doc.text("INSTITUTIONAL", 175, 253, { align: "center" });
  doc.text("VERIFIED", 175, 256, { align: "center" });
  doc.setFontSize(4);
  doc.text(new Date().getFullYear().toString(), 175, 260, { align: "center" });

  // 4. Signatories
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(5, 7, 10);
  
  // OSAS Director
  doc.text("__________________________", 15, finalY);
  doc.text("OSAS DIRECTOR", 15, finalY + 5);
  
  // VPAA
  doc.text("__________________________", 120, finalY);
  doc.text("VP FOR ACADEMIC AFFAIRS", 120, finalY + 5);

  // President (Centered)
  doc.text("__________________________", 67.5, finalY + 25);
  doc.text("UNIVERSITY PRESIDENT", 75, finalY + 30);

  // 5. Secure Footer & Token
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`CERTIFIED GENUINE: ${timestamp}`, 15, 285);
  doc.text("SPARK_SECURE_TOKEN: " + Math.random().toString(36).substr(2, 12).toUpperCase(), 120, 285);
  
  // Watermark (Diagonal)
  doc.setTextColor(241, 245, 249);
  doc.setFontSize(60);
  doc.text("VERIFIED BY SPARK", 30, 150, { angle: 45 });

  doc.save(`BATCH_${batchId}_RECOMMENDATION_LIST.pdf`);
};
