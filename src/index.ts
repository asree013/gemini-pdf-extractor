import openapi from "@elysiajs/openapi";
import { Effect } from "effect";
import Elysia, { t } from "elysia";
import { ExtractPDFService } from "./extract-pdf.service";
import { Runtime } from "./runtime";
import { InvoiceSchema } from "./schema/invoice";

const app = new Elysia();

app
  .use(
    openapi({
      path: "/docs",
    })
  )
  .get("/health", () => "Ok")
  .post(
    "/invoice",
    async ({ body }) => {
      console.log({ file: body.file });

      const arrBuf = await body.file.arrayBuffer();
      const fileBuffer = Buffer.from(arrBuf);

      const program = Effect.all({
        svc: ExtractPDFService,
      }).pipe(
        Effect.andThen(({ svc }) =>
          svc.processInline(fileBuffer, InvoiceSchema)
        ),
        Effect.catchTag("ExtractPDF/Process/Error", (error) =>
          Effect.succeed(
            Response.json(
              {
                message: error.message,
                error: error.error,
                status: "500",
              },
              {
                status: 500,
              }
            )
          )
        )
      );

      const result = await Runtime.runPromise(program);
      console.log({ result });
      return result;
    },
    {
      body: t.Object(
        {
          file: t.File({ format: "application/pdf" }),
        },
        {
          description: "Upload an invoice",
        }
      ),
      tags: ["Invoice"],
    }
  );

app.listen(3000);
console.log("server start at port:", 3000);
