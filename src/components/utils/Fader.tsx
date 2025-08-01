import * as React from "react";
import './Fader.css'

interface FaderProps {
    tickAmount: number;
    alignment: "horizontal" | "vertical";
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Fader: React.FC<FaderProps> = ({ tickAmount, alignment, onChange}) => {

    return (
        <>
            <div className={alignment}>
                <div className="ticks">
                    {[...Array(tickAmount)].map((_, idx) => (
                        <span key={idx} className="tick"></span>
                    ))}
                </div>
                <input
                    type="range"
                    min="0.0"
                    defaultValue="1.0"
                    max="2.0"
                    step="0.01"
                    onChange={onChange}
                />
            </div>
        </>
    )
}

export default Fader