/* eslint-disable @typescript-eslint/naming-convention */

import PDFParser, { type Output } from 'pdf2json';

interface ParsePdfPayload {
  readonly pdfPath: string;
}

export class PdfParserService {
  public async parsePdf(payload: ParsePdfPayload): Promise<string> {
    const { pdfPath } = payload;

    console.log({ pdfPath });

    const pdfParser = new PDFParser(this, 1);

    await pdfParser.loadPDF(pdfPath);

    const output = await new Promise<Output>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        console.error(errData.parserError);

        reject(errData.parserError);
      });

      pdfParser.on('pdfParser_dataReady', (data) => {
        resolve(data);
      });
    });

    let parsed = '';

    for (const page of output.Pages) {
      let previousY = 0;

      let previousText = '';

      for (const text of page.Texts) {
        console.log({
          y: text.y,
          t: decodeURIComponent(text.R[0]?.T as string),
        });

        console.log({ previousText });

        if (previousText.endsWith('. ') && text.y > previousY) {
          parsed = parsed.slice(0, -1);
        }

        if (text.y > previousY) {
          parsed += '\n';
        }

        previousY = text.y;

        parsed += text.R.map((text) => decodeURIComponent(text.T)).join('');

        previousText = decodeURIComponent(text.R[text.R.length - 1]?.T as string);
      }
    }

    return parsed;
  }
}
