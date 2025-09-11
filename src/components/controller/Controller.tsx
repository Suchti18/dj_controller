import {useRef} from "react";
import Player, {DJPlayer} from "./sections/Player.tsx";
import Mixer from "./sections/Mixer.tsx";
import "./Controler.css"

function Controller() {
    const leftPlayerRef = useRef<DJPlayer>(null);
    const rightPlayerRef = useRef<DJPlayer>(null);

    // Add keyboard controls
    window.addEventListener("keydown", (e) => {
        if (e.repeat) return;

        if(e.code === "Space") {
            leftPlayerRef.current?.handlePlay();
        } else if (e.code === "KeyQ") {
            leftPlayerRef.current?.handleQue();
        } else if (e.code === "KeyJ") {
            leftPlayerRef.current?.handleJmpToQue();
        } else if (e.code === "KeyR") {
            leftPlayerRef.current?.handleResetQue();
        } else if (e.code === "KeyP") {
            leftPlayerRef.current?.handleTogglePreservePitch();
        } else if (e.code === "KeyC") {
            leftPlayerRef.current?.handleJogWheelClick();
        } else if(Number(e.key) >= 1 && Number(e.key) <= 8) {
            console.log(e.key + " Pressed");
        }
    })

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