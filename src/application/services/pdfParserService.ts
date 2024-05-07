/* eslint-disable @typescript-eslint/no-var-requires */
import { readFileSync } from 'node:fs';

const pdf = require('pdf-parse');

interface ParsePdfPayload {
  readonly pdfPath: string;
}

export class PdfParserService {
  public async parsePdf(payload: ParsePdfPayload): Promise<string> {
    const { pdfPath } = payload;

    console.log({ pdfPath });

    const dataBuffer = readFileSync(pdfPath);

    const extractedData = await pdf(dataBuffer);

    console.log(extractedData.text);

    // extractedData.text.forEach((page) => {
    //   page.content.forEach((content) => {
    //     console.log({
    //       x: content.x,
    //       y: content.y,
    //       str: content.str,
    //     });
    //   });
    // });

    return 'parsed pdf';
  }
}
