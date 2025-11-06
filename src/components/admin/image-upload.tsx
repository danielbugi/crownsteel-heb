'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  images: string[];
  mainImage: string;
  onImagesChange: (images: string[]) => void;
  onMainImageChange: (image: string) => void;
}

export function ImageUpload({
  images,
  mainImage,
  onImagesChange,
  onMainImageChange,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          continue;
        }

        // Convert to base64 or upload to server
        const reader = new FileReader();
        const imageUrl = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        });

        newImages.push(imageUrl);
      }

      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);

      // Set first image as main if no main image set
      if (!mainImage && newImages.length > 0) {
        onMainImageChange(newImages[0]);
      }

      toast.success(`${newImages.length} image(s) uploaded`);
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    const updatedImages = images.filter((img) => img !== imageUrl);
    onImagesChange(updatedImages);

    // If removed image was main, set first remaining image as main
    if (imageUrl === mainImage && updatedImages.length > 0) {
      onMainImageChange(updatedImages[0]);
    } else if (updatedImages.length === 0) {
      onMainImageChange('');
    }
  };

  const handleSetMainImage = (imageUrl: string) => {
    onMainImageChange(imageUrl);
    toast.success('Main image updated');
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Images'}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Upload multiple images. Max 5MB per image. Supported: JPG, PNG, WebP
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className={cn(
                'relative group border-2 overflow-hidden',
                imageUrl === mainImage
                  ? 'border-primary ring-2 ring-primary'
                  : 'border-border'
              )}
            >
              <img
                src={imageUrl}
                alt={`Product image ${index + 1}`}
                className="w-full h-48 object-cover"
              />

              {/* Main Image Badge */}
              {imageUrl === mainImage && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Main
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {imageUrl !== mainImage && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleSetMainImage(imageUrl)}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Set as Main
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveImage(imageUrl)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No images uploaded yet. Click the button above to upload.
          </p>
        </div>
      )}
    </div>
  );
}
