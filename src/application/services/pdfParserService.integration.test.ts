import path from 'node:path';
import { expect, it, describe } from 'vitest';

import { type PdfParserService } from './pdfParserService.js';

describe('PdfParserService', () => {
  let pdfParserService: PdfParserService;

  const resourcesDirectory = path.resolve(__dirname, '../../../resources');

  const examplePdfPath = path.join(resourcesDirectory, 'example.pdf');

  it('parses a pdf file', async () => {
    const result = await pdfParserService.parsePdf({ pdfPath: examplePdfPath });

    expect(result).toEqual('parsed pdf');
  });

  // it('throws an error when a Subscription does not exist', async () => {
  //   const id = faker.string.uuid();

  //   try {
  //     await pdfParserService.execute({ id });
  //   } catch (error) {
  //     expect(error).toBeDefined();

  //     return;
  //   }

  //   expect.fail();
  // });
});
