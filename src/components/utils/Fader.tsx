import * as React from "react";
import './Fader.css'

interface FaderProps {
    tickAmount: number
    max: number
    min: number
    defaultValue: number
    step: number
    alignment: "horizontal" | "vertical"
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Fader: React.FC<FaderProps> = ({ tickAmount, alignment, onChange, min = 0, max, defaultValue, step = 0.01}) => {

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
                    min={min}
                    defaultValue={defaultValue}
                    max={max}
                    step={step}
                    onChange={onChange}
                />
            </div>
        </>
    )
}

export default Fader