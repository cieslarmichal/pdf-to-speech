import { ElevenLabsClient } from 'elevenlabs';

import { TextToSpeechService } from './textToSpeechService.js';

export interface TextToSpeechServiceConfig {
  readonly apiKey: string;
}

export class TextToSpeechServiceFactory {
  public static create(config: TextToSpeechServiceConfig): TextToSpeechService {
    const elevenlabsClient = new ElevenLabsClient({
      apiKey: config.apiKey,
    });

    return new TextToSpeechService(elevenlabsClient);
  }
}
