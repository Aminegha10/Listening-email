import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../public/SmabLogo.jpg"; // adjust path if needed
import { logo64Base } from "./logo64Base";
import html2canvas from "html2canvas";

// csv export
export const exportToCSV = (data, filterDate, dataType) => {
  if (!data?.length) return;

  const headers =
    dataType === "Orders"
      ? ["Order #", "Client", "Price", "Sales Agent", "Products Count"]
      : [
          "Product Name",
          "Quantity Sold",
          "Revenue",
          "Orders Count",
          "Last Order Date",
        ];

  const rows =
    dataType === "Orders"
      ? data.map((row) => [
          row.getValue?.("orderNumber") || "N/A",
          row.getValue?.("client") || "N/A",
          row.getValue?.("price") || "N/A",
          row.getValue?.("salesAgent") || "N/A",
          (row.getValue?.("products") || []).length,
        ])
      : data.map((row) => [
          row.getValue?.("productName") || "N/A",
          row.getValue?.("quantitySold") || "N/A",
          row.getValue?.("revenue") || "N/A",
          row.getValue?.("ordersCount") || "N/A",
          row.getValue?.("lastOrderedDate") || "N/A",
        ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  );

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${dataType}-${filterDate}-${
    new Date().toISOString().split("T")[0]
  }.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// json export
export const exportToJSON = (data, filterDate, dataType) => {
  if (!data?.length) return;

  const exportData =
    dataType === "Orders"
      ? data.map((row) => ({
          orderNumber: row.getValue?.("orderNumber") || "N/A",
          client: row.getValue?.("client") || "N/A",
          price: row.getValue?.("price") || "N/A",
          salesAgent: row.getValue?.("salesAgent") || "N/A",
          products: row.getValue?.("products") || [],
        }))
      : data.map((row) => ({
          productName: row.getValue?.("productName") || "N/A",
          quantitySold: row.getValue?.("quantitySold") || "N/A",
          revenue: row.getValue?.("revenue") || "N/A",
          ordersCount: row.getValue?.("ordersCount") || "N/A",
          lastOrderedDate: row.getValue?.("lastOrderedDate") || "N/A",
        }));

  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${dataType}-${filterDate}-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const exportToPDF = async (
  data,
  filterDate,
  dataType,
  filterPieChart,
  chartElement,
  filterTopClient
) => {
  if (!data || data.length === 0) return;
  if (!filterDate) filterDate = "AllTime";
  if (filterDate == "currentYear") filterDate = "Current Year";
  if (filterDate == "thisMonth") filterDate = "current Month";
  if (filterDate == "thisWeek") filterDate = "current Week";

  console.log(filterTopClient);
  console.log(data);
  const doc = new jsPDF();

  // ===== HEADER =====
  const headerHeight = 20;

  // Background
  doc.setFillColor(239, 83, 80); // red
  doc.rect(0, 0, 210, headerHeight, "F");

  // Logo on the LEFT
  const logoHeight = 12;
  const logoWidth = 24;
  const logoX = 10; // left margin
  const logoY = (headerHeight - logoHeight) / 2;
  doc.addImage(logo64Base, "JPEG", logoX, logoY, logoWidth, logoHeight);

  // Title on the RIGHT
  doc.setTextColor(255, 255, 255); // white text
  doc.setFontSize(14);
  const titleText = `${dataType} Report`;
  const titleWidth = doc.getTextWidth(titleText); // width of text
  const titleX = 210 - titleWidth - 10; // right margin 10
  const titleY = headerHeight / 2 + 4;
  doc.text(titleText, titleX, titleY);
  // HEADER===================

  doc.setFontSize(10);
  doc.setTextColor(0); // black
  doc.text(`Date Filter: ${filterDate}`, 10, headerHeight + 10);
  doc.text(
    `Generated on: ${new Date().toLocaleDateString()}`,
    150,
    headerHeight + 10
  );
  doc.setFontSize(8);
  doc.text(`Total Records: ${data.length}`, 10, headerHeight + 17);

  // ===== TABLE =====
  // padding top +...
  const startY = headerHeight + 25;

  const headers =
    dataType === "Orders"
      ? ["Order #", "Client", "Price", "Sales Agent", "Products Count"]
      : dataType === "Products"
      ? [
          "Product Name",
          "Quantity Sold",
          "Revenue",
          "Orders Count",
          "Last Order Date",
        ]
      : dataType === "Clients"
      ? [
          "Client Name",
          "Orders Count",
          "Products Ordered",
          "Order Average",
          "Revenue",
        ]
      : dataType === "TopClients"
      ? [
          "Client Name",
          filterTopClient === "revenue"
            ? "Revenue DH"
            : filterTopClient === "ordersCount"
            ? "Orders Count"
            : "Products Ordered",
        ]
      : ["Product", filterPieChart];

  const rows =
    dataType === "Orders"
      ? data.map((row) => [
          row.getValue("orderNumber"),
          row.getValue("client"),
          row.getValue("price"),
          row.getValue("salesAgent"),
          (row.getValue("products") || []).length,
        ])
      : dataType === "Products"
      ? data.map((row) => [
          row.getValue("productName"),
          row.getValue("quantitySold"),
          row.getValue("revenue") || "N/A",
          row.getValue("ordersCount"),
          row.getValue("lastOrderedDate"),
        ])
      : dataType === "Clients"
      ? data.map((row) => [
          row.getValue("clientName"),
          row.getValue("ordersCount"),
          row.getValue("productsQuantity") || "N/A",
          row.getValue("orderAverage"),
          row.getValue("revenue"),
        ])
      : dataType === "TopClients"
      ? data.map((row) => [row.clientName, row[filterTopClient]])
      : data.map((row) => [row.product, row[filterPieChart]]);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY,
    styles: {
      fontSize: 9, // slightly larger font
      cellPadding: 4, // more padding for readability
      textColor: 50, // dark gray text
      halign: "center", // center horizontally
      valign: "middle", // center vertically
      lineColor: [220, 220, 220], // subtle border color
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [239, 83, 80], // red header
      textColor: 255, // white text
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245], // light gray for alternate rows
    },
    // columnStyles: {
    //   0: { cellWidth: 25 }, // adjust column width for first column
    //   1: { cellWidth: 35 }, // adjust for client/product name
    //   2: { cellWidth: 25 },
    //   3: { cellWidth: 30 },
    //   4: { cellWidth: 25 },
    // },
    margin: { top: startY, left: 10, right: 10 },
    tableLineColor: [200, 200, 200], // subtle table border
    tableLineWidth: 0.3,
  });

  // ===== ADD CHART TO SECOND PAGE =====
  if (chartElement) {
    try {
      doc.addPage();

      // Header for second page
      doc.setFillColor(239, 83, 80);
      doc.rect(0, 0, 210, headerHeight, "F");
      doc.addImage(logo64Base, "JPEG", logoX, logoY, logoWidth, logoHeight);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text(
        `${dataType} Chart Visualization`,
        logoX + logoWidth + 12,
        titleY
      );

      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.backgroundColor = "#ffffff";
      tempContainer.style.padding = "20px";
      tempContainer.style.borderRadius = "8px";
      tempContainer.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";

      const chartClone = chartElement.cloneNode(true);

      const style = document.createElement("style");
      style.textContent = `
        * { color: #333 !important; background-color: #fff !important; border-color: #ddd !important; }
        .recharts-pie-label-text { fill: #333 !important; font-size: 10px !important; } /* smaller labels */
        .recharts-tooltip-wrapper { background-color: #fff !important; border: 1px solid #ddd !important; }
      `;
      tempContainer.appendChild(style);
      tempContainer.appendChild(chartClone);
      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = 120; // slightly smaller chart width
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const chartX = (210 - pdfWidth) / 2;
      const chartY = headerHeight + 20;
      doc.addImage(imgData, "PNG", chartX, chartY, pdfWidth, pdfHeight);

      // ===== LEGEND =====
      const legendX = 20;
      let legendY = chartY + pdfHeight + 10;
      const boxSize = 3; // smaller box
      const spacing = 3;
      const lineHeight = 4; // smaller line height

      const COLORS = [
        "#14b8a6", // chart-1 (teal-500)
        "#0f766e", // chart-2 (teal-700)
        "#2dd4bf", // chart-3 (teal-400)
        "#64748b", // chart-4 (slate-500)
        "#334155", // chart-5 (slate-700)
        "#0d9488", // primary (teal-600)
        "#0891b2", // accent (cyan-600, complementary)
        "#10b981", // success / green (fits teal family)
        "#dc2626", // destructive (red-600)
        "#f1f5f9", // muted (slate-100)
        "#0f766e", // sidebar-primary (teal-700)
        "#1e293b", // sidebar-accent (slate-800)
        "#334155", // sidebar-border (slate-700)
        "#ffffff", // primary-foreground
        "#e2e8f0", // secondary-foreground (slate-200)
        "#ffffff", // accent-foreground
        "#ffffff", // destructive-foreground
        "#94a3b8", // muted-foreground (slate-400)
        "#f8fafc", // card (slate-50)
        "#ffffff", // popover
      ];

      data.forEach((item, i) => {
        const color = COLORS[i % COLORS.length];
        const text = item.product;

        doc.setFillColor(color);
        doc.rect(legendX, legendY, boxSize, boxSize, "F");

        doc.setTextColor(0);
        doc.setFontSize(7); // smaller font for legend
        doc.text(text, legendX + boxSize + spacing, legendY + boxSize - 1);

        legendY += lineHeight;
      });

      document.body.removeChild(tempContainer);
    } catch (error) {
      console.warn("Chart capture failed:", error);
    }
  }

  // ===== FOOTER =====
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(239, 83, 80);
    doc.rect(0, doc.internal.pageSize.getHeight() - 20, 210, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(
      "+212 123 456 789     contact@smab.com     https://www.smab-co.com",
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 20,
      doc.internal.pageSize.getHeight() - 3
    );
  }

  doc.save(
    `${dataType}-${filterDate}-${new Date().toISOString().split("T")[0]}.pdf`
  );
};

// export const exportToPDF = (data, ordersDate) => {
//   const headers = [
//     "Order #",
//     "Client",
//     "Price",
//     "Sales Agent",
//     "Products Count",
//   ];
//   const textContent = [
//     `Orders Report - ${ordersDate}`,
//     `Generated on: ${new Date().toLocaleDateString()}`,
//     "",
//     headers.join("\t"),
//     ...data.map((row) =>
//       [
//         row.getValue("orderNumber"),
//         row.getValue("client"),
//         row.getValue("price"),
//         row.getValue("salesAgent"),
//         (row.getValue("products") || []).length,
//       ].join("\t")
//     ),
//   ].join("\n");

//   const blob = new Blob([textContent], { type: "text/plain" });
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `orders-${ordersDate}-${
//     new Date().toISOString().split("T")[0]
//   }.txt`;
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
//   window.URL.revokeObjectURL(url);
// };
