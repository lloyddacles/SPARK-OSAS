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
