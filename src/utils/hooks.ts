import {useEffect, useRef} from "react";

export const useDidMount = () => {
    const mountRef = useRef(false);

    useEffect(() => { mountRef.current = true }, []);

    return () => mountRef.current;
}