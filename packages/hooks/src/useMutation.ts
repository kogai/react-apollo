import { useContext, useState, useRef, useEffect } from 'react';
import { getApolloContext, OperationVariables } from '@apollo/react-common';
import { DocumentNode } from 'graphql';

import { MutationHookOptions, MutationTuple } from './types';
import { MutationData } from './data/MutationData';
import { ActContext } from './utils/actContext';

export function useMutation<TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode,
  options?: MutationHookOptions<TData, TVariables>
): MutationTuple<TData, TVariables> {
  const context = useContext(getApolloContext());
  const [result, setResult] = useState({ called: false, loading: false });
  const updatedOptions = options ? { ...options, mutation } : { mutation };
  const act = useContext(ActContext);

  const mutationDataRef = useRef<MutationData<TData, TVariables>>();
  function getMutationDataRef() {
    if (!mutationDataRef.current) {
      mutationDataRef.current = new MutationData<TData, TVariables>({
        options: updatedOptions,
        context,
        result,
        setResult: (next: typeof result) => {
          act(() => {
            setResult(next);
          });
        }
      });
    }
    return mutationDataRef.current;
  }

  const mutationData = getMutationDataRef();
  mutationData.setOptions(updatedOptions);
  mutationData.context = context;

  useEffect(() => mutationData.afterExecute());

  return mutationData.execute(result);
}
