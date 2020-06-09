import { Observable, interval } from "rxjs";
import { map, takeWhile, tap } from 'rxjs/operators';

import { TVoidNoParamsFunction } from "./../types";



export class ContinuousDataStream<TDataType> {
    private _bStopped: boolean;
    public static _FOREVER_: number = -1;
    
    constructor(
        private aSourceData: Array<TDataType> = [], 
        private iNbDataPerSeconds = 1,
        private iEmissionDurationInSeconds = ContinuousDataStream._FOREVER_
    ) {
        this._bStopped = false;
    }

    public stopEmit(): void {
        this._bStopped = true;
    }    

    public getAsObservable(
        paSourceData: Array<TDataType> = null, 
        piNbDataPerSeconds = null,
        piEmissionDurationInSeconds = null
    ): Observable<TDataType> {
        //
        if (piNbDataPerSeconds === null) {
            piNbDataPerSeconds = this.iNbDataPerSeconds;
        }
        if (piEmissionDurationInSeconds === null) {
            piEmissionDurationInSeconds = this.iEmissionDurationInSeconds;
        }

        //
        this._reset();
        let fTimeout: TVoidNoParamsFunction = null;
        if (piEmissionDurationInSeconds !== ContinuousDataStream._FOREVER_) {
            fTimeout = (): void => {
                this.stopEmit();
            };
            
        }

        //
        return(
            interval(1000/piNbDataPerSeconds)
            .pipe(
                tap(() => {
                    if (fTimeout !== null) {
                        window.setTimeout(fTimeout, piEmissionDurationInSeconds*1000);
                    }
                }),
                takeWhile( () => !this._isStopped() ),
                map<number, TDataType>( (piCounter: number) => {
                    return( this._getNextData(piCounter, paSourceData) );
                })
            )
        );
    }

    private _reset(): void {
        this._bStopped = false;
    }

    private _isStopped(): boolean {
        return(this._bStopped);
    }

    private _getNextData(piCounter: number, paSourceData: Array<TDataType> = null): TDataType {
        if (paSourceData === null) {
            paSourceData = this.aSourceData;
        }
        
        //
        const iRealIndex: number = this._counterToRealIndex(piCounter, paSourceData);
        // console.log(iRealIndex, piCounter);
        return(paSourceData[iRealIndex]);
    }

    private _counterToRealIndex(piCounter: number, paSourceData: Array<TDataType>): number {
        const iRealIndex: number = piCounter % paSourceData.length;
        return(iRealIndex);
    }
}