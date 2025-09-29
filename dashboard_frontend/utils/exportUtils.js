import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export const exportToCSV = (data, filterDate, dataType, _, __, filter) => {
  console.log(data);
  if (!data?.length) return;

  let headers = [];
  let rows = [];
  if (dataType === "Clients") {
    headers = [
      "Client Name",
      "First Order Date",
      "___",
      "Orders Count",
      "Products Ordered",
      "Revenue (DH)",
    ];

    rows = data.map((row) => [
      row.getValue?.("clientName"),
      row.getValue?.("firstOrderDate"),
      row.getValue?.("ordersCount") || "N/A",
      row.getValue?.("productsQuantity") || "N/A",
      row.getValue?.("revenue") || "N/A",
    ]);
  } else if (dataType === "Products") {
    headers = [
      "Product Name",
      "Quantity Sold",
      "Revenue (DH)",
      "Orders Count",
      "Last Order Date",
    ];
    rows = data.map((row) => [
      row.original?.productName || row.productName || "N/A",
      row.original?.quantitySold || row.quantitySold || "0",
      row.original?.revenue || row.revenue || "0",
      row.original?.ordersCount || row.ordersCount || "0",
      row.original?.lastOrderedDate || row.lastOrderedDate || "N/A",
    ]);
  } else if (dataType === "Orders") {
    headers = ["Order #", "Client", "Price", "Sales Agent", "Products Count"];
    rows = data.map((row) => [
      row.getValue?.("orderNumber") || row.orderNumber || "N/A",
      row.getValue?.("client") || row.client || "N/A",
      row.getValue?.("price") || row.price || "N/A",
      row.getValue?.("salesAgent") || row.salesAgent || "N/A",
      (row.getValue?.("products") || row.products || []).length,
    ]);
  } else if (dataType === "TopClients") {
    headers = ["Client Name", "First Order Date", "__"];
    if (filter === "revenue") {
      headers.push("Revenue (DH)");
      rows = data.map((client) => [
        client.clientName || "N/A",
        client.firstOrderDate || "N/A",
        client.revenue ?? "N/A",
      ]);
    } else if (filter === "ordersCount") {
      headers.push("Orders Count");
      rows = data.map((client) => [
        client.clientName || "N/A",
        client.firstOrderDate || "N/A",
        client.ordersCount ?? "N/A",
      ]);
    } else if (filter === "productsQuantity") {
      headers.push("Products Quantity");
      rows = data.map((client) => [
        client.clientName || "N/A",
        client.firstOrderDate || "N/A",
        client.productsQuantity ?? "N/A",
      ]);
    }
  } else {
    if (filter === "revenue") {
      headers = ["Product Name", "Revenue (DH)"];
      rows = data.map((row) => [
        row.getValue?.("product") || row.product || "N/A",
        row.getValue?.("revenue") || row.revenue || "N/A",
      ]);
    } else if (filter === "unitsSold") {
      headers = ["Product Name", "Quantity Sold"];
      rows = data.map((row) => [
        row.getValue?.("product") || row.product || "N/A",
        row.getValue?.("unitsSold") || row.unitsSold || "N/A",
      ]);
    } else if (filter === "ordersCount") {
      headers = ["Product Name", "Orders Count"];
      rows = data.map((row) => [
        row.getValue?.("product") || row.product || "N/A",
        row.getValue?.("ordersCount") || row.ordersCount || "N/A",
      ]);
    }
  }

  // Convert to CSV
  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  );

  // Create downloadable file
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${dataType}-${filter}-${filterDate || "all"}-${
    new Date().toISOString().split("T")[0]
  }.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// json export
