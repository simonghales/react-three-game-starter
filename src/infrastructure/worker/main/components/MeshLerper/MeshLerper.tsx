import React, {useCallback} from "react"
import {useGetPhysicsStepTimeRemainingRatio} from "../../../components/PhysicsWorkerFixedUpdateProvider/PhysicsWorkerFixedUpdateProvider";
import {useLerpMeshes} from "../../../components/MeshSubscriptions/MeshSubscriptions";
import {useFrame} from "react-three-fiber";

const MeshLerper: React.FC = () => {

    const getPhysicsStepTimeRemainingRatio = useGetPhysicsStepTimeRemainingRatio()
    const lerpMeshes = useLerpMeshes()

    const onFrame = useCallback(() => {

        lerpMeshes(getPhysicsStepTimeRemainingRatio)

    }, [getPhysicsStepTimeRemainingRatio, lerpMeshes])

    useFrame(onFrame)

    return null
}

export default MeshLerper