import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToCSV = (data, ordersDate) => {
  if (data.length == 0) return;

  const headers = [
    "Order #",
    "Client",
    "Price",
    "Sales Agent",
    "Products Count",
  ];
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      [
        row.getValue("orderNumber"),
        row.getValue("client"),
        row.getValue("price"),
        row.getValue("salesAgent"),
        (row.getValue("products") || []).length,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders-${ordersDate}-${
    new Date().toISOString().split("T")[0]
  }.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const exportToJSON = (data, ordersDate) => {
  if (data.length == 0) return;

  const exportData = data.map((row) => ({
    orderNumber: row.getValue("orderNumber"),
    client: row.getValue("client"),
    price: row.getValue("price"),
    salesAgent: row.getValue("salesAgent"),
    products: row.getValue("products"),
  }));

  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders-${ordersDate}-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const exportToPDF = (data, filterDate, dataType) => {
  if (data.length == 0) return;
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
      : ["Product Name", "Quantity Sold", "Revenue", "Orders Count", "Last Order Date"];

  // Prepare table rows
  const rows =
    dataType == "Orders"
      ? data.map((row) => [
          row.getValue("orderNumber"),
          row.getValue("client"),
          row.getValue("price"),
          row.getValue("salesAgent"),
          (row.getValue("products") || []).length,
        ])
      : data.map((row) => [
          row.getValue("productName"),
          row.getValue("quantitySold"),
          row.getValue("revenue") || "N/A",
          row.getValue("ordersCount"),
          row.getValue("lastOrderedDate"),
        ]);

  // Generate table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 36, // start below the title
  });

  // Save PDF
  doc.save(`${dataType}-${filterDate}-${new Date().toISOString().split("T")[0]}.pdf`);
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
