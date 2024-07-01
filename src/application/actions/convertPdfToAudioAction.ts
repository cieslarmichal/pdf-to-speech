import { type Readable } from 'node:stream';

import { type Logger } from '../../common/logger/logger.js';
import { type PdfParserService } from '../services/pdfService/pdfParserService.js';
import { type TextToSpeechService } from '../services/textToSpeechService/textToSpeechService.js';

interface ExecutePayload {
  readonly pdfPath: string;
}

interface ExecuteResult {
  readonly audio: Readable;
}

export class ConvertPdfToAudioAction {
  public constructor(
    private readonly pdfParserService: PdfParserService,
    private readonly textToSpeechService: TextToSpeechService,
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

    const audio = await this.textToSpeechService.convertTextToSpeech({ text: parsedPdf });

    this.logger.debug({
      message: 'Pdf converted to audio.',
      pdfPath,
    });

    return { audio };
  }
}
