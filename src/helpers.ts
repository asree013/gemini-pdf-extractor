import { readFile, stat } from "node:fs/promises";
import { t } from "elysia";

export const readFileAndSize = async (filePath: string) => {
  const pdfPath = filePath;
  const file = await readFile(pdfPath);
  const stats = await stat(pdfPath);
  const sizeInMb = stats.size / (1024 * 1024);
  console.log({ sizeInMb });
  console.log(process.env);

  return {
    file,
    sizeInMb,
  };
};

export const elysiaPdf = t.File({ format: "application/pdf" });
