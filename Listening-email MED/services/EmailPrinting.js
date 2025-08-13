import puppeteer from "puppeteer";
import pkg from "pdf-to-printer";
import path from "path";
import logger from "../utils/Logger.js";
import { fileURLToPath } from "url";
import ejs from "ejs";

const { getPrinters, print } = pkg;
// Recreate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//
const listPrinters = async () => {
  try {
    const printers = await getPrinters();
    printers.forEach((printer) =>
      logger.info("Available Printers: " + printer.name)
    );
    return printers;
  } catch (error) {
    logger.error("Error fetching printers:", error.message);
    return [];
  }
};
//
const generatePdf = async (orderInfo) => {
  //   console.log(orderInfo);
  const { orderNumber, orderDate, salesAgent, products } = orderInfo;
  const formattedDate = orderDate.replace(/\//g, "-");
  const pdfFileName = `${orderNumber}_${formattedDate}.pdf`;
  const pdfPath = `./orders/${pdfFileName}`;

  // Ensure absolute path for PM2
  const absolutePdfPath = path.resolve(pdfPath);
  //   C:\Users\anasg\OneDrive\Bureau\projects\Watch_Emails\Listening-email MED\orders\1442_05-08-2025.pdf

  // // Read logo file and convert to base64
  // let logoBase64 = "";
  // try {
  //   const logoPath = path.join(__dirname, "public", "smab.png");
  //   const logoBuffer = await fs.readFile(logoPath);
  //   logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  // } catch (error) {
  //   logger.warn("Could not load logo image:", error.message);
  //   logoBase64 = "data:image/png;base64,";
  // }

  const templatePath = path.join(__dirname, "..", "views", "index.ejs");
  logger.info(`Using template: ${templatePath}`);

  const html = await ejs.renderFile(templatePath, {
    orderNumber,
    orderDate,
    products,
    // logoBase64,
  });

  logger.info(`Launching browser for PDF generation: ${pdfFileName}`);
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
      ],
      timeout: 60000, // 60 seconds
    });
    console.log(browser);
  } catch (err) {
    logger.error("Error launching browser:", err.message);
  }

  try {
    const page = await browser.newPage();

    // Set longer navigation timeout for PM2 environment
    page.setDefaultNavigationTimeout(60000);

    logger.info(`Setting HTML content for order #${orderNumber}`);
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    logger.info(
      `Generating PDF for order #${orderNumber} at path: ${absolutePdfPath}`
    );
    await page.pdf({
      path: absolutePdfPath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
      timeout: 60000,
    });

    logger.info("PDF generated successfully: " + pdfFileName);
    return absolutePdfPath;
  } catch (error) {
    logger.error(
      `Error generating PDF for order #${orderNumber}: ${error.message}`
    );
    logger.error(`Error stack: ${error.stack}`);
    return null;
  } finally {
    try {
      await browser.close();
      logger.info(`Browser closed after PDF generation for ${pdfFileName}`);
    } catch (closeError) {
      logger.warn(`Error closing browser: ${closeError.message}`);
    }
  }
};
export { listPrinters, generatePdf };
