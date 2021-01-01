/* eslint-disable no-restricted-globals */

// because of some weird react/dev/webpack/something quirk
(self as any).$RefreshReg$ = () => {};
(self as any).$RefreshSig$ = () => () => {};

const setWorker = require("./react").setWorker

let physicsWorkerPort: MessagePort

const selfWorker = self as unknown as Worker

selfWorker.onmessage = (event: MessageEvent) => {

    switch( event.data.command )
    {

        case "connect":
            physicsWorkerPort = event.ports[0];
            setWorker(physicsWorkerPort)
            return

        case "forward":
            physicsWorkerPort.postMessage( event.data.message );
            return
    }

}

export {}