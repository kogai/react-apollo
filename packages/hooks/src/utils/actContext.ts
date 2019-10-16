import { createContext } from 'react';
import { act as rawAct } from '@testing-library/react';

const act = (callback: () => void) => callback();
export const ActContext = createContext(act);
