import { createRoot } from 'react-dom/client'
import Player from './components/Player.tsx'
import Mixer from "./components/Mixer.tsx";
import './index.css'
import {StrictMode} from "react";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Player />
        <Mixer />
        <Player />
    </StrictMode>
)
