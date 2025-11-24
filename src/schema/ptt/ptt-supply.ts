import { z } from "zod";

// --- I. Zod Schema Generation ---

const YadanaSchema = z.object({
    overall_payment_due_usd: z.number().describe('OVERALL PAYMENT DUE BY PTT TO THE SELLERS (I+II) in USD.'),
    moge_quantity_mmbtu: z.number().describe("MOGE's quantity of gas in MMBTU."),
    pttepi_quantity_mmbtu: z.number().describe("PTTEPI's quantity of gas in MMBTU."),
});
const yadanaSystemPrompt = `You are an expert data extraction model specializing in financial reports based on the Export Gas Sale Agreement (EGSA). Your task is to extract the overall payment amount and the respective MMBTU quantities attributable to the two sellers (MOGE and PTTEPI).

1.  **Strictly adhere to the following Zod schema, which requires a single JSON object.**
2.  **Output ONLY the raw JSON object.** Do not include any extra text, markdown formatting (e.g., \`\`\`json), or explanations.

### Fields to Extract:
* **overall_payment_due_usd**: The grand total payment due from PTT to the Sellers (OVERALL PAYMENT DUE BY PTT TO THE SELLERS) in USD.
* **moge_quantity_mmbtu**: The quantity of gas (MMBTU) attributable to MOGE.
* **pttepi_quantity_mmbtu**: The quantity of gas (MMBTU) attributable to PTTEPI.

### Data Location and Instructions:
* **Source Location**: Locate the summary section near the end of the document, typically on the first page, specifically the total payment and the table titled "SPLIT BETWEEN THE SELLERS".
* **overall_payment_due_usd**: Find the value labeled "OVERALL PAYMENT DUE BY PTT TO THE SELLERS (I+II)" or the large standalone total amount designated "in USD".
* **moge_quantity_mmbtu**: In the table titled "SPLIT BETWEEN THE SELLERS", find the row for **MOGE** and extract the corresponding amount from the **Quantities MMBTU** column.
* **pttepi_quantity_mmbtu**: In the table titled "SPLIT BETWEEN THE SELLERS", find the row for **PTTEPI** and extract the corresponding amount from the **Quantities MMBTU** column.
* **Transformation**: All extracted values must be converted to a JavaScript number type (float/decimal), removing commas.

### Output Format:
Output a single JSON object structured as follows:

Example JSON structure:
{
  "overall_payment_due_usd": 51243920.25, // Extracted dynamically
  "moge_quantity_mmbtu": 3552567, // Extracted dynamically
  "pttepi_quantity_mmbtu": 1642899 // Extracted dynamically
}
`;
export type Yadana = z.infer<typeof YadanaSchema>;

export const pttSupplySchemaAndPrompt = {
    yadana: {
        schema: YadanaSchema,
        systemPrompt: yadanaSystemPrompt,
  },
};