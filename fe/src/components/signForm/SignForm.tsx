import React, { FC, useState } from 'react';

import { Checkbox, Button, InputGroup, Input, InputLeftAddon, InputRightElement, Stack, Text } from '@chakra-ui/react';
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

    {error.includes('email-already-in-use') && <Button onClick={() => resetPassword()}>Remind password</Button>}
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
      <InputGroup>
        <InputLeftAddon
          h={12}
          children={<EmailIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
        />

        <Input
          isDisabled={authLoading}
          autoComplete='off'
          placeholder='Email'
          type='email'
          size='lg'
          value={creds.email}
          onChange={(e) => onCredsChange({ type: 'email', payload: e.target.value })}
        />
      </InputGroup>

      <InputGroup>
        <InputLeftAddon
          h={12}
          children={<UnlockIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
        />

        <Input
          isDisabled={authLoading}
          autoComplete='off'
          placeholder='Password'
          type={showPass ? 'text' : 'password'}
          size='lg'
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

      <Checkbox
        isDisabled={authLoading}
        colorScheme='telegram'
        mt={4}
        size='lg'
        checked={firstTime}
        onChange={() => setFirstTime((prev) => !prev)}
      >
        I am first timer!
      </Checkbox>
    </Stack>
  );
};
