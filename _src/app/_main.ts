import { RxJsOperators } from "./core/myRxJs/rxJsOperators";
import { ITest } from "./core/types";

                                        
export class Main {
    private _oRxJsOperators: RxJsOperators;

    constructor() {
        this._oRxJsOperators = new RxJsOperators();
    }

    private _runTests(paTests: Array<ITest>): void {
        paTests.forEach((poTest: ITest) => {
            if (poTest.bActif===true && poTest.sTitleAsID!=="") {
                console.log("\n\n", "**********************   "+`Running test for: '${poTest.sTitleAsID}' :`+"   ************************", "\n");

                poTest.fRun();
            }
        });
        
    }    

    public run(): void {

        // Définition des test synchrones.
        const aSynchronousTests: Array<ITest> = [

            {   
                sTitleAsID: "",
                bActif: true,
                fRun: (): void => {

                }
            }

        ];

        // Définition des test asynchrones
        let aAsynchronousTests: Array<ITest> = [

            {   
                sTitleAsID: "takeUntil",
                bActif: true,
                fRun: (): void => {
                    this._oRxJsOperators.testTakeUntil();
                }
            },


            {   sTitleAsID: "zip",
                bActif: true,
                fRun: (): void => {
                    this._oRxJsOperators.testZip(1, [400,500,600,700]).subscribe((paData) => {
                        // console.log(paData);
                        console.log(`Emitted data, each second, data: ${paData[0]} (index: ${paData[1]})\n\n`);
                    });
                }
            },
            {   sTitleAsID: "zip (2)",
                bActif: true,
                fRun: (): void => {
                    this._oRxJsOperators.testZip2().subscribe((paData: Array<number>) => {
                        console.log(` [${paData}]\n\n`);
                    });
                }
            }, 


            {   sTitleAsID: "mergeMap",
                bActif: true,
                fRun: (): void => {
                    this._oRxJsOperators.testMergeMap().subscribe((piData: number) => {
                        console.log(` ${piData}\n\n`);
                    });                    
                }
            }, 
            {   sTitleAsID: "mergeMap (2)",
                bActif: true,
                fRun: (): void => {
                    this._oRxJsOperators.testMergeMap2().subscribe((piData: number) => {
                        console.log(` ${piData}\n\n`);
                    });                    
                }
            }, 
            {   sTitleAsID: "mergeMap (3)",
                bActif: true,
                fRun: (): void => {
                    this._oRxJsOperators.testMergeMap3().subscribe((piData: number) => {
                        console.log(` ${piData}\n\n`);
                    });
                }
            },
            {   sTitleAsID: "mergeMap (4)",
                bActif: true,
                fRun: (): void => {
                    this._oRxJsOperators.testMergeMap4().subscribe((psData: string) => {
                        console.log(`               ${psData}\n\n`);
                    });
                }
            },


            {   sTitleAsID: "merge",
                bActif: true,
                fRun: (): void => {
                    this._oRxJsOperators.testMerge().subscribe((piData: number) => {
                        console.log(` ${piData}\n\n`);
                    });
                }
            },            
            
            
            {   sTitleAsID: "switchMap",
                bActif: true,
                fRun: (): void => {
                    this._oRxJsOperators.testSwitchMap().subscribe((piData: number) => {
                        console.log(` ${piData}\n\n`);
                    });
                }
            },  
            {   sTitleAsID: "switchMap (2)",
                bActif: true,
                fRun: (): void => {
                    this._oRxJsOperators.testSwitchMap2().subscribe((piData: number) => {
                        console.log(` ${piData}\n\n`);
                    });
                }
            },             
            
            
            {   sTitleAsID: "concatMap",
                bActif: true,
                fRun: (): void => {
                    this._oRxJsOperators.testConcatMap().subscribe((piData: number) => {
                        console.log(` ${piData}\n\n`);
                    });
                }
            },
            
            {   sTitleAsID: "concat",
                bActif: true,
                fRun: (): void => {
                    this._oRxJsOperators.testConcat().subscribe((piData: number) => {
                        console.log(` ${piData}\n\n`);
                    });
                }
            },            
            
        ];
        let sTheOnlyAsynchronousTestToRunID: string; 
        sTheOnlyAsynchronousTestToRunID = "switchMap";  //<<<<<<<<<<<<<<<
        sTheOnlyAsynchronousTestToRunID = "concatMap";  //<<<<<<<<<<<<<<<
        sTheOnlyAsynchronousTestToRunID = "merge";  //<<<<<<<<<<<<<<<
        sTheOnlyAsynchronousTestToRunID = "concat";  //<<<<<<<<<<<<<<<
        sTheOnlyAsynchronousTestToRunID = "mergeMap (2)";  //<<<<<<<<<<<<<<<
        sTheOnlyAsynchronousTestToRunID = "zip (2)";  //<<<<<<<<<<<<<<<
        aAsynchronousTests = aAsynchronousTests.filter((poTest: ITest) => poTest.sTitleAsID===sTheOnlyAsynchronousTestToRunID);
 
        //
        this._runTests(aSynchronousTests);
        this._runTests(aAsynchronousTests);
    }        

}