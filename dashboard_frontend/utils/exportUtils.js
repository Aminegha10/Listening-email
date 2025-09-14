import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

// pdf export
export const exportToPDF = (data, filterDate, dataType, filterPieChart) => {
  if (data.length == 0) return;
  if (filterDate == null) filterDate = "AllTime";
  console.log(data);
  const doc = new jsPDF();
  // Title and date
  doc.setFontSize(18);
  doc.text(`${dataType} Report - ${filterDate}`, 14, 20);
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
  doc.setFontSize(8);
  doc.text(`Number of ${dataType}: ${data.length}`, 14, 34);

  // Prepare table headers
  const headers =
    dataType == "Orders"
      ? ["Order #", "Client", "Price", "Sales Agent", "Products Count"]
      : dataType == "Products"
      ? [
          "Product Name",
          "Quantity Sold",
          "Revenue",
          "Orders Count",
          "Last Order Date",
        ]
      : ["product", filterPieChart];

  // Prepare table rows
  console.log(filterPieChart);
  const rows =
    dataType == "Orders"
      ? data.map((row) => [
          row.getValue("orderNumber"),
          row.getValue("client"),
          row.getValue("price"),
          row.getValue("salesAgent"),
          (row.getValue("products") || []).length,
        ])
      : // for productsDetails table
      dataType == "Products"
      ? data.map((row) => [
          row.getValue("productName"),
          row.getValue("quantitySold"),
          row.getValue("revenue") || "N/A",
          row.getValue("ordersCount"),
          row.getValue("lastOrderedDate"),
        ])
      : // for TopSellingProducts pie chart
        data.map((row) => [row.product, row[filterPieChart]]);

  // Generate table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 36, // start below the title
  });

  // Save PDF
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
