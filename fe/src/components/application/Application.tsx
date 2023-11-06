import React, { FC } from 'react';

import { Card, CardBody } from '@chakra-ui/react';

import { PickedContent as PickedApplicationContent } from './PickedContent';
import { UnpickedContent as UnpickedApplicationContent } from './UnpickedContent';

import { useApplication } from './hooks/useApplication';

import { EMERGENCY_ASSOC } from './constants';
import type { Application as ApllicationType } from '../../shared/interfaces';

type ApplicationProps = ApllicationType & {
  onAplicationPick: (application: ApllicationType) => void;
  pickIsDisabled: boolean;
  currentUserId: string;
};

export const Application: FC<ApplicationProps> = (props) => {
  const { id, onAplicationPick, pickIsDisabled, status, currentUserId, content } = props;

  const {
    customerName = 'загружаю...',
    customeAdress = 'загружаю...',
    customeTel = 'загружаю...',
    executorName,
    executorId,
    placed,
    emergency,
  } = useApplication(props);

  const isUnpicked = currentUserId !== executorId;

  return (
    <Card
      h='full'
      p={2}
      bg='var(--color-bg-cutom)'
      borderRadius={12}
      boxShadow={`inset 0 0 0 1px var(--pixpax-colors-${EMERGENCY_ASSOC[emergency]}-400)`}
      minH='206px'
    >
      <CardBody p={0}>
        {isUnpicked ? (
          <UnpickedApplicationContent
            id={id}
            executorId={executorId}
            executorName={executorName}
            pickIsDisabled={pickIsDisabled}
            placed={placed}
            content={content}
            customerName={customerName}
            status={status}
            onAplicationPick={() => onAplicationPick(props)}
            customerAdress={customeAdress}
            customerTel={customeTel}
            emergency={emergency}
          />
        ) : (
          <PickedApplicationContent
            id={id}
            currentUserId={currentUserId}
            executorId={executorId}
            content={content}
            customerName={customerName}
            customerAdress={customeAdress}
            customerTel={customeTel}
            placed={placed}
            emergency={emergency}
            status={status}
          />
        )}
      </CardBody>
    </Card>
  );
};