export const exportToJSON = (data, filterDate, dataType, _, __, filter) => {
  if (!data?.length) return;

  let exportData = [];

  if (dataType === "Orders") {
    exportData = data.map((row) => ({
      orderNumber: row.getValue?.("orderNumber") || row.orderNumber || "N/A",
      client: row.getValue?.("client") || row.client || "N/A",
      price: row.getValue?.("price") || row.price || "N/A",
      salesAgent: row.getValue?.("salesAgent") || row.salesAgent || "N/A",
      products: row.getValue?.("products") || row.products || [],
    }));
  } else if (dataType === "TopClients") {
    if (filter === "revenue") {
      exportData = data.map((client) => ({
        clientName: client.clientName || "N/A",
        firstOrderDate: client.firstOrderDate || "N/A",
        revenue: client.revenue ?? "N/A",
      }));
    } else if (filter === "ordersCount") {
      exportData = data.map((client) => ({
        clientName: client.clientName || "N/A",
        firstOrderDate: client.firstOrderDate || "N/A",
        ordersCount: client.ordersCount ?? "N/A",
      }));
    } else if (filter === "productsQuantity") {
      exportData = data.map((client) => ({
        clientName: client.clientName || "N/A",
        firstOrderDate: client.firstOrderDate || "N/A",
        productsQuantity: client.productsQuantity ?? "N/A",
      }));
    }
  } else if (dataType === "Clients") {
    // NEW: Separate Clients JSON export
    exportData = data.map((row) => ({
      orderNumber: row.getValue?.("clientName") || row.clientName || "N/A",
      client: row.getValue?.("firstOrderDate") || row.firstOrderDate || "N/A",
      ordersCount: row.getValue?.("ordersCount") || row.ordersCount || "N/A",
      productsQuantity:
        row.getValue?.("productsQuantity") || row.productsQuantity,
      revenue: row.getValue?.("revenue") || row.revenue || "N/A",
    }));
  } else if (dataType === "Products") {
    exportData = data.map((product) => ({
      productName:
        product.getValue?.("productName") || product.productName || "N/A",
      quantitySold:
        product.getValue?.("quantitySold") || product.quantitySold || 0,
      revenue: product.getValue?.("revenue") || product.revenue || 0,
      ordersCount:
        product.getValue?.("ordersCount") || product.ordersCount || 0,
      lastOrderedDate:
        product.getValue?.("lastOrderedDate") ||
        product.lastOrderedDate ||
        "N/A",
    }));
  } else {
    // Top Products
    if (filter === "revenue") {
      exportData = data.map((row) => ({
        productName: row.getValue?.("product") || row.product || "N/A",
        revenue: row.getValue?.("revenue") || row.revenue || "N/A",
      }));
    } else if (filter === "unitsSold") {
      exportData = data.map((row) => ({
        productName: row.getValue?.("product") || row.product || "N/A",
        quantitySold: row.getValue?.("unitsSold") || row.unitsSold || "N/A",
      }));
    } else if (filter === "ordersCount") {
      exportData = data.map((row) => ({
        productName: row.getValue?.("product") || row.product || "N/A",
        ordersCount: row.getValue?.("ordersCount") || row.ordersCount || "N/A",
      }));
    }
  }

  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${dataType}-${filter}-${filterDate || "all"}-${
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
  filter
) => {
  console.log(filter);
  if (!data || data.length === 0) return;
  if (!filterDate) filterDate = "AllTime";
  if (filterDate == "currentYear") filterDate = "Current Year";
  if (filterDate == "thisMonth") filterDate = "current Month";
  if (filterDate == "thisWeek") filterDate = "current Week";

  console.log(filter);
  console.log(data);
  const doc = new jsPDF();

  // ===== HEADER =====
  const headerHeight = 20;

  // Background
  doc.setFillColor(239, 83, 80); // red
  doc.rect(0, 0, 210, headerHeight, "F");

  // Logo on the LEFT
  const logoHeight = 28;
  const logoWidth = 45; // 2 × height = width
  const logoX = 10; // left margin
  const logoY = (headerHeight - logoHeight) / 2;
  const logo64Base =
    "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAARwWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgeG1sbnM6eG1wRE09Imh0dHA6Ly9ucy5hZG9iZS5jb20veG1wLzEuMC9EeW5hbWljTWVkaWEvIgogICAgeG1sbnM6c3REaW09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9EaW1lbnNpb25zIyIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMkI5RDhGOEM4Q0ZFRDExQUNDMjg1NUREMTBEQTI5MiIKICAgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyNzIxNDc3QzU1QkVFRDExOTU3N0JBQzA0ODlFNzUxQyIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjI3MjE0NzdDNTVCRUVEMTE5NTc3QkFDMDQ4OUU3NTFDIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTAzLTMxVDEzOjM2OjAyWiIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDMtMzFUMTM6MzY6MDJaIgogICB4bXBETTp2aWRlb1BpeGVsQXNwZWN0UmF0aW89IjEwMDAwMDAvMTAwMDAwMCIKICAgeG1wRE06dmlkZW9BbHBoYU1vZGU9InN0cmFpZ2h0IgogICB4bXBETTp2aWRlb0ZyYW1lUmF0ZT0iMC4wMDAwMDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyODIxNDc3QzU1QkVFRDExOTU3N0JBQzA0ODlFNzUxQyIKICAgICAgc3RFdnQ6d2hlbj0iMjAyMy0wMy0wOVQwOTo0NDozNCswMTowMCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUHJlbWllcmUgUHJvIENTNiAoV2luZG93cykiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjkyMTQ3N0M1NUJFRUQxMTk1NzdCQUMwNDg5RTc1MUMiCiAgICAgIHN0RXZ0OndoZW49IjIwMjMtMDMtMDlUMDk6NDQ6MzUrMDE6MDAiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFByZW1pZXJlIFBybyBDUzYgKFdpbmRvd3MpIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvbWV0YWRhdGEiLz4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ibW9kaWZpZWQiCiAgICAgIHN0RXZ0OnBhcmFtZXRlcnM9InVua25vd24gbW9kaWZpY2F0aW9ucyIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2QjJFQzQ2NjcwQkVFRDExOEU5Qzg5MkJGNjZGNzg0RSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyMy0wMy0wOVQxMjo0OTowOSswMTowMCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUHJlbWllcmUgUHJvIENTNiAoV2luZG93cykiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NkUyRUM0NjY3MEJFRUQxMThFOUM4OTJCRjY2Rjc4NEUiCiAgICAgIHN0RXZ0OndoZW49IjIwMjMtMDMtMDlUMTI6NDk6MDkrMDE6MDAiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFByZW1pZXJlIFBybyBDUzYgKFdpbmRvd3MpIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvbWV0YWRhdGEiLz4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ibW9kaWZpZWQiCiAgICAgIHN0RXZ0OnBhcmFtZXRlcnM9InVua25vd24gbW9kaWZpY2F0aW9ucyIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3ODJBMzg3NjdCQkVFRDExQjAyQzgzMzUzQ0EwNjg3MCIKICAgICAgc3RFdnQ6d2hlbj0iMjAyMy0wMy0wOVQxNDowODoxOSswMTowMCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUHJlbWllcmUgUHJvIENTNiAoV2luZG93cykiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6N0IyQTM4NzY3QkJFRUQxMUIwMkM4MzM1M0NBMDY4NzAiCiAgICAgIHN0RXZ0OndoZW49IjIwMjMtMDMtMDlUMTQ6MDg6MjArMDE6MDAiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFByZW1pZXJlIFBybyBDUzYgKFdpbmRvd3MpIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvbWV0YWRhdGEiLz4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ibW9kaWZpZWQiCiAgICAgIHN0RXZ0OnBhcmFtZXRlcnM9InVua25vd24gbW9kaWZpY2F0aW9ucyIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpBMjhDMzQzMTRDQkZFRDExODQ1REE4MjMzNDc0NDYzRiIKICAgICAgc3RFdnQ6d2hlbj0iMjAyMy0wMy0xMFQxNTowMzowNyswMTowMCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUHJlbWllcmUgUHJvIENTNiAoV2luZG93cykiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6QTM4QzM0MzE0Q0JGRUQxMTg0NURBODIzMzQ3NDQ2M0YiCiAgICAgIHN0RXZ0OndoZW49IjIwMjMtMDMtMTBUMTU6MDM6MDgrMDE6MDAiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFByZW1pZXJlIFBybyBDUzYgKFdpbmRvd3MpIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvbWV0YWRhdGEiLz4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ibW9kaWZpZWQiCiAgICAgIHN0RXZ0OnBhcmFtZXRlcnM9InVua25vd24gbW9kaWZpY2F0aW9ucyIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3RTMxRDgzMzdBQzFFRDExODgwQ0UxRDgzNkQxMkJGNCIKICAgICAgc3RFdnQ6d2hlbj0iMjAyMy0wMy0xM1QwOTozNjo1MiswMTowMCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUHJlbWllcmUgUHJvIENTNiAoV2luZG93cykiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6REVDQzc3MzQ3QUMxRUQxMTg4MENFMUQ4MzZEMTJCRjQiCiAgICAgIHN0RXZ0OndoZW49IjIwMjMtMDMtMTNUMDk6MzY6NTMrMDE6MDAiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFByZW1pZXJlIFBybyBDUzYgKFdpbmRvd3MpIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvbWV0YWRhdGEiLz4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ibW9kaWZpZWQiCiAgICAgIHN0RXZ0OnBhcmFtZXRlcnM9InVua25vd24gbW9kaWZpY2F0aW9ucyIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowMUI5RDhGOEM4Q0ZFRDExQUNDMjg1NUREMTBEQTI5MiIKICAgICAgc3RFdnQ6d2hlbj0iMjAyMy0wMy0zMVQxMzozNjowMloiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFByZW1pZXJlIFBybyBDUzYgKFdpbmRvd3MpIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIi8+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjAyQjlEOEY4QzhDRkVEMTFBQ0MyODU1REQxMERBMjkyIgogICAgICBzdEV2dDp3aGVuPSIyMDIzLTAzLTMxVDEzOjM2OjAyWiIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUHJlbWllcmUgUHJvIENTNiAoV2luZG93cykiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii9tZXRhZGF0YSIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgIDx4bXBETTp2aWRlb0ZyYW1lU2l6ZQogICAgc3REaW06dz0iNTAwIgogICAgc3REaW06aD0iNTAwIgogICAg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";
  doc.addImage(logo64Base, "PNG", logoX, logoY, logoWidth, logoHeight);

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
          filter === "revenue"
            ? "Revenue DH"
            : filter === "ordersCount"
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
      ? data.map((row) => [row.clientName, row[filter]])
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
      "+212 766 074 939    contact@smab.com     https://www.smab-co.com",
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
    `${dataType}-${filter}-${filterDate}-${
      new Date().toISOString().split("T")[0]
    }.pdf`
  );
};
