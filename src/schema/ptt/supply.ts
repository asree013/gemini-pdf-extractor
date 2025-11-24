import { z } from "zod";

// 1. schema
const invoiceSchema = z.object({
  invoice_number: z
    .string()
    .describe('The unique invoice number, e.g., "1631100234".'),
  quantity: z
    .number()
    .describe(
      "The total quantity in MMBTU for the invoiced item. Example: 14952366.000"
    ),
  amount_before_vat: z
    .number()
    .describe("The total amount in THB before VAT. Example: 2268499702.92"),
});

export const invoicesArraySchema = z
  .array(invoiceSchema)
  .describe("An array of extracted invoice details.");

export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoicesArray = z.infer<typeof invoicesArraySchema>;

// 2. system prompt

const systemPrompt = `
    You are an expert at extracting structured data from invoice documents. Your task is to accurately identify and extract specific details from the provided invoice text.

    **Instructions:**
    1.  **Extract all distinct invoices:** Go through the entire document and extract data for every individual invoice present.
    2.  **For each invoice, identify the following fields:**
        *   \`invoice_number\`: The invoice identification number (e.g., "1631100234").
        *   \`quantity\`: The total quantity for the primary item in \`MMBTU\`. Ensure this is parsed as a floating-point number.
        *   \`amount_before_vat\`: The total amount *before* VAT in \`THB\`. Ensure this is parsed as a floating-point number.
    3.  **Data Types:** Strictly adhere to the specified data types (string for invoice number, number for quantity and amount). Convert numeric values to floating-point numbers.
    4.  **No Summation:** Do *not* sum quantities or amounts across multiple invoices. Report the \`quantity\` and \`amount_before_vat\` for each invoice individually.
    5.  **Output Format:** Provide the extracted data as a JSON array, where each element in the array represents a single invoice object with the specified fields.
    6.  **Accuracy:** Prioritize accuracy in extracting the exact values as they appear in the document.

    **Example of desired output structure (if two invoices were found):**
    \`\`\`json
    [
      {
        "invoice_number": "invoice_number_1",
        "quantity": 1234567.89,
        "amount_before_vat": 987654321.01
      },
      {
        "invoice_number": "invoice_number_2",
        "quantity": 9876543.21,
        "amount_before_vat": 123456789.01
      }
    ]
     \`\`\`

    `;

export const pttSupplySchemaAndPrompt = {
  invoice: {
    schema: invoicesArraySchema,
    systemPrompt,
  },
};
