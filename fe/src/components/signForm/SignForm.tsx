import React, { FC, useState } from 'react';

import {
  Checkbox,
  Button,
  InputGroup,
  Input,
  InputLeftAddon,
  InputRightElement,
  Stack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { EmailIcon, UnlockIcon } from '@chakra-ui/icons';

import type { Action } from '../../hooks/useAuth';

interface ErrorTextProps {
  error: string;
  resetPassword: () => void;
}

const ErrorText: FC<ErrorTextProps> = ({ error, resetPassword }) => (
  <Stack w='100%' flexDirection='column' gap={4}>
    <Text w='100%' textAlign='center' color='red.500'>
      {error}
    </Text>

    {error.includes('email-already-in-use') && <Button onClick={() => resetPassword()}>Восстановить пароль</Button>}
  </Stack>
);

interface SignFormProps {
  authLoading: boolean;
  firstTime: boolean;
  creds: AppUserCreds;
  onCredsChange: (action: Action) => void;
  resetPassword: () => void;
  setFirstTime: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SignForm: FC<SignFormProps> = (props) => {
  const { authLoading, creds, onCredsChange, resetPassword, firstTime, setFirstTime } = props;

  const [showPass, setShowPass] = useState<boolean>(false);

  return (
    <Stack spacing={4}>
      <Text fontSize='md' color='chakra-body-text'>
        Привет!
      </Text>

      <Text fontSize='sm' color='chakra-subtle-text'>
        {'Пожалуйста, авторизируйся для возможности оформить заказ 😉'}
      </Text>

      <InputGroup>
        <InputLeftAddon
          children={<EmailIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
        />

        <Input
          isDisabled={authLoading}
          autoComplete='off'
          placeholder='Email'
          type='email'
          size='md'
          value={creds.email}
          onChange={(e) => onCredsChange({ type: 'email', payload: e.target.value })}
        />
      </InputGroup>

      <Text fontSize='sm' color='chakra-subtle-text'>
        {'Придумай хороший пароль! Если забудешь, можно будет легко восстановить по указанному email выше 😎'}
      </Text>

      <InputGroup>
        <InputLeftAddon
          children={<UnlockIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
        />

        <Input
          isDisabled={authLoading}
          autoComplete='off'
          placeholder='Password'
          type={showPass ? 'text' : 'password'}
          size='md'
          value={creds.password}
          onChange={(e) => onCredsChange({ type: 'password', payload: e.target.value })}
        />

        <InputRightElement h='100%' display='flex' alignItems='center' width='4.5rem'>
          <Button isDisabled={authLoading} size='sm' onClick={() => setShowPass((prev) => !prev)}>
            {showPass ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>

      {!!creds.error?.length && <ErrorText error={creds.error} resetPassword={resetPassword} />}

      <Accordion allowToggle borderStyle='none'>
        <AccordionItem border='none'>
          <AccordionButton
            w='full'
            display='flex'
            justifyContent='space-between'
            borderBottom='1px solid var(--pixpax-colors-whiteAlpha-200)'
          >
            <Text fontSize='sm' color='whiteAlpha.200' textAlign='left'>
              Упс, я забыл пароль, что делать?
            </Text>
            <AccordionIcon color='whiteAlpha.200' />
          </AccordionButton>

          <AccordionPanel>
            <Text fontSize='sm' color='chakra-subtle-text'>
              {
                'Укажи email, по которому был зарегистрирован аккаунт, укажи любой 10 значный пароль "от балды", отметь "Я новый пользователь" и нажми "Зарегистрироваться". Pixpax предложит восстановить пароль'
              }
            </Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Stack gap={0}>
        <Text fontSize='sm' color='chakra-subtle-text'>
          {'👇 Если впервые на Pixpax, то'}
        </Text>
        <Checkbox
          isDisabled={authLoading}
          colorScheme='telegram'
          size='lg'
          checked={firstTime}
          onChange={() => setFirstTime((prev) => !prev)}
        >
          Я новый пользователь
        </Checkbox>
        Accordion
      </Stack>
    </Stack>
  );
};
