/* eslint-disable no-restricted-globals */

import { render } from "react-nil"
import {WorkerOwnerMessageType} from "../physics/types";
import {MessageData} from "../shared/types";
import * as React from "react";
import LogicApp from "../../logic/components/LogicApp/LogicApp";
import {logicAppState, workerStorage} from "../../logic/components/LogicApp/state";

const selfWorker = self as unknown as Worker

const sendMessageToMain = (message: MessageData) => {

    const update = {
        type: WorkerOwnerMessageType.MESSAGE,
        message
    }

    selfWorker.postMessage(update)
}

export const setWorker = (worker: MessagePort) => {
    workerStorage.worker = worker
    logicAppState.workerLoaded = true
}

render(<LogicApp sendMessageToMain={sendMessageToMain}/>)