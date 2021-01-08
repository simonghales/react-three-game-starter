/* eslint-disable no-restricted-globals */
import {logicWorkerHandler} from "react-three-game-engine";

// because of some weird react/dev/webpack/something quirk
(self as any).$RefreshReg$ = () => {};
(self as any).$RefreshSig$ = () => () => {};

logicWorkerHandler(self as unknown as Worker, require("../../game/logic/components/LgApp/LgApp").LgApp)