import { z } from "zod";

// 1. schema
export const invoiceSchema = z.object({
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

// Define the schema for the overall output, including the array of invoices and an overall confidence score
export const invoicesExtractionOutputSchema = z.object({
  invoices: z
    .array(invoiceSchema)
    .describe("An array of all extracted invoice details."),
  overall_confidence_score: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "An overall confidence score (0-100) indicating the AI's certainty about the accuracy and completeness of *all* extracted invoices in the array."
    ),
});

export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoicesExtractionOutput = z.infer<
  typeof invoicesExtractionOutputSchema
>;

// 2. system prompt

const invoiceExtractionSystemPrompt: string = `
You are an expert at extracting structured data from invoice documents. Your task is to accurately identify and extract specific details from the provided invoice text.

**Instructions:**
1.  **Extract all distinct invoices:** Go through the entire document and extract data for every individual invoice present.
2.  **For each individual invoice, identify the following fields:**
    *   \`invoice_number\`: The invoice identification number (e.g., "1631100234").
    *   \`quantity\`: The total quantity for the primary item in \`MMBTU\`. Ensure this is parsed as a floating-point number.
    *   \`amount_before_vat\`: The total amount *before* VAT in \`THB\`. Ensure this is parsed as a floating-point number.
3.  **Overall Confidence Score:** After extracting all invoices, generate a single \`overall_confidence_score\` (0-100) for the *entire* extraction. This score should reflect your certainty that *all* identified invoices have been correctly extracted with accurate values for their respective fields. A score of 100 means absolute certainty about the entire output, while 0 means no certainty.
4.  **Data Types:** Strictly adhere to the specified data types (string for invoice number, number for quantity and amount, number for confidence score). Convert numeric values to floating-point numbers.
5.  **No Summation:** Do *not* sum quantities or amounts across multiple invoices within the individual invoice objects.
6.  **Output Format:** Provide the extracted data as a single JSON object. This object should contain an \`invoices\` array (where each element is an invoice object with \`invoice_number\`, \`quantity\`, and \`amount_before_vat\`) and the \`overall_confidence_score\`.
7.  **Accuracy:** Prioritize accuracy in extracting the exact values as they appear in the document.

**Example of desired output structure (if two invoices were found):**
\`\`\`json
{
  "invoices": [
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
  ],
  "overall_confidence_score": 92
}
\`\`\`
`;

export const pttSupplySchemaAndPrompt = {
  invoice: {
    schema: invoicesExtractionOutputSchema,
    systemPrompt: invoiceExtractionSystemPrompt,
  },
};
