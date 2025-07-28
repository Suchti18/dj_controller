import './Mixer.css'
import * as React from "react";
import {RefObject, useEffect, useRef, useState} from "react";
import {Knob} from 'primereact/knob';
import {DJPlayer} from "./Player.tsx";

interface DJMixer {
    playerRefs: RefObject<DJPlayer>[];
}

interface ChannelEQValues {
    low: number;
    mid: number;
    hi: number;
    filter: number;
}

export const Mixer = ({ playerRefs }: DJMixer) => {
    const [channelEQs, setChannelEQs] = useState<ChannelEQValues[]>(() =>
        playerRefs.map(() => ({ low: 0, mid: 0, hi: 0, filter: 20 }))
    );

    const audioFiltersRef = useRef<{
        low: BiquadFilterNode;
        mid: BiquadFilterNode;
        hi: BiquadFilterNode;
        filter: BiquadFilterNode;
    }[]>([]);

    useEffect(() => {
        const setupAudioContext = (audioElement: HTMLAudioElement, channelIndex: number) => {
            if (audioFiltersRef.current[channelIndex]) {
                return;
            }

            const audioCtx = new AudioContext();

            const low = audioCtx.createBiquadFilter();
            low.type = "lowshelf";
            low.frequency.value = 320.0;
            low.gain.value = 0
            low.connect(audioCtx.destination);

            const mid = audioCtx.createBiquadFilter();
            mid.type = "peaking";
            mid.frequency.value = 1000.0;
            mid.Q.value = 0.5;
            mid.gain.value = 0;
            mid.connect(low);

            const hi = audioCtx.createBiquadFilter();
            hi.type = "highshelf";
            hi.frequency.value = 3200.0;
            hi.gain.value = 0;
            hi.connect(mid);

            const filter = audioCtx.createBiquadFilter();
            filter.frequency.value = 20000.0;
            filter.type = "lowpass"
            filter.connect(hi);

            const sourceNode = audioCtx.createMediaElementSource(audioElement);
            sourceNode.connect(filter);

            audioFiltersRef.current[channelIndex] = {
                low,
                mid,
                hi,
                filter
            };
        };

        playerRefs.forEach((playerRef, index) => {
            if (playerRef?.current) {
                playerRef.current.setOnAudioReady((audioElement: HTMLAudioElement) =>
                    setupAudioContext(audioElement, index)
                );
            }
        });
    }, [playerRefs]);

    useEffect(() => {
        channelEQs.forEach((channelEQ, index) => {
            const filters = audioFiltersRef.current[index];
            if (filters) {
                filters.low.gain.value = channelEQ.low;
                filters.mid.gain.value = channelEQ.mid;
                filters.hi.gain.value = channelEQ.hi;

                const minFreq = 200;
                const maxFreq = 20000;
                const normalizedValue = (channelEQ.filter + 20) / 40;
                filters.filter.frequency.value = minFreq + (normalizedValue * (maxFreq - minFreq));
            }
        });
    }, [channelEQs]);

    const updateChannelEQ = (channelIndex: number, eqType: keyof ChannelEQValues, value: number) => {
        setChannelEQs(prev => prev.map((channelEQ, index) =>
            index === channelIndex
                ? { ...channelEQ, [eqType]: value }
                : channelEQ
        ));
    };

    const handleSetVolume = (e: React.ChangeEvent<HTMLInputElement>, playerRef: RefObject<DJPlayer>) => {
        const newVolume = parseFloat(e.target.value);

        if(playerRef.current?.audioRef) {
            playerRef.current.audioRef.volume = newVolume;
        }
    }

    return(
        <>
            <div className="center">
                <div className="mixer">
                    {playerRefs.map((ref, index) => (
                        <div className="channel">
                            <Knob size={45} valueColor="darkorange" rangeColor="black" value={channelEQs[index]?.low ?? 0} min={-20} max={20} valueTemplate={'low'} onChange={(e) => updateChannelEQ(index, 'low', e.value)} />
                            <Knob size={45} valueColor="darkorange" rangeColor="black" value={channelEQs[index]?.mid ?? 0} min={-20} max={20} valueTemplate={'mid'} onChange={(e) => updateChannelEQ(index, 'mid', e.value)} />
                            <Knob size={45} valueColor="darkorange" rangeColor="black" value={channelEQs[index]?.hi ?? 0} min={-20} max={20} valueTemplate={'hi'} onChange={(e) => updateChannelEQ(index, 'hi', e.value)} />
                            <Knob size={45} valueColor="darkorange" rangeColor="black" value={channelEQs[index]?.filter ?? 0} min={-20} max={20} valueTemplate={'filter'} onChange={(e) => updateChannelEQ(index, 'filter', e.value)}/>
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
                                    onChange={(e) => handleSetVolume(e, ref)}
                                />
                            </div>
                        </div>
                    ))}
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