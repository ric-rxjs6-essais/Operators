import { Observable, Observer, zip, from, interval, of, fromEvent, range, concat, merge } from 'rxjs';
import { ContinuousDataStream } from './continuousDataStream';
import { takeUntil, tap, mergeMap, map, concatMap, switchMap, delayWhen } from 'rxjs/operators';

interface ITestData {
    ID: number,
    aNumbers: Array<number>
}

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


    // Retourne un tableau de 3 observables, chacun émettant à son propre rythme.
    private _get3Observables(
        piNbSecondsBetweenEmittedData_ByObservable1: number =1,
        piNbSecondsBetweenEmittedData_ByObservable2: number =4,
        piNbSecondsBetweenEmittedData_ByObservable3: number =8
    ): Array< Observable<number> > {
        const aData: Array<number> = [
            1, 2, 3, 4, 5, 6, 7, 8, 9
        ];

        const aTimers: Array<number> = []; //pour window.clearInterval() .


        const oObservable1: Observable<number> = new Observable<number>((poObserver) => {
            let iIndex: number = 0;
            aTimers.push(
                window.setInterval(() => {
                    const bReLoop: boolean = (iIndex===aData.length);
                    if (bReLoop) console.log(`\n\n`);
                    iIndex = (bReLoop)? 0 : iIndex;
                    poObserver.next( aData[iIndex++] );
                }, piNbSecondsBetweenEmittedData_ByObservable1*1000)
            );
        });

        const oObservable11: Observable<number> = new Observable<number>((poObserver) => {
            let iIndex: number = 0;
            aTimers.push(
                window.setInterval(() => {
                    const bReLoop: boolean = (iIndex===aData.length);
                    if (bReLoop) console.log(`\n\n`);
                    iIndex = (bReLoop)? 0 : iIndex;
                    poObserver.next( aData[iIndex++] *11);
                }, piNbSecondsBetweenEmittedData_ByObservable2*1000)
            );
        });        

        const oObservable1000: Observable<number> = new Observable<number>((poObserver) => {
            let iIndex: number = 0;
            aTimers.push(
                window.setInterval(() => {
                    const bReLoop: boolean = (iIndex===aData.length);
                    if (bReLoop) console.log(`\n\n`);
                    iIndex = (bReLoop)? 0 : iIndex;
                    poObserver.next( aData[iIndex++] *1000);
                }, piNbSecondsBetweenEmittedData_ByObservable3*1000)
            );
        });        

        // Pour pouvoir cancel les émissions...
        const oButton: HTMLButtonElement = window.document.querySelector("#interact_button");
        oButton.textContent = "Stop all observables !";
        oButton.style.display = "block";
        fromEvent(oButton, 'click').subscribe(() => {
            aTimers.forEach( (piTimerID: number) => {window.clearInterval(piTimerID);} );
            oButton.style.display = "none";
        });

        return([ oObservable1, oObservable11, oObservable1000 ]);
    }

    private _get3Observables_2(
        piNbSecondsBetweenEmittedData_ByObservable1: number =1,
        piNbSecondsBetweenEmittedData_ByObservable2: number =4,
        piNbSecondsBetweenEmittedData_ByObservable3: number =8
    ): Array< Observable<any> > {

        const a3Observables: Array< Observable<any> >  = [
            zip( from([1,2,3,4,5,6,7,8]), interval(piNbSecondsBetweenEmittedData_ByObservable1*1000) )
            .pipe(
                map(([data, counter]) => {
                    return(data);
                })
            ),

            zip( from([11,22,33,44,55,66,77]), interval(piNbSecondsBetweenEmittedData_ByObservable2*1000) )
            .pipe(
                map(([data, counter]) => {
                    return(data);
                })
            ),            

            zip( from([1000,2000,3000,4000,5000]), interval(piNbSecondsBetweenEmittedData_ByObservable3*1000) )
            .pipe(
                map(([data, counter]) => {
                    return(data);
                })
            )            
        ];    
        
        return(a3Observables);
    }    

    // =================================================================================================

    private _getStartNextObservableButton(): HTMLButtonElement {
        const oStartNextObservableButton: HTMLButtonElement = window.document.querySelector("#interact_button2");
        oStartNextObservableButton.style.display = "block";
        return(oStartNextObservableButton);
    }

    private _updateStartNextObservableButtonState(piNextObservableIndex: number, piObservablesArrayLength: number): void {
        const oStartNextObservableButton: HTMLButtonElement = this._getStartNextObservableButton();
        // console.log(piNextObservableIndex, "!!!");
        if (piNextObservableIndex+1 > piObservablesArrayLength) {
            oStartNextObservableButton.style.display = "none";
        } else {
            oStartNextObservableButton.textContent = `Start Observable[${piNextObservableIndex+1}/${piObservablesArrayLength}], Emission`;
        }
    }     


    // =============================================================================================
    // =============================================================================================
    // =============================================================================================
    // =============================================================================================    


    // ============================== takeUntil =============================================================

    // takeUntil, fait un complete (stop), de l'émission de l'observable, 
    // une fois l'observable trigger (passé à takeUntil) déclenché.
    public testTakeUntil(): void {
        const oObservable1: Observable<number> = this._getCDSSingleton().getAsObservable();
        const oObservable1b: Observable<number> = this._getCDSSingleton().getAsObservable();

        const oTriggerObservable: Observable<void> = new Observable<void>( (poObserver: Observer<void>) => {
            console.log(`                        Waiting for oTriggerObservable to trigger its notification...`)
            window.setTimeout(() => {
                poObserver.next(); // Comme un update de tout observateur.
            }, 4000);
        })
        .pipe(
            tap(() => console.log(`\n                        --- oTriggerObservable has triggered its notification !!! ---\n`))
        );

        
        //
        oObservable1
        .pipe(
            takeUntil(oTriggerObservable)
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


    // ============================== zip =============================================================


    // zip( from(paData), interval(...) )  :
    //  pour chaque élément paData[iIndex], émettra un tableau : [ paData[iIndex], iIndex ],
    //  jusqu'à avoir tout émis.
    testZip<TDataType2>(piNbDataPerSeconds: number = 1, paData: Array<TDataType2>): Observable<TDataType2> {
        return(
                zip<TDataType2>( 
                    from(paData),
                    interval(1000/piNbDataPerSeconds)
                )
        );
    }

    // En fait zip(observable1, observable2, ..., observableX), 
    //   à la nième émission des observables qui lui sont passés en param.,
    // émet un TABLEAU contenant dans l'ordre 
    //  [ nième élém. émis par l'observable1,
    //    nième élém. émis par l'observable2,
    //    ...
    //    nième élém. émis par l'observableX
    //  ]
    // Ce qui sous-entend qu'avant d'émettre dans le flux ce TABLEAU, tous les observables doivent avoir leur
    // nième élém. à émettre, disponible, c-à-d, qu'on attendra les retardataires,
    // et donc si l'un des observables a fini d'émettre (car pas de nième élément à émettre), 
    // alors plus rien du tout n'est émis !! Autrement dit, on émet le fruit de TOUS, ou on émet rien !
    testZip2(): Observable<any> {
        return(
                zip( ...this._get3Observables(1, 3, 5) )
        );
    }    

    // Pour chaque élément paData[iIndex], émettra : paData[iIndex],
    // jusqu'à avoir tout émis.
    private _testZipMapped<TDataType2>(piNbDataPerSeconds: number = 1, paData: Array<TDataType2>): Observable<TDataType2> {
        return(
                this.testZip<TDataType2>(piNbDataPerSeconds, paData)
                .pipe(
                    map((paInfos) => {
                        return(paInfos[0]) //Que l'élément, pas l'index (paInfos[1]).
                    })
                )
        );
    }


    // ============================== mergeMap ===============================================================    


    // (Remarque : mergeMap est un alias de flatMap.)
    // Contrairement à map qui convertit un item avant de le placer dans le flux,
    // mergeMap, insère dans le flux, à la place du dit item, le flux de l'obervable
    // retourné par mergeMap. 
    //  ATTENTION: chaque Observable précédemment retourné par le dit mergeMap, 
    //             continuera son cycle d'émission, parallélement à celui en cours de renvoi par mergeMap. 
    //             Pour annuler cet effet, utiliser switchMap à la place de mergeMap,
    //             car seul le présent Observable retourné par switchMap, est celui qui fait foi,
    //             (les autres sont clôturés).
    testMergeMap4(): Observable<any> {
        const iEmitIDEach: number = 10; // secondes
        const oObservableOfIDsEmission: Observable<number> = this._testZipMapped<number>(1/iEmitIDEach, [
            500, 600, 700
        ]);

        const aData: Array<ITestData> = [
            { ID: 500, aNumbers: [1500, 15000, 150000] },
            { ID: 600, aNumbers: [1600, 16000, 160000] },
            { ID: 700, aNumbers: [1700, 17000, 170000] }
        ];

        console.log(`      DATA coming soon into the stream, in ${iEmitIDEach} seconds...`, "\n\n");

        return oObservableOfIDsEmission.pipe(
            mergeMap((piEmittedID: number) => { //Met en lieu et place dans le flux, le FLUX d'un autre Observable.
                console.log(`\n\n -> Flux 1, emitting an ID, each ${iEmitIDEach} seconds, emitted ID : ${piEmittedID}`);

                //Récup. du tableau de data associé à l'ID piEmittedID.
                const oData: ITestData = aData.filter( (poData: ITestData) => poData.ID === piEmittedID )[0];

                let oReturnedObservable: Observable<number>;

                // oReturnedObservable = oData.aNumbers; //<<<< si on utilisait map au lieu de mergeMap, alors ceci 
                                                         //     retournerait pour le flux, un Array<number>, 
                                                         //     et non les éléments du dit tableau, un par un.
                
                // oReturnedObservable = from(oData.aNumbers); // OK mais émet les data de oData.aNumbers
                                                               // d'un coup(san tempo), les unes après les autres
                                                               // tout de même (et non un Array<number> comme avec map !)
                
                const iEmitDataNumberEach: number = 2; //Secondes
                oReturnedObservable = this._testZipMapped<number>(1/iEmitDataNumberEach, oData.aNumbers)
                                        .pipe(
                                            tap((piDataNumber: number) => {
                                                console.log(`\n    - Pour un ID donné(ici ${piEmittedID}), `+
                                                            `le Flux 2, émet un nombre toutes les ${iEmitDataNumberEach} secondes. Nombre Émis dans le flux résultant :`
                                                        );
                                            })
                                        );
                // oReturnedObservable = this._getCDS(1/iEmitDataNumberEach, 20).getAsObservable();
                return(oReturnedObservable);
            })
        );
    }

    // Le flux résultant va accueillir toutes les émissions des divers observables 
    // que renvverra mergeMap.
    testMergeMap3(): Observable<number> {
        const a3Observables: Array< Observable<number> >  = this._get3Observables();

        let oResultingObservable: Observable<any>;
        oResultingObservable = range(0, a3Observables.length)
        .pipe(
            mergeMap( (piObservableIndex: number) => {
                // console.log(`${piObservableIndex} !!!`);
                return(a3Observables[piObservableIndex]);
            })
        );
        
        return(oResultingObservable);
    }

    // Le flux résultant va accueillir toutes les émissions des divers observables 
    // qu'a renvoyé mergeMap. Ici, à chaque clique, on ajoute le flux d'un autre Observable, au flux.
    testMergeMap2(): Observable<number> {
        const a3Observables: Array< Observable<number> >  = this._get3Observables(1, 3, 5);

        const oButton2: HTMLButtonElement = window.document.querySelector("#interact_button2");
        oButton2.textContent = "Start Observable[1/"+a3Observables.length+"], Emission";
        oButton2.style.display = "block";

        let oResultingObservable: Observable<any>;
        let iObservableIndex = 0;
        oResultingObservable = fromEvent(oButton2, 'click')
            .pipe(
                tap(() => {
                    if (iObservableIndex>0) {
                        console.log(`  !! ASK for ADDING Observable ${iObservableIndex+1} stream to the "full stream" !! OK !!`);
                    }
                }),                
                mergeMap( (mouseEvent: MouseEvent) => {
                    const oReturnedObservable: Observable<number> = a3Observables[iObservableIndex++];
                    if (iObservableIndex===a3Observables.length) {
                        // iObservableIndex=0;
                        oButton2.style.display = "none";
                    } else {
                        oButton2.textContent = `Start Observable[${iObservableIndex}/${a3Observables.length}], Emission`;
                    }
                    console.log(`\n\n`);
                    console.log(` Observable ${iObservableIndex} stream added...`);
                    return(oReturnedObservable);
                })
            );
        
        return(oResultingObservable);
    }    

    // Le flux résultant va accueillir toutes les émissions des divers observables 
    // qu'a renvoyé mergeMap. Ici, à chaque clique, on ajoute le flux d'un autre Observable, au flux.
    testMergeMap(): Observable<number> {
        const a3Observables: Array< Observable<any> >  = this._get3Observables_2(1, 1.5, 1.5);

        let iAskedForObservableIndex = 0;
        this._updateStartNextObservableButtonState(iAskedForObservableIndex, a3Observables.length);

        let oResultingObservable: Observable<any>;
        let iCurrentStreamingObservableIndex = 0;
        
        oResultingObservable = fromEvent(this._getStartNextObservableButton(), 'click')
            .pipe(
                tap(() => {
                    if (iAskedForObservableIndex>0) {
                        console.log(`  Add to stream : Observable ${iAskedForObservableIndex+1} stream !!`);
                    }
                    
                    iAskedForObservableIndex++;
                    this._updateStartNextObservableButtonState(iAskedForObservableIndex, a3Observables.length);
                   
                }),
                mergeMap( (mouseEvent: MouseEvent) => {
                    iCurrentStreamingObservableIndex++;
                    const oReturnedObservable: Observable<number> = a3Observables[iCurrentStreamingObservableIndex-1];
                    return(oReturnedObservable);
                })
            );
        
        return(oResultingObservable);        
    }    



    // ============================== switchMap ===============================================================    

    // Avec switchMap, le flux résultant sera UNIQUEMENT celui du dernier Observable retourné par switchMap !
    // Contrairement à mergeMap, qui fait cohabiter les émissions de tous les Observables qu'elle a renvoyés.
    testSwitchMap2(): Observable<number> {
        const a3Observables: Array< Observable<number> >  = this._get3Observables(1, 2, 4);

        const oButton2: HTMLButtonElement = window.document.querySelector("#interact_button2");
        oButton2.textContent = "Start Observable[1/"+a3Observables.length+"], Emission";
        oButton2.style.display = "block";

        let oResultingObservable: Observable<any>;
        let iObservableIndex = 0;
        oResultingObservable = fromEvent(oButton2, 'click')
            .pipe(
                tap(() => {
                    if (iObservableIndex>0) {
                        console.log(`  !! ASK for SWITCHING To Observable ${iObservableIndex+1} stream !! OK !!`);
                    }
                }),           
                switchMap( (mouseEvent: MouseEvent) => {
                    console.log("\n\n");
                    if (a3Observables[iObservableIndex]!==undefined) {
                        const oReturnedObservable: Observable<number> = a3Observables[iObservableIndex++];
                        if (iObservableIndex===a3Observables.length) {
                            // iObservableIndex=0;
                            oButton2.style.display = "none";
                        } else {
                            oButton2.textContent = `Start Observable[${iObservableIndex+1}/${a3Observables.length}], Emission`;
                        }
                        console.log(`\n\n`);
                        console.log(` SWITCHED To Observable ${iObservableIndex} stream :`);
                        return(oReturnedObservable);
                    }
                })
            );
        
        return(oResultingObservable);
    }

    // Avec switchMap, le flux résultant sera UNIQUEMENT celui du dernier Observable retourné par switchMap !
    // Contrairement à mergeMap, qui fait cohabiter les émissions de tous les Observables qu'elle a renvoyés.
    testSwitchMap(): Observable<number> {
        const a3Observables: Array< Observable<any> >  = this._get3Observables_2(1, 1.5, 1.5);

        let iAskedForObservableIndex = 0;
        this._updateStartNextObservableButtonState(iAskedForObservableIndex, a3Observables.length);

        let oResultingObservable: Observable<any>;
        let iCurrentStreamingObservableIndex = 0;
        
        oResultingObservable = fromEvent(this._getStartNextObservableButton(), 'click')
            .pipe(
                tap(() => {
                    if (iAskedForObservableIndex>0) {
                        console.log(`  Close Observable ${iAskedForObservableIndex} in order to switch to : Observable ${iAskedForObservableIndex+1} stream !!`);
                    }
                    
                    iAskedForObservableIndex++;
                    this._updateStartNextObservableButtonState(iAskedForObservableIndex, a3Observables.length);
                   
                }),
                switchMap( (mouseEvent: MouseEvent) => {
                    iCurrentStreamingObservableIndex++;
                    console.log("\n\n", `Observable ${iCurrentStreamingObservableIndex} stream:`);                    
                    const oReturnedObservable: Observable<number> = a3Observables[iCurrentStreamingObservableIndex-1];
                    return(oReturnedObservable);
                })
            );
        
        return(oResultingObservable);        
    }


    
    
   // ============================== concatMap ===============================================================    

    // Lorsque concatMap renvoie un Observable, cet Observable ne verra son flux devenir le flux UNIQUE et courant 
    // QUE lorsque le précédent Observable qu'avait renvoyé concatMap, sera devenu completed, c-à-d ayant clôturé 
    // son émission.
    // Ce genre d'approche, permet de séquencer dans un ORDRE donné, le lancement de flux Observables (asynchrones).
    testConcatMap(): Observable<number> {
        const a3Observables: Array< Observable<any> >  = this._get3Observables_2(1, 1.5, 1.5);

        let iAskedForObservableIndex = 0;
        this._updateStartNextObservableButtonState(iAskedForObservableIndex, a3Observables.length);

        let oResultingObservable: Observable<any>;
        let iCurrentStreamingObservableIndex = 0;
        
        oResultingObservable = fromEvent(this._getStartNextObservableButton(), 'click')
            .pipe(
                tap(() => {
                    if (iAskedForObservableIndex>0) {
                        console.log(`  !! if not completed yet, WILL WAIT for Observable ${iAskedForObservableIndex} stream to be COMPLETED Before starting with Observable ${iAskedForObservableIndex+1} stream !!`);
                    }
                    
                    iAskedForObservableIndex++;
                    this._updateStartNextObservableButtonState(iAskedForObservableIndex, a3Observables.length);
                   
                }),
                concatMap( (mouseEvent: MouseEvent) => {
                    iCurrentStreamingObservableIndex++;
                    console.log("\n\n", `Observable ${iCurrentStreamingObservableIndex} stream:`);                    
                    const oReturnedObservable: Observable<number> = a3Observables[iCurrentStreamingObservableIndex-1];
                    return(oReturnedObservable);
                })
            );
        
        return(oResultingObservable);
    }      




    // ============================== concat ===============================================================

    // Les Observables passés en paramètre à concat(...), seront (dans l'ordre passé),
    // "subscribés" chacun leur tour, (pour donc 1 seul subscribe effectué sur l'observable résultant). 
    // Bien entendu, concernant ces Observables passés en param., le subscribe sur l'Observable suivant ne sera
    // effectué QUE lorsque l'Observable précédent sera à l'état completed !
    testConcat(): Observable<number> {
        let a3Observables: Array< Observable<any> >  = this._get3Observables_2(1, 1.5, 1.5);

        let oResultingObservable: Observable<any>;
        oResultingObservable = concat(...a3Observables);

        return(oResultingObservable);        
    }


    // ============================== merge ===============================================================

    // Les Observables passés en paramètre à merge(...), seront simultanément tous "subscribés", 
    // et donc le flux résultant dans le temps, sera un mélange de leur émission.
    testMerge(): Observable<number> {
        let a3Observables: Array< Observable<any> >  = this._get3Observables_2(1, 1.5, 1.5);

        let oResultingObservable: Observable<any>;
        oResultingObservable = merge(...a3Observables);

        return(oResultingObservable);        
    }    
    

}