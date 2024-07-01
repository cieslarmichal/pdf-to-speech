/* eslint-disable @typescript-eslint/naming-convention */

import PDFParser, { type Output } from 'pdf2json';

interface ParsePdfPayload {
  readonly pdfPath: string;
}

export class PdfParserService {
  public async parsePdf(payload: ParsePdfPayload): Promise<string> {
    const { pdfPath } = payload;

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

    return parsed
      .replace(/Column \d+/gi, '') // Column 1, Column 2, etc.
      .replace(/Row \d+/gi, '') // Row 1, Row 2, etc.
      .replace(/Table \d+/gi, '') // Table 1, Table 2, etc.
      .replace(/Tab. \d+/gi, '') // Tab. 1, Tab. 2, etc.
      .replace(/Figure \d+/gi, '') // Figure 1, Figure 2, etc.
      .replace(/Fig. \d+/gi, '') // Fig. 1, Fig. 2, etc.
      .replace(/Appendix \d+/gi, '') // Appendix 1, Appendix 2, etc.
      .replace(/App. \d+/gi, '') // App. 1, App. 2, etc.
      .replace(/Page\d+/g, '') // Page1, Page2, etc.
      .replace(/\[[^\]]*\]/g, '') // Remove text inside square brackets
      .replace(/\(\d+\)/g, '') // Remove numbers inside parentheses
      .replace(/\(\)/g, '') // Remove empty parentheses
      .replace(/https?:\/\/\S+|www\.\S+/gi, '') // Remove URLs
      .replace(/(\{[^\}]+\}@|[A-Za-z0-9._%+-]+@)[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/g, '') // Remove emails
      .replace(
        /(?:ISBN(?:-13)?:?\s*)?(?:97[89][-\s]?)?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?\d{1,3}/g,
        '',
      ) // Remove ISBNs
      .replace(/(\b\d+\b\s+)+/g, '') // Remove series of numbers
      .replace(/\b\d+([A-Za-z])/g, '$1') // Remove numbers followed by letters
      .replace(/[\*+](?=[\s,.])/g, '') // Remove words with special characters
      .replace(/ \. /g, '. ') // This line replaces "space dot space" with "dot space"
      .replace(/ \, /g, '. ') // This line replaces "space dot space" with "dot space"
      .replace(/\s+/g, ' ') // extra spaces
      .replaceAll('-.', '.')
      .replaceAll(',.', '.')
      .replaceAll(', .', '.')
      .replaceAll('.,', '.')
      .replaceAll('. ,', '.')
      .replaceAll('. .', '.')
      .replaceAll('- ', '-')
      .replaceAll(' -', '-')
      .replaceAll('...', '.')
      .replaceAll('..', '.')
      .trim();
  }

  private normalizeText(text: string): string {
    const decodedText = decodeURIComponent(text);

    const specialCharactersMapping = new Map<string, string>([
      ['Æ', 'AE'],
      ['æ', 'ae'],
      ['Œ', 'OE'],
      ['œ', 'oe'],
      ['ﬁ', 'fi'],
      ['ﬂ', 'fl'],
      ['©', ''],
      ['', ''],
      [' ', ''],
      ['•', ''],
      ['…', ''],
      ['&', 'and'],
      ['%', ' percent'],
      ['"', ''],
      ['“', ''],
      ['”', ''],
      ['’', ''],
      ['‘', ''],
      ['—', '-'],
      ['–', '-'],
      ['–', '-'],
      ['e.g.', 'for example'],
      ['i.e.', 'that is'],
      ['etc.', 'and so on'],
      ['vs.', 'versus'],
      ['vs', 'versus'],
      ['I.', '1.'],
      ['II.', '2.'],
      ['III.', '3.'],
      ['IV.', '4.'],
      ['V.', '5.'],
      ['VI.', '6.'],
      ['VII.', '7.'],
      ['VIII.', '8.'],
      ['IX.', '9.'],
      ['X.', '10.'],
      ['XI.', '11.'],
      ['XII.', '12.'],
      ['XIII.', '13.'],
      ['XIV.', '14.'],
      ['XV.', '15.'],
      ['pp.', 'pages'],
      ['p.', 'page'],
      ['fig.', 'figure'],
      ['vol.', 'volume'],
      ['ed.', 'edition'],
      ['no.', 'number'],
      ['dept.', 'department'],
      ['1st', 'first'],
      ['2nd', 'second'],
      ['3rd', 'third'],
      ['4th', 'fourth'],
      ['5th', 'fifth'],
    ]);

    const escapeRegExp = (input: string): string => input.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const specialCharactersRegex = new RegExp(
      Array.from(specialCharactersMapping.keys()).map(escapeRegExp).join('|'),
      'g',
    );

    return decodedText.replace(specialCharactersRegex, (character) => specialCharactersMapping.get(character) || '');
  }
}
