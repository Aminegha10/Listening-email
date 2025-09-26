import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../public/SmabLogo.jpg"; // adjust path if needed
import { logo64Base } from "./logo64Base";

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

export const exportToPDF = (data, filterDate, dataType, filterPieChart) => {
  if (data.length === 0) return;
  if (!filterDate) filterDate = "AllTime";

  const doc = new jsPDF();
  // truncated for readability
  // ====== HEADER BAR ======
  const headerHeight = 20;
  doc.setFillColor(239, 83, 80);
  doc.rect(0, 0, 210, headerHeight, "F");

  // ====== LOGO INSIDE NAV (left, vertically centered) ======
  const logoHeight = 12;
  const logoWidth = 24;
  const logoX = 10;
  const logoY = (headerHeight - logoHeight) / 2;
  doc.addImage(logo64Base, "JPEG", logoX, logoY, logoWidth, logoHeight);

  // ====== TITLE (vertically centered in header next to logo) ======
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  const titleY = headerHeight / 2 + 4; // approximate vertical centering
  doc.text(`${dataType} Report`, logoX + logoWidth + 12, titleY);

  // ====== DATE INFO ======
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(`Date Filter: ${filterDate}`, 10, headerHeight + 5);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, headerHeight + 5);

  // ====== DATA COUNT ======
  doc.setFontSize(8);
  doc.text(`Total ${dataType}: ${data.length}`, 10, headerHeight + 12);

  // ====== TABLE ======
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
      : data.map((row) => [row.product, row[filterPieChart]]);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: headerHeight + 18,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: [33, 33, 33],
    },
    headStyles: {
      fillColor: [239, 83, 80],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // ====== FOOTER ======
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // background rectangle footer
    doc.setFillColor(239, 83, 80);
    doc.rect(0, doc.internal.pageSize.getHeight() - 20, 210, 20, "F");

    // footer text (centered)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(
      "+212 123 456 789     contact@smab.com     https://www.smab-co.com",
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );

    // page number
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 20,
      doc.internal.pageSize.getHeight() - 3
    );
  }

  // ====== SAVE PDF ======
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
