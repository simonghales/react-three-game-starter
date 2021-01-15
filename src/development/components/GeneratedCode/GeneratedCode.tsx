import React from "react";
import styled from "styled-components";
import {proxy, useProxy} from "valtio";

export const generatedCode = proxy({
    code: '',
})

const StyledContainer = styled.div`
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    
    textarea {
        display: block;
        width: 100%;
        height: 100px;
    }
    
`;

const GeneratedCode: React.FC = () => {
    const code = useProxy(generatedCode).code
    return (
        <StyledContainer>
            <textarea value={code} readOnly/>
        </StyledContainer>
    );
};

export default GeneratedCode;