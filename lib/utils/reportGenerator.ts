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
