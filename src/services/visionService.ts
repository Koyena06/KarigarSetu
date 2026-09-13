export type EnhancementCheck = 'background' | 'lighting' | 'centred';

export interface VisionEnhancementResult {
  imageUri: string;
  checks: EnhancementCheck[];
  source: 'demo-fallback';
}

/**
 * Integration boundary for the future image-enhancement provider.
 * The current demo intentionally preserves the captured local URI instead of
 * substituting stock imagery, so every downstream screen continues using the
 * artisan's actual product image.
 */
export async function enhanceProductImage(imageUri: string): Promise<VisionEnhancementResult> {
  if (!imageUri) throw new Error('A product image is required before enhancement can begin.');

  await new Promise<void>((resolve) => setTimeout(resolve, 1150));

  return {
    imageUri,
    checks: ['background', 'lighting', 'centred'],
    source: 'demo-fallback',
  };
}
