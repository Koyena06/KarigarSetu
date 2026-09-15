import { Directory, File, Paths } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { config, providers } from '@/config';
import { createInteraction, outputImage } from './gemini';

const MAX_EDGE = 1600;

function photosDir(): Directory {
  const dir = new Directory(Paths.document, 'photos');
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
  return dir;
}

const newPhotoFile = (extension = 'jpg') => new File(photosDir(), `photo-${Date.now()}.${extension}`);

/**
 * Normalises a captured/picked photo (orientation, size, JPEG) and copies it
 * into app storage so products keep their image after the picker cache is cleared.
 */
export async function preparePhoto(uri: string): Promise<string> {
  const context = ImageManipulator.manipulate(uri);
  const probe = await context.renderAsync();
  const longest = Math.max(probe.width, probe.height);
  if (longest > MAX_EDGE) {
    context.resize(probe.width >= probe.height ? { width: MAX_EDGE } : { height: MAX_EDGE });
  }
  const rendered = await context.renderAsync();
  const saved = await rendered.saveAsync({ compress: 0.86, format: SaveFormat.JPEG });

  const destination = newPhotoFile();
  new File(saved.uri).copy(destination);
  return destination.uri;
}

/** Replaces the background with white via remove.bg. Returns the new local file URI. */
export async function removeBackground(uri: string): Promise<string> {
  if (!config.removeBgApiKey) throw new Error('Background removal is not configured.');

  const form = new FormData();
  // React Native's FormData accepts { uri, name, type } file descriptors.
  form.append('image_file', { uri, name: 'product.jpg', type: 'image/jpeg' } as unknown as Blob);
  form.append('size', 'auto');
  form.append('bg_color', 'ffffff');
  form.append('format', 'jpg');

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': config.removeBgApiKey },
    body: form,
  });
  if (!response.ok) {
    throw new Error(`remove.bg failed (${response.status})`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  const destination = newPhotoFile();
  destination.write(bytes);
  return destination.uri;
}

/** JPEG as base64 for sending to a vision/image model. */
export async function photoToBase64(uri: string, width = 1024): Promise<string> {
  const context = ImageManipulator.manipulate(uri);
  context.resize({ width });
  const rendered = await context.renderAsync();
  const saved = await rendered.saveAsync({ compress: 0.8, format: SaveFormat.JPEG, base64: true });
  if (!saved.base64) throw new Error('Could not encode photo.');
  return saved.base64;
}

export type StudioBackdrop = 'white' | 'ivory' | 'wood' | 'stone';

const BACKDROP_PROMPTS: Record<StudioBackdrop, string> = {
  white: 'a seamless pure white studio sweep (infinity cove), like a premium e-commerce catalogue',
  ivory: 'a seamless warm ivory paper backdrop with a subtle gradient, soft and elegant',
  wood: 'a clean light oak tabletop in front of a softly blurred warm neutral wall',
  stone: 'a smooth matte grey stone plinth in front of a soft light-grey backdrop',
};

function studioPrompt(backdrop: StudioBackdrop) {
  return [
    'You are a professional product photographer and retoucher.',
    'Take the handmade product from the provided photo and produce a studio product shot.',
    '1. Remove the original background, hands, clutter and any other objects completely.',
    `2. Place the product on ${BACKDROP_PROMPTS[backdrop]}.`,
    '3. Keep the product itself exactly as it is: same shape, proportions, colours, painted patterns, textures, weave and imperfections. Do not redraw, restyle, add or remove details, text or logos.',
    '4. Light it with large soft boxes: even, soft key light, gentle fill, natural soft contact shadow under the product so it sits on the surface.',
    '5. Centre the product, fill about 70% of the frame, straighten it, camera at eye level with a slight downward angle.',
    'Output one photorealistic square image with no text, watermark or border.',
  ].join('\n');
}

/**
 * Creates a studio-style product photo: background removed and product placed on a
 * studio backdrop with soft lighting. Uses Gemini image editing, or remove.bg (white only) as fallback.
 */
export async function createStudioShot(uri: string, backdrop: StudioBackdrop): Promise<string> {
  if (providers.studio === 'remove.bg') return removeBackground(uri);
  if (providers.studio !== 'gemini') throw new Error('Photo studio is not configured.');

  const response = await createInteraction({
    model: config.geminiImageModel,
    input: [
      { type: 'text', text: studioPrompt(backdrop) },
      { type: 'image', mime_type: 'image/jpeg', data: await photoToBase64(uri, 1536) },
    ],
    // image_size is only accepted by the Gemini 3 image models.
    response_format: {
      type: 'image',
      aspect_ratio: '1:1',
      mime_type: 'image/jpeg',
      ...(config.geminiImageModel.startsWith('gemini-3') ? { image_size: '1K' } : {}),
    },
  });

  const image = outputImage(response);
  if (!image) throw new Error('The studio did not return an image. Try again.');

  const destination = newPhotoFile(image.mimeType === 'image/png' ? 'png' : 'jpg');
  destination.write(image.data, { encoding: 'base64' });
  return destination.uri;
}
