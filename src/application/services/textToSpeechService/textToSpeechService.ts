/* eslint-disable @typescript-eslint/naming-convention */

import { type ElevenLabsClient } from 'elevenlabs';
import { type Readable } from 'node:stream';

export interface ConvertTextToSpeechPayload {
  readonly text: string;
}

export class TextToSpeechService {
  public constructor(private readonly elevenlabsClient: ElevenLabsClient) {}

  public async convertTextToSpeech(payload: ConvertTextToSpeechPayload): Promise<Readable> {
    const { text } = payload;

    const audioStream = await this.elevenlabsClient.generate({
      stream: true,
      voice: 'Bella',
      text,
      model_id: 'eleven_multilingual_v2',
    });

    return audioStream;
  }
}
