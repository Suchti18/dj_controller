import './Mixer.css'
import {RefObject, useState} from "react";
import { Knob } from 'primereact/knob';
import * as React from "react";
import {DJPlayer} from "./Player.tsx";

interface DJMixer {
    playerRefs: RefObject<DJPlayer>[];
}

export const Mixer = ({ playerRefs }: DJMixer) => {
    const [hiValue, setHiValue] = useState<number | null>(50);

    const handleSetVolume = (e: React.ChangeEvent<HTMLInputElement>, deck: "left" | "right") => {
        const newVolume = parseFloat(e.target.value);

        if(deck === "left") {
            if(playerRefs[0].current?.audioRef) {
                playerRefs[0].current.audioRef.volume = newVolume;
            }
        } else {
            if(playerRefs[1].current?.audioRef) {
                playerRefs[1].current.audioRef.volume = newVolume;
            }
        }
    }

    return(
        <>
            <div className="center">
                <div className="mixer">
                    <div className="channel">
                        <Knob size={45} valueColor="darkorange" rangeColor="black" value={hiValue ?? 0} valueTemplate={'Hi'} onChange={(e) => setHiValue(e.value)} />
                        <Knob size={45} valueColor="darkorange" rangeColor="black" value={hiValue ?? 0} valueTemplate={'mid'} onChange={(e) => setHiValue(e.value)} />
                        <Knob size={45} valueColor="darkorange" rangeColor="black" value={hiValue ?? 0} valueTemplate={'low'} onChange={(e) => setHiValue(e.value)} />
                        <Knob size={45} valueColor="darkorange" rangeColor="black" value={hiValue ?? 0} valueTemplate={'cfx'} onChange={(e) => setHiValue(e.value)} />
                        <div className="volumeSlider">
                            <div className="ticks">
                                <span className="tick"></span>
                                <span className="tick"></span>
                                <span className="tick"></span>
                                <span className="tick"></span>
                                <span className="tick"></span>
                            </div>
                            <input
                                type="range"
                                min="0.0"
                                defaultValue="1.0"
                                max="1.0"
                                step="0.01"
                                onChange={(e) => handleSetVolume(e, "left")}
                            />
                        </div>
                    </div>
                    <div className="channel">
                        <Knob size={45} valueColor="darkorange" rangeColor="black" value={hiValue ?? 0} valueTemplate={'Hi'} onChange={(e) => setHiValue(e.value)} />
                        <Knob size={45} valueColor="darkorange" rangeColor="black" value={hiValue ?? 0} valueTemplate={'mid'} onChange={(e) => setHiValue(e.value)} />
                        <Knob size={45} valueColor="darkorange" rangeColor="black" value={hiValue ?? 0} valueTemplate={'low'} onChange={(e) => setHiValue(e.value)} />
                        <Knob size={45} valueColor="darkorange" rangeColor="black" value={hiValue ?? 0} valueTemplate={'cfx'} onChange={(e) => setHiValue(e.value)} />
                        <div className="volumeSlider">
                            <div className="ticks">
                                <span className="tick"></span>
                                <span className="tick"></span>
                                <span className="tick"></span>
                                <span className="tick"></span>
                                <span className="tick"></span>
                            </div>
                            <input
                                type="range"
                                min="0.0"
                                defaultValue="1.0"
                                max="1.0"
                                step="0.01"
                                onChange={(e) => handleSetVolume(e, "right")}
                            />
                        </div>
                    </div>
                </div>
                <div className="positionSlider">
                    <div className="ticks">
                        <span className="tick"></span>
                        <span className="tick"></span>
                        <span className="tick"></span>
                        <span className="tick"></span>
                        <span className="tick"></span>
                    </div>
                    <input
                        type="range"
                        min="0.0"
                        defaultValue="1.0"
                        max="2.0"
                        step="0.01"
                        onChange={console.log}
                    />
                </div>
            </div>
        </>
    )
}

export default Mixer