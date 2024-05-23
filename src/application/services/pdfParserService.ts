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

    const result = await new Promise<Output>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        console.error(errData.parserError);

        reject(errData.parserError);
      });

      pdfParser.on('pdfParser_dataReady', (data) => {
        resolve(data);
      });
    });

    console.log(result.Pages[0]?.Texts[1]);

    console.log(result.Pages[0]?.Texts[2]);

    console.log(result.Pages[0]?.Texts[3]);

    return 'parsed pdf';
  }
}
