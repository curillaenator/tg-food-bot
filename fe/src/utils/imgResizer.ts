import Resizer from 'react-image-file-resizer';

export const resizeFile = (file): Promise<File> =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(file, 512, 512, 'JPEG', 75, 0, (resized) => resolve(resized as File), 'file');
  });
