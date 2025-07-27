import { createRoot } from 'react-dom/client'
import Player, {DJPlayer} from './components/Player.tsx'
import Mixer from "./components/Mixer.tsx";
import './index.css'
import {StrictMode, useRef} from "react";

function App() {
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



createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>
)
