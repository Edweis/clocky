/* eslint-disable @typescript-eslint/no-namespace */
export namespace ReadingStep {
    export type Steps = 'ready' | 'in-progress' | 'paused';
    export type Ready = {
        book: string,
        startPage: number,
    }
    export type InProgress = Ready & {
        startTime: number
    };
    export type Paused = InProgress & {
        endTime: number
    }
    export type State = { state: 'ready', data: Ready }
        | { state: 'in-progress', data: InProgress }
        | { state: 'paused', data: Paused }
}
export type Reading = ReadingStep.Paused & {
    endPage: number
}
