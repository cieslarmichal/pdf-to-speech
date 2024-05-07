import path from 'node:path';
import { expect, it, describe, beforeEach } from 'vitest';

import { PdfParserService } from './pdfParserService.js';

describe('PdfParserService', () => {
  let pdfParserService: PdfParserService;

  beforeEach(() => {
    pdfParserService = new PdfParserService();
  });

  const resourcesDirectory = path.resolve(__dirname, '../../../resources');

  const examplePdfPath = path.join(resourcesDirectory, 'example1.pdf');

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
