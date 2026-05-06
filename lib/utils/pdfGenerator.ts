import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInstitutionalPDF = async (options: {
  title: string;
  subtitle: string;
  data: any[];
  columns: { header: string; dataKey: string }[];
  filename: string;
  orientation?: "p" | "l";
}) => {
  const { title, subtitle, data, columns, filename, orientation = "p" } = options;
  const doc = new jsPDF(orientation, "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // Sapphire Institutional Branding
  const PRIMARY_COLOR = [0, 229, 255]; // var(--primary)
  const TEXT_MAIN = [255, 255, 255];
  const BG_DARK = [10, 15, 25]; // var(--bg-surface)

  // Add Header Background
  doc.setFillColor(10, 15, 25);
  doc.rect(0, 0, pageWidth, 40, "F");

  // Add University Header (Mock)
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("SPARK INSTITUTIONAL AI", 15, 15);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 229, 255);
  doc.text("SYSTEM_ALPHA_01 // OSAS MANAGEMENT DIVISION", 15, 20);

  // Report Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(title.toUpperCase(), 15, 32);

  // Timestamp & Meta
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const timestamp = new Date().toLocaleString();
  doc.text(`GENERATED: ${timestamp}`, pageWidth - 15, 15, { align: "right" });
  doc.text(`NODES: ${data.length}`, pageWidth - 15, 20, { align: "right" });

  // AutoTable Integration
  autoTable(doc, {
    startY: 45,
    head: [columns.map(c => c.header.toUpperCase())],
    body: data.map(item => columns.map(c => item[c.dataKey]?.toString() || "N/A")),
    theme: "grid",
    headStyles: {
      fillColor: [10, 15, 25],
      textColor: [0, 229, 255],
      fontSize: 8,
      fontStyle: "bold",
      halign: "center"
    },
    styles: {
      fontSize: 7,
      cellPadding: 3,
      valign: "middle",
      font: "helvetica"
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { left: 15, right: 15 }
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
