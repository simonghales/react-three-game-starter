import {WorkerMessageType} from "../physics/types";
import {render} from "react-nil";
import {createElement, FC} from "react";
import {proxy} from "valtio";

export const logicWorkerHandler = (selfWorker: Worker, init: () => void, setWorker: (worker: Worker | MessagePort) => void, app: FC) => {

    let physicsWorkerPort: MessagePort

    const state = proxy<{
        physicsWorker: null | Worker | MessagePort,
        initiated: boolean,
    }>({
        physicsWorker: null,
        initiated: false,
    })

    selfWorker.onmessage = (event: MessageEvent) => {

        switch( event.data.command )
        {

            case "connect":
                physicsWorkerPort = event.ports[0];
                setWorker(physicsWorkerPort)
                state.physicsWorker = physicsWorkerPort
                return

            case "forward":
                physicsWorkerPort.postMessage( event.data.message );
                return
        }

        const {type, props = {}} = event.data as {
            type: WorkerMessageType,
            props: any,
        };

        switch (type) {
            case WorkerMessageType.INIT:
                init()
                state.initiated = true
                break;
        }

    }

    render(createElement(require("./test").Test, {
        worker: selfWorker,
        state,
    }, createElement(app, null, null)))

}