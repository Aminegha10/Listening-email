
import pkg from "pdf-to-printer";
const { getPrinters } = pkg;
const listPrinters = async () => {
  try {
    const printers = await getPrinters();
    printers.forEach((printer) =>
        console.log("Available Printers: " + printer.name)
    );
    return printers;
  } catch (error) {
    console.log("Error fetching printers:", error.message);
    return [];
  }
};
await listPrinters();

