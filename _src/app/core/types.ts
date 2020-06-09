export type TVoidNoParamsFunction = () => void;

export interface ITest {
    sTitleAsID: string;
    bActif?: boolean;
    fRun: TVoidNoParamsFunction;
}    