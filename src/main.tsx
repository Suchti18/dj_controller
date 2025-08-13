import { createRoot } from 'react-dom/client'
import './index.css'
import {StrictMode} from "react";
import Controller from "./components/controller/Controller.tsx";
import AsciiBackground from "./components/utils/Background/Background.tsx";
import DebugMenu from "./components/utils/PopupMenus/DebugMenu.tsx";
import InfoMenu from "./components/utils/PopupMenus/InfoMenu.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AsciiBackground count={2} />
        <Controller />
        <InfoMenu />
        <DebugMenu />
    </StrictMode>
)
