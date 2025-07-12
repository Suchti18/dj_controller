import './App.css'
import {useRef, useState} from "react";
import * as React from "react";
import {parseBlob} from "music-metadata-browser";

function App() {
    const inputRef = useRef(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);

    const inputRef2 = useRef(null);
    const audioRef2 = useRef<HTMLAudioElement>(null);
    const [audioSrc2, setAudioSrc2] = useState<string | null>(null);
    const [isPlaying2, setIsPlaying2] = useState(false);
    const [coverUrl2, setCoverUrl2] = useState<string | null>(null);

    const handlePlay = (deck: "left" | "right") => {
        if(deck === "left") {
            if(audioRef.current?.paused) {
                audioRef.current?.play();
                setIsPlaying(true);
            } else {
                audioRef.current?.pause();
                setIsPlaying(false);

                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                }
            }
        } else {
            if(audioRef2.current?.paused) {
                audioRef2.current?.play();
                setIsPlaying2(true);
            } else {
                audioRef2.current?.pause();
                setIsPlaying2(false);

                if (audioRef2.current) {
                    audioRef2.current.currentTime = 0;
                }
            }
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if(e.currentTarget.parentElement?.className === "left") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            inputRef.current?.click();
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            inputRef2.current?.click();
        }
    };

    const generateThumbnail = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const video = document.createElement("video");

            video.src = URL.createObjectURL(file);
            video.crossOrigin = "anonymous";
            video.muted = true;
            video.currentTime = 1; // Sekunde 1 (falls genug geladen)

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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, deck: 'left' | 'right') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (deck === 'left') {
            setIsPlaying(false);
        } else {
            setIsPlaying2(false);
        }

        const url = URL.createObjectURL(file);
        if (deck === 'left') {
            setAudioSrc(url);
        } else {
            setAudioSrc2(url);
        }

        const metadata = await parseBlob(file);
        const picture = metadata.common.picture?.[0];

        if (picture) {
            const blob = new Blob([picture.data], { type: picture.format });
            const url = URL.createObjectURL(blob);

            if (deck === 'left') {
                setCoverUrl(url);
            } else {
                setCoverUrl2(url);
            }
        } else if (file.type.startsWith("video/")) {
            const thumb = await generateThumbnail(file);
            if (deck === 'left') {
                setCoverUrl(thumb);
            } else {
                setCoverUrl2(thumb);
            }
        } else {
            if (deck === 'left') {
                setCoverUrl(null);
            } else {
                setCoverUrl2(null);
            }
        }

        if (deck === 'left') {
            audioRef.current?.addEventListener('ended', () => setIsPlaying(false));
        } else {
            audioRef2.current?.addEventListener('ended', () => setIsPlaying2(false));
        }
    };

    const handleSetTempo = (e: React.ChangeEvent<HTMLInputElement>, deck: "left" | "right") => {
        const newTempo = parseFloat(e.target.value);

        if(deck === "left") {
            if(audioRef.current) {
                audioRef.current.playbackRate = newTempo;
            }
        } else {
            if(audioRef2.current) {
                audioRef2.current.playbackRate = newTempo;
            }
        }
    };

    const handleSetVolume = (e: React.ChangeEvent<HTMLInputElement>, deck: "left" | "right") => {
        const newVolume = parseFloat(e.target.value);

        if(deck === "left") {
            if(audioRef.current) {
                audioRef.current.volume = newVolume;
            }
        } else {
            if(audioRef2.current) {
                audioRef2.current.volume = newVolume;
            }
        }
    }

    return (
    <>
      <div className="controller">
          <div className="left">
              <div className={`jogwheel ${coverUrl && isPlaying ? 'spin' : ''} ${coverUrl ? 'loaded' : ''}`} onClick={(e) => handleClick(e)}>
                  <input type="file" accept="video/*, audio/*" ref={inputRef} onChange={(e) => handleFileChange(e, "left")} className="hidden"/>

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
                      <div className="queButton">
                          Que
                      </div>
                      <div className={`startButton ${!isPlaying && audioRef.current ? 'startButtonBlink' : ''}`} onClick={() => handlePlay("left")}>
                          Play
                      </div>
                  </div>
                  <div className="fxButtons">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                  </div>
                  <div className="tempoSlider">
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
                          onChange={(e) => handleSetVolume(e, "left")}
                      />
                  </div>
              </div>
          </div>
          <div className="center">
              <div className="mixer">
                  <div className="channel">
                      <div className="hi"/>
                      <div className="mid"/>
                      <div className="low"/>
                      <div className="cfx"/>
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
                              max="2.0"
                              step="0.01"
                              onChange={(e) => handleSetVolume(e, "left")}
                          />
                      </div>
                  </div>
                  <div className="channel">
                      <div className="hi"/>
                      <div className="mid"/>
                      <div className="low"/>
                      <div className="cfx"/>
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
                              max="2.0"
                              step="0.01"
                              onChange={(e) => handleSetTempo(e, "right")}
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
          <div className="right">
              <div className={`jogwheel ${coverUrl2 && isPlaying2 ? 'spin' : ''} ${coverUrl2 ? 'loaded' : ''}`} onClick={(e) => handleClick(e)}>
                  <input type="file" accept="video/*, audio/*" ref={inputRef2} onChange={(e) => handleFileChange(e, "right")} className="hidden"/>

                  {coverUrl2 && (
                      <img src={coverUrl2} alt="Cover" className="w-48 h-48 object-cover rounded" />
                  )}

                  {audioSrc2 && (
                      <audio src={audioSrc2} ref={audioRef2} className="hidden">
                          Dein Browser unterstützt kein Audio.
                      </audio>
                  )}

              </div>
              <div className="controls">
                  <div className="startMusicButtons">
                      <div className="queButton">
                          Que
                      </div>
                      <div className={`startButton ${!isPlaying2 && audioRef2.current ? 'startButtonBlink' : ''}`} onClick={() => handlePlay("right")}>
                          Play
                      </div>
                  </div>
                  <div className="fxButtons">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                  </div>
                  <div className="tempoSlider">
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
                          onChange={(e) => handleSetTempo(e, "right")}
                      />
                  </div>
              </div>
          </div>
      </div>
    </>
  )
}

export default App
