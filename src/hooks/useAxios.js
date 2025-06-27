import { useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { tokenAtom } from '../atoms';
import { createAxios } from '../config/config';

export const useAxios = () => {
  const tokenObj = useAtomValue(tokenAtom);
  const setToken = useSetAtom(tokenAtom);
  return useMemo(
    () => createAxios(tokenObj.access_token, setToken),
    [tokenObj.access_token, setToken]
  );
};
