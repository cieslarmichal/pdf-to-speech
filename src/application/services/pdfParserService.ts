/* eslint-disable @typescript-eslint/naming-convention */

import PDFParser, { type Output } from 'pdf2json';

interface ParsePdfPayload {
  readonly pdfPath: string;
}

export class PdfParserService {
  public async parsePdf(payload: ParsePdfPayload): Promise<string> {
    const { pdfPath } = payload;

    console.log({ pdfPath });

    const pdfParser = new PDFParser(this, true);

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
          text,
          y: text.y,
          t: decodeURIComponent(text.R[0]?.T as string),
        });

        console.log({ previousText });

        if (previousText.endsWith(' ') && text.y > previousY) {
          parsed = parsed.trimEnd();
        }

        if (text.y > previousY) {
          parsed += ' ';
        }

        previousY = text.y;

        const normalizedText = text.R.map((text) => this.normalizeText(text.T)).join('');

        parsed += normalizedText;

        previousText = decodeURIComponent(text.R[text.R.length - 1]?.T as string);
      }
    }

    return parsed.trim().replace(/\s+/g, ' ');
  }

  private normalizeText(text: string): string {
    const decodedText = decodeURIComponent(text);

    const columnRegex = /Column \d+/g;

    const rowRegex = /Row \d+/g;

    let textWithoutForbiddenWords = decodedText.replace(columnRegex, '').replace(rowRegex, '');

    // Check if the text contains only numbers (possibly with spaces)
    if (/^\s*\d+\s*$/.test(textWithoutForbiddenWords)) {
      textWithoutForbiddenWords = '';
    }

    return this.replaceSpecialCharacters(textWithoutForbiddenWords);
  }

  private replaceSpecialCharacters(text: string): string {
    const specialCharactersMapping = new Map<string, string>([
      ['Æ', 'AE'],
      ['æ', 'ae'],
      ['Œ', 'OE'],
      ['œ', 'oe'],
      ['ﬁ', 'fi'],
      ['ﬂ', 'fl'],
      ['', ''],
    ]);

    const specialCharactersRegex = new RegExp(Array.from(specialCharactersMapping.keys()).join('|'), 'g');

    return text.replace(specialCharactersRegex, (character) => specialCharactersMapping.get(character) || '');
  }
}
