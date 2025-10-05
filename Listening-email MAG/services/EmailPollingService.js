import { google } from "googleapis";
import logger from "../utils/Logger.js";
import { addOrder } from "../controllers/OrderController.js";
import { load } from "cheerio";

export default async function startPolling(oauth2Client) {
  // Parse email body
  const parseEmailBody = (html) => {
    const $ = load(html);
    // Extract text from the email body
    const infoText = $("body").text() || "";

    // Extract order info
    const orderNumberMatch = infoText.match(/رقم الطلب:\s*(\d+)/);
    const salesAgentMatch = infoText.match(/اسم ممثل المبيعات:\s*([^\n]+)/);

    const orderDateMatch = infoText.match(/تاريخ الطلب:\s*([0-9/]+)/);

    const orderNumber = orderNumberMatch ? orderNumberMatch[1].trim() : "";
    const salesAgent = salesAgentMatch ? salesAgentMatch[1].trim() : "";
    const orderDate = orderDateMatch ? orderDateMatch[1].trim() : "";
    console.log(orderDate);

    // Extract products
    const products = [];
    $("table tr").each((index, row) => {
      if (index === 0) return; // Skip header
      const cols = $(row).find("td");
      if (cols.length >= 4) {
        products.push({
          name: $(cols[0]).text().trim(),
          quantity: $(cols[1]).text().trim(),
          barcode: $(cols[2]).text().trim(),
          warehouse: $(cols[3]).text().trim(),
        });
      }
    });

    return { orderNumber, orderDate, salesAgent, products };
  };

  // Poll for the latest email
  async function pollLatestEmail() {
    try {
      const gmail = google.gmail({ version: "v1", auth: oauth2Client });

      const query =
        'is:unread subject:"إعداد الطلبية رقم" from:"preparateur magasin"';
      const messagesRes = await gmail.users.messages.list({
        userId: "me",
        q: query,
        maxResults: 5,
      });

      if (!messagesRes.data.messages?.length) {
        logger.info("No unread matching emails found.");
        return;
      }

      for (const message of messagesRes.data.messages) {
        const msg = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
          format: "full",
        });

        // Mark as read
        await gmail.users.messages.modify({
          userId: "me",
          id: message.id,
          requestBody: {
            removeLabelIds: ["UNREAD"],
          },
        });

        // Extract HTML body
        let body = null;
        if (msg.data.payload.parts) {
          const htmlPart = msg.data.payload.parts.find(
            (p) => p.mimeType === "text/html"
          );
          if (htmlPart?.body?.data) {
            body = Buffer.from(htmlPart.body.data, "base64").toString("utf-8");
          }
        }

        // Fallback to plain text
        if (!body && msg.data.payload.body?.data) {
          body = Buffer.from(msg.data.payload.body.data, "base64").toString(
            "utf-8"
          );
        }

        if (!body) {
          logger.warn(`Email ${message.id} has no parsable body.`);
          continue;
        }

        const parsedBody = parseEmailBody(body);
        logger.info("Email(s) processed.");
        await addOrder(parsedBody.products, parsedBody);
      }
    } catch (error) {
      logger.error(`Polling error: ${error.message}`);
    }
  }

  setInterval(pollLatestEmail, 5000); // Every 5s
}
