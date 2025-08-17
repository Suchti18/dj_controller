import "./PerformancePads.css"
import * as React from "react";

interface PerformancePadsProps {
    amount: number
}

const PerformancePads: React.FC<PerformancePadsProps> = ({ amount }) => {
    return (
        <>
            <div className="fxButtons">
                {Array.from({ length: amount }).map((_, i) => (
                    <div key={i}></div>
                ))}
            </div>
        </>
    )
}

export default PerformancePads