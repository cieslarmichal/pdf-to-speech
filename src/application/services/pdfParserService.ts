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

        if (previousText.endsWith(' ') && text.y > previousY) {
          parsed = parsed.trimEnd();
        }

        if (text.y > previousY) {
          parsed += '\n';
        }

        previousY = text.y;

        parsed += text.R.map((text) => this.replaceEnglishLigatures(decodeURIComponent(text.T))).join('');

        previousText = decodeURIComponent(text.R[text.R.length - 1]?.T as string);
      }
    }

    return parsed;
  }

  private replaceEnglishLigatures(input: string): string {
    const ligatures = new Map<string, string>([
      ['Æ', 'AE'],
      ['æ', 'ae'],
      ['Œ', 'OE'],
      ['œ', 'oe'],
      ['ﬁ', 'fi'],
      ['ﬂ', 'fl'],
      // add more English ligatures if needed
    ]);

    const ligatureRegex = new RegExp(Array.from(ligatures.keys()).join('|'), 'g');

    return input.replace(ligatureRegex, (ligature) => ligatures.get(ligature) || '');
  }
}
