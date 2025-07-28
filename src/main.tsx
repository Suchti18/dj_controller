import { createRoot } from 'react-dom/client'
import './index.css'
import {StrictMode} from "react";
import Controller from "./components/Controller.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Controller />
    </StrictMode>
)
