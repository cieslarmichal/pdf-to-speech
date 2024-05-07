import { type Logger } from '../../common/logger/logger.js';
import { type PdfParserService } from '../services/pdfParserService.js';

interface ExecutePayload {
  readonly pdfPath: string;
}

interface ExecuteResult {
  readonly audioPath: string;
}

export class ConvertPdfToAudioAction {
  public constructor(
    private readonly pdfParserService: PdfParserService,
    private readonly logger: Logger,
  ) {}

  public async execute(payload: ExecutePayload): Promise<ExecuteResult> {
    const { pdfPath } = payload;

    this.logger.debug({
      message: 'Converting pdf to audio...',
      pdfPath,
    });

    const parsedPdf = await this.pdfParserService.parsePdf({ pdfPath });

    console.log(parsedPdf);

    const audioPath = 'audio path';

    this.logger.debug({
      message: 'Pdf converted to audio.',
      pdfPath,
      audioPath,
    });

    return { audioPath };
  }
}
