import Resizer from 'react-image-file-resizer';

export const resizeFile = (file): Promise<File> =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(file, 768, 768, 'JPEG', 80, 0, (resized) => resolve(resized as File), 'file');
  });
