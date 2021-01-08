/* eslint-disable no-restricted-globals */
import {logicWorkerHandler} from "r3";

// because of some weird react/dev/webpack/something quirk
(self as any).$RefreshReg$ = () => {};
(self as any).$RefreshSig$ = () => () => {};

const selfWorker = self as unknown as Worker

logicWorkerHandler(selfWorker, require("../Child").Child)