import React, { FC, useState, ChangeEvent } from 'react';
import { Stack, Image, Progress, Heading } from '@chakra-ui/react';
import { ref as storageRef, getDownloadURL, uploadBytes } from 'firebase/storage';

import { EditIcon } from '@chakra-ui/icons';

import { PointerIcon } from './PointerIcon';

import { resizeFile } from '../../../utils';
import { strg } from '../../../shared/firebase';
import { IMAGE_META } from '../../../shared/constants';

interface ServiceImage {
  type: string;
  serviceId: string;
  serviceImgUrl: string;
  imgPath: string;
  title: string;
  isEditor: boolean;
  setServiceImgUrl: React.Dispatch<React.SetStateAction<string>>;
}

const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
  const itemId = e.currentTarget.dataset.itemid;

  const resizedFile = await resizeFile(e.target.files[0]);
  const renamedFile = new File([resizedFile], itemId);

  await uploadBytes(storageRef(strg, `services/${itemId}`), renamedFile, IMAGE_META);
};

export const ServiceImage: FC<ServiceImage> = (props) => {
  const { type, serviceId, serviceImgUrl, imgPath, title, isEditor, setServiceImgUrl } = props;

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Stack
      position='relative'
      flexShrink={0}
      w='100%'
      onClick={(e) => {
        if (isEditor && type !== 'category') {
          (e.currentTarget.firstChild as HTMLInputElement).click();
        }
      }}
    >
      {isEditor && type !== 'category' && (
        <>
          <input
            id={`service-image-picker-${serviceId}`}
            data-itemid={serviceId}
            style={{ position: 'absolute', width: '100%', top: 0, left: 0, zIndex: '-100', opacity: 0 }}
            type='file'
            multiple={false}
            onChange={(e) => {
              setLoading(true);

              onImageChange(e).then(() =>
                getDownloadURL(storageRef(strg, imgPath))
                  .then((url) => setServiceImgUrl(url))
                  .finally(() => setLoading(false)),
              );
            }}
          />

          <EditIcon boxSize={6} color='orange.400' position='absolute' top={2} right={2} zIndex={1} />
        </>
      )}

      {loading && <Progress isIndeterminate size='xs' />}

      <Image
        src={serviceImgUrl}
        alt={title}
        w='full'
        borderRadius='8px 8px 0 0'
        aspectRatio='3 / 1'
        objectFit='cover'
        border={`2px solid var(--pixpax-colors-telegram-200)`}
        filter={type === 'category' ? 'brightness(0.6)' : undefined}
      />

      {!isEditor && <PointerIcon position='absolute' bottom='8px' right='4px' color='orange.300' boxSize={8} />}

      {type === 'category' && (
        <Stack
          w='full'
          h='100%'
          position='absolute'
          top='0'
          left='0'
          alignItems='center'
          justifyContent='center'
          borderRadius='8px 8px 0 0'
          border={`2px solid var(--pixpax-colors-telegram-200)`}
        >
          <Heading color='white'>{title}</Heading>
        </Stack>
      )}
    </Stack>
  );
};
