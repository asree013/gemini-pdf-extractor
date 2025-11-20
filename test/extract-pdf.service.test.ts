/** biome-ignore-all lint/nursery/noShadow: <explanation> */
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ExtractPDFService } from "../src/extract-pdf.service";
import { Runtime } from "../src/runtime";
import { InvoiceSchema } from "../src/schema/invoice";

describe("extract invoice", () => {
  it("should extract invoice data", async () => {
    const pdfPath = path.join(__dirname, "Invoice_EGAT.pdf");
    const file = await readFile(pdfPath);
    const stats = await stat(pdfPath);
    const sizeInMb = stats.size / (1024 * 1024);
    console.log({ sizeInMb });
    console.log(process.env);

    const program = Effect.all({
      svc: ExtractPDFService,
    }).pipe(
      Effect.andThen(({ svc }) => svc.processInline(file, InvoiceSchema)),
      Effect.tap((data) => Effect.log("data", data)),
      Effect.tapError((error) => Effect.logError("error -->", error.error))
    );

    const { object } = await Runtime.runPromise(program);

    // quantity: 4964035,
    //      unitPriceTHBPerMMBTU: 433.7759,
    //      subtotalTHB: 2153278749.76,
    //      vatTHB: 150729512.48,
    //      totalTHB: 2304008262.24,
    //      currency: 'THB',
    //      vatRate: 0.07
    expect(object.quantity).eq(4_964_035);
    expect(object.unitPriceTHBPerMMBTU).eq(433.7759);
    expect(object.subtotalTHB).eq(2_153_278_749.76);
    expect(object.vatTHB).eq(150_729_512.48);
    expect(object.totalTHB).eq(2_304_008_262.24);
    expect(object.currency).eq("THB");
    expect(object.vatRate).eq(0.07);
  });
});
