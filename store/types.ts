import { State as NetLogState } from './netlogs/types';

export interface RootState {
    netlogs: NetLogState
}

export type Mutation<S, T> = (state: S, data: T) => void
export type Getter<S, T> = (state: S) => T
export type Action<P, T> = (context: any, payload?: P) => T
