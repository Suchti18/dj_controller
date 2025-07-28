import {useRef} from "react";
import Player, {DJPlayer} from "./Player.tsx";
import Mixer from "./Mixer.tsx";
import "./Controler.css"

function Controller() {
    const leftPlayerRef = useRef<DJPlayer>(null);
    const rightPlayerRef = useRef<DJPlayer>(null);

    return (
        <>
            <div className="controller">
                <Player ref={leftPlayerRef} side={"left"}/>
                <Mixer playerRefs={[leftPlayerRef, rightPlayerRef]}/>
                <Player ref={rightPlayerRef} side={"right"}/>
            </div>
        </>
    )
}

export default Controller;