import './Player.css'
import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import * as React from "react";
import {parseBlob} from "music-metadata-browser";
import Fader from "../../utils/Controls/Fader.tsx";
import purpleFallbackCover from '../../../assets/purple-cover.png';
import PerformancePads from "../../utils/PerformancePads.tsx";

export interface DJPlayer {
    // Refs
    inputRef: HTMLInputElement | null;
    audioRef: HTMLAudioElement | null;

    // State getters
    getAudioSrc: () => string | null;
    getIsPlaying: () => boolean;
    getCoverUrl: () => string | null;

    // State setters
    setIsPlaying: (playing: boolean) => void;
    setAudioSrc: (src: string | null) => void;
    setCoverUrl: (url: string | null) => void;

    // Callback
    setOnAudioReady: (callback: (audioElement: HTMLAudioElement) => void) => void;
}

interface DJPlayerProps {
    side?: "left" | "right" | "none";
}

const Player = forwardRef<DJPlayer, DJPlayerProps>(({ side = "none" }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [onAudioReadyCallback, setOnAudioReadyCallback] = useState<((audioElement: HTMLAudioElement) => void) | null>(null);
    const [quePosition, setQuePosition] = useState<number | null>(null);

    const handlePlay = () => {
        if(audioRef.current?.paused) {
            audioRef.current?.play().then(() => setIsPlaying(true));
        } else {
            audioRef.current?.pause();
            setIsPlaying(false);

            if (audioRef.current) {
                audioRef.current.currentTime = 0;
            }
        }
    };

    const handleQue = () => {
        if(audioRef.current) {
            setQuePosition(audioRef.current.currentTime)
            console.log(quePosition)
        }
    }

    const handleClick = () => {
        inputRef.current?.click();
    };

    const getThumbnail = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const video = document.createElement("video");

            video.src = URL.createObjectURL(file);
            video.crossOrigin = "anonymous";
            video.muted = true;
            video.currentTime = 1;

            video.onloadeddata = () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageUrl = canvas.toDataURL("image/jpeg");
                    resolve(imageUrl);
                } else {
                    resolve("");
                }
            };
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsPlaying(false);

        const url = URL.createObjectURL(file);
        setAudioSrc(url);

        // Cover
        try {
            const metadata = await parseBlob(file);
            const picture = metadata.common.picture?.[0];

            if (picture) {
                const blob = new Blob([picture.data], { type: picture.format });
                const url = URL.createObjectURL(blob);

                setCoverUrl(url);
            } else if (file.type.startsWith("video/")) {
                const thumb = await getThumbnail(file);
                setCoverUrl(thumb);
            } else {
                setCoverUrl(purpleFallbackCover);
            }
        } catch {
            setCoverUrl(purpleFallbackCover);
        }

        if(audioRef.current) {
            if(onAudioReadyCallback) {
                onAudioReadyCallback(audioRef.current);
            }

            audioRef.current?.addEventListener('ended', () => setIsPlaying(false));
        }
    };

    const handleSetTempo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTempo = parseFloat(e.target.value);

        if(audioRef.current) {
            audioRef.current.playbackRate = newTempo;
        }
    };

    useImperativeHandle(ref, () => ({
        // Refs
        inputRef: inputRef.current,
        audioRef: audioRef.current,

        // State getters
        getAudioSrc: () => audioSrc,
        getIsPlaying: () => isPlaying,
        getCoverUrl: () => coverUrl,

        // State setters
        setIsPlaying,
        setAudioSrc,
        setCoverUrl,

        setOnAudioReady: (callback: (audioElement: HTMLAudioElement) => void) => {
            setOnAudioReadyCallback(() => callback);
        },
    }), [audioSrc, isPlaying, coverUrl]);

    return (
    <>
      <div className={`${side === "none" ? "" : side}`}>
          <div className={`jogwheel ${coverUrl && isPlaying ? 'spin' : ''} ${coverUrl ? 'loaded' : ''}`} onClick={handleClick}>
              <input type="file" accept="video/*, audio/*" ref={inputRef} onChange={(e) => handleFileChange(e)} className="hidden"/>

              {coverUrl && (
                  <img src={coverUrl} alt="Cover" className="w-48 h-48 object-cover rounded" />
              )}

              {audioSrc && (
                  <audio src={audioSrc} ref={audioRef} className="hidden">
                      Dein Browser unterstützt kein Audio.
                  </audio>
              )}

          </div>
          <div className="controls">
              <div className="startMusicButtons">
                  <div
                      className={`queButton ${!isPlaying && audioRef.current ? 'queButtonBlink' : ''}`}
                      onClick={handleQue}
                      onMouseDown={handleQue}
                      onMouseUp={handleQue}
                      onMouseLeave={handleQue}
                  >
                      Que
                  </div>
                  <div
                      className={`startButton ${!isPlaying && audioRef.current ? 'startButtonBlink' : ''}`}
                      onClick={handlePlay}
                  >
                      Play
                  </div>
              </div>
              <PerformancePads amount={8}/>
              <Fader tickAmount={5} alignment={"vertical"} onChange={handleSetTempo} max={2} min={0} defaultValue={1} step={0.01}/>
          </div>
      </div>
    </>
  )
});

export default Player;
