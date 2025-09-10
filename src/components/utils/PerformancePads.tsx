import "./PerformancePads.css"
import * as React from "react";
import airHorn from "/effects/air-horn.mp3";
import shipHorn from "/effects/ship-horn.mp3";
import {useRef, useState} from "react";

interface PerformancePadsProps {
    amount: number
}

const PerformancePads: React.FC<PerformancePadsProps> = ({ amount }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const soundEffects = new Map<number, string>([
        [0, airHorn],
        [1, shipHorn]
    ]);

    const handleSoundEffectPlay = (i: number) => {
        const src = soundEffects.get(i);
        if(src != null) {
            setAudioSrc(src);
            audioRef.current?.play();
        }
    }

    return (
        <>
            <div className="fxButtons">
                {Array.from({ length: amount }).map((_, i) => (
                    <div
                        key={i}
                        onClick={() => handleSoundEffectPlay(i)}
                    />
                ))}
            </div>
            {audioSrc && (
                <audio src={audioSrc} ref={audioRef} className="hidden">
                    Your browser does not support audio.
                </audio>
            )}
        </>
    )
}

export default PerformancePads