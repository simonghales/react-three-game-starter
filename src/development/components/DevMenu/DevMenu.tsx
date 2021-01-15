import React from "react";
import styled from "styled-components";
import {devState} from "../../state";
import {useProxy} from "valtio";
import GeneratedCode from "../GeneratedCode/GeneratedCode";

const StyledContainer = styled.div`
    position: fixed;
    top: 0;
    right: 0;
`;

const StyledCodeContainer = styled.div`
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
`

const DevMenu: React.FC = () => {

    const editMode = useProxy(devState).editMode

    return (
        <>
            <StyledContainer>
                <div>
                    <label>
                        <input type="checkbox" checked={editMode} onChange={event => devState.editMode = !editMode}/>
                        <span>edit mode</span>
                    </label>
                </div>
            </StyledContainer>
            <StyledCodeContainer>
                <GeneratedCode/>
            </StyledCodeContainer>
        </>
    );
};

export default DevMenu;