import path from 'node:path';
import { expect, it, describe } from 'vitest';

import { PdfParserService } from './pdfParserService.js';

const expectedOnePagePdfText = `
Sample PDF
This is a simple PDF file. Fun fun fun.
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus facilisis odio sed mi.
Curabitur suscipit. Nullam vel nisi. Etiam semper ipsum ut lectus. Proin aliquam, erat eget
pharetra commodo, eros mi condimentum quam, sed commodo justo quam ut velit.
Integer a erat. Cras laoreet ligula cursus enim. Aenean scelerisque velit et tellus.
Vestibulum dictum aliquet sem. Nulla facilisi. Vestibulum accumsan ante vitae elit. Nulla
erat dolor, blandit in, rutrum quis, semper pulvinar, enim. Nullam varius congue risus.
Vivamus sollicitudin, metus ut interdum eleifend, nisi tellus pellentesque elit, tristique
accumsan eros quam et risus. Suspendisse libero odio, mattis sit amet, aliquet eget,
hendrerit vel, nulla. Sed vitae augue. Aliquam erat volutpat. Aliquam feugiat vulputate nisl.
Suspendisse quis nulla pretium ante pretium mollis. Proin velit ligula, sagittis at, egestas a,
pulvinar quis, nisl.
Pellentesque sit amet lectus. Praesent pulvinar, nunc quis iaculis sagittis, justo quam
lobortis tortor, sed vestibulum dui metus venenatis est. Nunc cursus ligula. Nulla facilisi.
Phasellus ullamcorper consectetuer ante. Duis tincidunt, urna id condimentum luctus, nibh
ante vulputate sapien, id sagittis massa orci ut enim. Pellentesque vestibulum convallis
sem. Nulla consequat quam ut nisl. Nullam est. Curabitur tincidunt dapibus lorem. Proin
velit turpis, scelerisque sit amet, iaculis nec, rhoncus ac, ipsum. Phasellus lorem arcu,
feugiat eu, gravida eu, consequat molestie, ipsum. Nullam vel est ut ipsum volutpat
feugiat. Aenean pellentesque.
In mauris. Pellentesque dui nisi, iaculis eu, rhoncus in, venenatis ac, ante. Ut odio justo,
scelerisque vel, facilisis non, commodo a, pede. Cras nec massa sit amet tortor volutpat
varius. Donec lacinia, neque a luctus aliquet, pede massa imperdiet ante, at varius lorem
pede sed sapien. Fusce erat nibh, aliquet in, eleifend eget, commodo eget, erat. Fusce
consectetuer. Cras risus tortor, porttitor nec, tristique sed, convallis semper, eros. Fusce
vulputate ipsum a mauris. Phasellus mollis. Curabitur sed urna. Aliquam nec sapien non
nibh pulvinar convallis. Vivamus facilisis augue quis quam. Proin cursus aliquet metus.
Suspendisse lacinia. Nulla at tellus ac turpis eleifend scelerisque. Maecenas a pede vitae
enim commodo interdum. Donec odio. Sed sollicitudin dui vitae justo.
Morbi elit nunc, facilisis a, mollis a, molestie at, lectus. Suspendisse eget mauris eu tellus
molestie cursus. Duis ut magna at justo dignissim condimentum. Cum sociis natoque
penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus varius. Ut sit
amet diam suscipit mauris ornare aliquam. Sed varius. Duis arcu. Etiam tristique massa
eget dui. Phasellus congue. Aenean est erat, tincidunt eget, venenatis quis, commodo at,
quam.`;

const expectedMultiPagePdfText = ``;

describe('PdfParserService', () => {
  const pdfParserService: PdfParserService = new PdfParserService();

  const resourcesDirectory = path.resolve(__dirname, '../../../resources');

  const onePagePdfPath = path.join(resourcesDirectory, 'one-page.pdf');

  const multiPagePdfPath = path.join(resourcesDirectory, 'multi-page.pdf');

  it('parses one page file', async () => {
    const result = await pdfParserService.parsePdf({ pdfPath: onePagePdfPath });

    expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedOnePagePdfText));
  });

  it('parses multi page file', async () => {
    const result = await pdfParserService.parsePdf({ pdfPath: multiPagePdfPath });

    expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedMultiPagePdfText));
  });
});
