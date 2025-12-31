// src/lib/upload.ts

export interface UploadResult {
  url: string;
}

export async function uploadImage(
  file: File,
  folder: string = 'products'
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  const data: UploadResult = await response.json();
  return data.url;
}

export async function uploadImages(
  files: File[],
  folder: string = 'products'
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadImage(file, folder));
  return Promise.all(uploadPromises);
}
