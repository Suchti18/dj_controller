import { createRoot } from 'react-dom/client'
import './index.css'
import {StrictMode} from "react";
import Controller from "./components/Controller.tsx";
import AsciiBackground from "./components/utils/Background.tsx";
import DebugMenu from "./components/utils/DebugMenu.tsx";
import InfoMenu from "./components/utils/InfoMenu.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AsciiBackground count={2} />
        <Controller />
        <InfoMenu />
        <DebugMenu />
    </StrictMode>
)
