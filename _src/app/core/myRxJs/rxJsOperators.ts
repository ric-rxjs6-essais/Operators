import { Observable, Observer, zip, from, interval } from 'rxjs';
import { ContinuousDataStream } from './continuousDataStream';
import { takeUntil, tap } from 'rxjs/operators';

export class RxJsOperators {
    private _aSourceData: Array<number> = [
        10, 20, 30, 40, 50, 60, 70, 80, 90, 100
    ];

    private _oCDS: ContinuousDataStream<number> = null;

    private _getCDSSingleton(): ContinuousDataStream<number> {
        if (this._oCDS === null) {
            const iNbDataPerSeconds: number = 1;
            
            let iEmissionDurationInSeconds: number;
            iEmissionDurationInSeconds = ContinuousDataStream._FOREVER_;
            iEmissionDurationInSeconds = 12;

            this._oCDS = this._getCDS(iNbDataPerSeconds, iEmissionDurationInSeconds);
        }
        return(this._oCDS);
    }

    private _getCDS(piNbDataPerSeconds: number = null, piEmissionDurationInSeconds: number = null)
    : ContinuousDataStream<number> {
        const iNbDataPerSeconds: number = (piNbDataPerSeconds===null)? 1 : piNbDataPerSeconds;
        const iEmissionDurationInSeconds: number = (piEmissionDurationInSeconds===null)? 
                                                    ContinuousDataStream._FOREVER_ : piEmissionDurationInSeconds;

        const oCDS: ContinuousDataStream<number> = new ContinuousDataStream<number>(
            this._aSourceData, 
            iNbDataPerSeconds, 
            iEmissionDurationInSeconds
        )
        return(oCDS);
    }    


    // =============================================================================================
    // =============================================================================================

    public testTakeUntil(): void {
        const oObservable1: Observable<number> = this._getCDSSingleton().getAsObservable();
        const oObservable1b: Observable<number> = this._getCDSSingleton().getAsObservable();

        const oObservable2: Observable<void> = new Observable<void>( (poObserver: Observer<void>) => {
            console.log(`                        Waiting for oObservable2 to trigger its notification...`)
            window.setTimeout(() => {
                poObserver.next(); // Comme un update de tout observateur.
            }, 4000);
        })
        .pipe(
            tap(() => console.log(`\n                        --- oObservable2 has triggered its notification !!! ---\n`))
        );

        
        //
        oObservable1
        .pipe(
            takeUntil(oObservable2)
        )
        .subscribe( (piData: number) => {
            console.log(`\nSubscriber1 received emitted data: ${piData}, from oObservable1.`);
        });

        oObservable1b
        .pipe(
            // takeUntil(oObservable2)
        )
        .subscribe( (piData: number) => {
            console.log(`Subscriber2 received emitted data: ${piData}, from oObservable1b.`);
        });        
    }

    // Emettra une data de paData, toutes les 1000/piNbDataPerSeconds ms !
    // jusqu'à avoir tout émis.
    testZip(piNbDataPerSeconds: number = 1, paData: Array<number>): Observable<number> {
        return(
                zip<number>( 
                    from(paData),
                    interval(1000/piNbDataPerSeconds)
                )
        );
    }

}