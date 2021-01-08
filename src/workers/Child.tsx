import React, {useEffect} from "react";

export const Child: React.FC = () => {

    useEffect(() => {
        console.log('i am child...')
    }, [])

    return null;
};