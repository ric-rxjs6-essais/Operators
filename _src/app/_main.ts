import { RxJsOperators } from "./core/myRxJs/rxJsOperators";
import { ITest } from "./core/types";

                                        
export class Main {
    private _oRxJsOperators: RxJsOperators;

    constructor() {
        this._oRxJsOperators = new RxJsOperators();
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

        ];
        const sTheOnlyAsynchronousTestToRunID: string = "takeUntil"; 
        aAsynchronousTests = aAsynchronousTests.filter((poTest: ITest) => poTest.sTitleAsID===sTheOnlyAsynchronousTestToRunID);
 
        //
        this._runTests(aSynchronousTests);
        this._runTests(aAsynchronousTests);
    }        

    private _runTests(paTests: Array<ITest>): void {
        paTests.forEach((poTest: ITest) => {
            if (poTest.bActif===true && poTest.sTitleAsID!=="") {
                console.log("\n\n", "**********************   "+`Running test for: '${poTest.sTitleAsID}' :`+"   ************************", "\n");

                poTest.fRun();
            }
        });
        
    }

}