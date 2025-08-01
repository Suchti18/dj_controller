import './Mixer.css'
import * as React from "react";
import {RefObject, useEffect, useRef, useState} from "react";
import {Knob} from 'primereact/knob';
import {DJPlayer} from "./Player.tsx";
import Fader from "./utils/Fader.tsx";

interface DJMixer {
    playerRefs: RefObject<DJPlayer>[];
}

interface ChannelEQValues {
    low: number;
    mid: number;
    hi: number;
    filter: number;
    mainGain: number;
    crossfadeGain: number;
}

export const Mixer = ({ playerRefs }: DJMixer) => {
    const [channelEQs, setChannelEQs] = useState<ChannelEQValues[]>(() =>
        playerRefs.map(() => ({ low: 0, mid: 0, hi: 0, filter: 0, mainGain: 1, crossfadeGain: 1 }))
    );

    const audioFiltersRef = useRef<{
        low: BiquadFilterNode;
        mid: BiquadFilterNode;
        hi: BiquadFilterNode;
        filter: BiquadFilterNode;
        mainGain: GainNode;
        crossfadeGain: GainNode;
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
            filter.type = "allpass"
            filter.connect(hi);

            const mainGain = audioCtx.createGain()
            mainGain.gain.value = 1
            mainGain.connect(filter)

            const crossfadeGain = audioCtx.createGain()
            crossfadeGain.gain.value = 1
            crossfadeGain.connect(mainGain)

            const sourceNode = audioCtx.createMediaElementSource(audioElement);
            sourceNode.connect(crossfadeGain);

            audioFiltersRef.current[channelIndex] = {
                low,
                mid,
                hi,
                filter,
                mainGain,
                crossfadeGain
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
                const sliderMax = 20;

                const absValue = Math.abs(channelEQ.filter);
                const normalized = absValue / sliderMax; // ∈ [0, 1]
                const logMin = Math.log10(minFreq);
                const logMax = Math.log10(maxFreq);

                let logFreq;
                if (channelEQ.filter < 0) {
                    filters.filter.type = "lowpass";
                    logFreq = logMax - normalized * (logMax - logMin);
                } else if (channelEQ.filter > 0) {
                    filters.filter.type = "highpass";
                    logFreq = logMin + normalized * (logMax - logMin);
                } else {
                    filters.filter.type = "allpass";
                    filters.filter.frequency.value = maxFreq;
                    return;
                }

                filters.filter.frequency.value = Math.pow(10, logFreq);
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

    const handleSetVolume = (channelIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);

        const filters = audioFiltersRef.current[channelIndex];

        if (!filters) return

        filters.mainGain.gain.value = value
    }

    const crossfade = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);

        // https://github.com/cwilso/wubwubwub/blob/MixTrack/js/dj.js#L13-L14
        const gain1 = Math.cos(value * 0.5 * Math.PI);
        const gain2 = Math.cos((1.0-value) * 0.5 * Math.PI);

        const leftFilters = audioFiltersRef.current[0];
        const rightFilters = audioFiltersRef.current[1];

        if (!leftFilters || !rightFilters) return;

        leftFilters.crossfadeGain.gain.value = gain1;
        rightFilters.crossfadeGain.gain.value = gain2
    }

    return(
        <>
            <div className="center">
                <div className="mixer">
                    {playerRefs.map((_ref, index) => (
                        <div className="channel">
                            <Knob size={45} valueColor="darkorange" rangeColor="black" value={channelEQs[index]?.low ?? 0} min={-20} max={20} valueTemplate={'low'} onChange={(e) => updateChannelEQ(index, 'low', e.value)} />
                            <Knob size={45} valueColor="darkorange" rangeColor="black" value={channelEQs[index]?.mid ?? 0} min={-20} max={20} valueTemplate={'mid'} onChange={(e) => updateChannelEQ(index, 'mid', e.value)} />
                            <Knob size={45} valueColor="darkorange" rangeColor="black" value={channelEQs[index]?.hi ?? 0} min={-20} max={20} valueTemplate={'hi'} onChange={(e) => updateChannelEQ(index, 'hi', e.value)} />
                            <Knob size={45} valueColor="darkorange" rangeColor="black" value={channelEQs[index]?.filter ?? 0} min={-20} max={20} valueTemplate={'filter'} onChange={(e) => updateChannelEQ(index, 'filter', e.value)}/>
                            <div className="volumeSlider">
                                <Fader tickAmount={5} alignment={"vertical"} onChange={(e) => handleSetVolume(index, e)} max={1} min={0} defaultValue={1} step={0.01}/>
                            </div>
                        </div>
                    ))}
                </div>
                <Fader tickAmount={5} alignment={"horizontal"} onChange={(e) => crossfade(e)} max={1} min={0} defaultValue={0.5} step={0.01}/>
            </div>
        </>
    )
}

export default Mixer