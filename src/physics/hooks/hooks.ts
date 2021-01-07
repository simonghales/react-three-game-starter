import {MathUtils, Object3D} from "three";
import {MutableRefObject, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {Vec2} from "planck-js";
import {useFrame} from "react-three-fiber";
import {AddBodyDef, BodyType, UpdateBodyData} from "../bodies";
import {ValidUUID} from "../../utils/ids";
import {usePhysicsProvider} from "../components/PhysicsProvider/context";
import {applyPositionAngle, getPositionAndAngle, storedPhysicsData} from "../data";
import {useCollisionsProviderContext} from "../components/CollisionsProvider/context";
import {PhysicsCacheKeys} from "../cache";
import {useGetPhysicsStepTimeRemainingRatio} from "../../infrastructure/worker/components/PhysicsWorkerFixedUpdateProvider/PhysicsWorkerFixedUpdateProvider";
import {lerp} from "../../utils/numbers";
import {useAddMeshSubscription} from "../../infrastructure/worker/components/MeshSubscriptions/MeshSubscriptions";

export type BodyApi = {
    applyForceToCenter: (vec: Vec2, uuid?: ValidUUID) => void,
    applyLinearImpulse: (vec: Vec2, pos: Vec2, uuid?: ValidUUID) => void,
    setPosition: (vec: Vec2, uuid?: ValidUUID) => void,
    setLinearVelocity: (vec: Vec2, uuid?: ValidUUID) => void,
    setAngle: (angle: number, uuid?: ValidUUID) => void,
    updateBody: (data: UpdateBodyData, uuid?: ValidUUID) => void,
}

export const useIntervalBodySync = (ref: MutableRefObject<Object3D>, uuid: ValidUUID, isDynamic: boolean, applyAngle: boolean = true) => {

    const {buffers} = usePhysicsProvider()

    useEffect(() => {

        let interval = setInterval(() => {
            if (!isDynamic) {
                return
            }
            if (ref.current && buffers.positions.length && buffers.angles.length) {
                const index = storedPhysicsData.bodies[uuid]
                applyPositionAngle(buffers, ref.current, index, applyAngle)
            }
        }, 1000 / 60)

        return () => {
            clearInterval(interval)
        }

    }, [])

}

export const useBodySync = (ref: MutableRefObject<Object3D>, uuid: ValidUUID, isDynamic: boolean, applyAngle: boolean = true) => {

    const previousUpdateTimeRef = useRef(Date.now())
    const {buffers} = usePhysicsProvider()
    const getPhysicsStepTimeRemainingRatio = useGetPhysicsStepTimeRemainingRatio()

    const onFrame = useCallback(() => {
        if (!isDynamic) {
            return
        }
        if (ref.current && buffers.positions.length && buffers.angles.length) {
            const index = storedPhysicsData.bodies[uuid]
            const update = getPositionAndAngle(buffers, index)
            const body = ref.current
            if (update) {
                const {position, angle} = update
                let physicsRemainingRatio = getPhysicsStepTimeRemainingRatio(previousUpdateTimeRef.current)
                body.position.x = lerp(body.position.x, position[0], physicsRemainingRatio)
                body.position.y = lerp(body.position.y, position[1], physicsRemainingRatio)
                body.rotation.z = angle // todo - lerp
                previousUpdateTimeRef.current = Date.now()
            }
        }
    }, [isDynamic, ref, uuid, applyAngle, getPhysicsStepTimeRemainingRatio, previousUpdateTimeRef])

    useFrame(onFrame)

}

export const useMultipleBodyApi = () => {

}

export const useBodyApi = (passedUuid: ValidUUID): BodyApi => {

    const {
        workerSetBody,
        workerUpdateBody
    } = usePhysicsProvider()

    const api = useMemo<BodyApi>(() => {

        return  {
            applyForceToCenter: (vec, uuid) => {
                workerSetBody({uuid: uuid ?? passedUuid, method: 'applyForceToCenter', methodParams: [vec, true]})
            },
            applyLinearImpulse: (vec, pos, uuid) => {
                workerSetBody({uuid: uuid ?? passedUuid, method: 'applyLinearImpulse', methodParams: [vec, pos, true]})
            },
            setPosition: (vec, uuid) => {
                workerSetBody({uuid: uuid ?? passedUuid, method: 'setPosition', methodParams: [vec]})
            },
            setLinearVelocity: (vec, uuid) => {
                workerSetBody({uuid: uuid ?? passedUuid, method: 'setLinearVelocity', methodParams: [vec]})
            },
            updateBody: (data: UpdateBodyData, uuid) => {
                workerUpdateBody({uuid: uuid ?? passedUuid, data})
            },
            setAngle: (angle: number, uuid) => {
                workerSetBody({uuid: uuid ?? passedUuid, method: 'setAngle', methodParams: [angle]})
            }
        }
    }, [passedUuid])

    return api

}

export const useCollisionEvents = (
                                    uuid: ValidUUID,
                                    onCollideStart?: (data: any, fixtureIndex: number, isSensor: boolean) => void,
                                    onCollideEnd?: (data: any, fixtureIndex: number, isSensor: boolean) => void,
                                    ) => {

    const {
        addCollisionHandler,
        removeCollisionHandler
    } = useCollisionsProviderContext()

    useEffect(() => {
        if (onCollideStart) {
            addCollisionHandler(true, uuid, onCollideStart)
            return () => {
                removeCollisionHandler(true, uuid)
            }
        }
    }, [uuid, onCollideStart])

    useEffect(() => {
        if (onCollideEnd) {
            addCollisionHandler(false, uuid, onCollideEnd)
            return () => {
                removeCollisionHandler(false, uuid)
            }
        }
    }, [uuid, onCollideEnd])

}

export const useBodyRaw = (propsFn: () => AddBodyDef, {
    applyAngle = false,
    cacheKey,
    uuid: passedUUID,
    fwdRef,
    listenForCollisions = false,
}: {
    listenForCollisions?: boolean,
    applyAngle?: boolean,
    cacheKey?: PhysicsCacheKeys,
    uuid?: string | number,
    fwdRef?: MutableRefObject<Object3D>,
}): [any, BodyApi, string | number] => {
    const localRef = useRef<Object3D>((null as unknown) as Object3D)
    const ref = fwdRef ? fwdRef : localRef
    const [uuid] = useState(() => {
        if (passedUUID) return passedUUID
        if (!ref.current) {
            ref.current = new Object3D()
        }
        return ref.current.uuid
    })
    const [isDynamic] = useState(() => {
        const props = propsFn()
        return props.type !== BodyType.static
    })
    const {
        workerAddBody,
        workerRemoveBody,
    } = usePhysicsProvider()

    useLayoutEffect(() => {

        const props = propsFn()

        ref.current.position.x = props.position?.x || 0
        ref.current.position.y = props.position?.y || 0

        workerAddBody({
            uuid,
            listenForCollisions,
            cacheKey,
            ...props,
        })

        return () => {
            workerRemoveBody({uuid, cacheKey})
        }

    }, [])

    const api = useBodyApi(uuid)

    return [ref, api, uuid]
}

export const useBody = (propsFn: () => AddBodyDef, {
    applyAngle = false,
    cacheKey,
    uuid: passedUUID,
    fwdRef,
    listenForCollisions = false,
}: {
    listenForCollisions?: boolean,
    applyAngle?: boolean,
    cacheKey?: PhysicsCacheKeys,
    uuid?: string | number,
    fwdRef?: MutableRefObject<Object3D>,
}): [any, BodyApi, string | number] => {
    const localRef = useRef<Object3D>((null as unknown) as Object3D)
    const ref = fwdRef ? fwdRef : localRef
    const [uuid] = useState(() => {
        if (passedUUID) return passedUUID
        if (!ref.current) {
            ref.current = new Object3D()
        }
        return ref.current.uuid
    })
    const [isDynamic] = useState(() => {
        const props = propsFn()
        return props.type !== BodyType.static
    })
    const {
        workerAddBody,
        workerRemoveBody,
    } = usePhysicsProvider()

    useLayoutEffect(() => {

        const props = propsFn()

        ref.current.position.x = props.position?.x || 0
        ref.current.position.y = props.position?.y || 0

        workerAddBody({
            uuid,
            listenForCollisions,
            cacheKey,
            ...props,
        })

        return () => {
            workerRemoveBody({uuid, cacheKey})
        }

    }, [])

    useAddMeshSubscription(uuid, ref.current, isDynamic, applyAngle)

    const api = useBodyApi(uuid)

    return [ref, api, uuid]
}