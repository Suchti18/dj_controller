import './App.css'
import {useRef, useState} from "react";
import * as React from "react";
import {parseBlob} from "music-metadata-browser";

function App() {
    const inputRef = useRef(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);

    const handlePlay = () => {
        if(audioRef.current?.paused) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();

            if (audioRef.current) {
                audioRef.current.currentTime = 0;
            }
        }
    };

    const handleClick = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        inputRef.current?.click();
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file) {
            const url = URL.createObjectURL(file);
            setAudioSrc(url);
        }

        const metadata = await parseBlob(file);
        const picture = metadata.common.picture?.[0];
        if (picture) {
            const blob = new Blob([picture.data], { type: picture.format });
            const url = URL.createObjectURL(blob);
            console.log("cover")
            setCoverUrl(url);
        } else {
            if (file.type.startsWith("video/")) {
                const thumb = await generateThumbnail(file);
                setCoverUrl(thumb);
            } else {
                console.log("no cover")
                setCoverUrl(null);
            }
        }
    };

    const handleSetTempo = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTempo = parseFloat(event.target.value);
        if (audioRef.current) {
            audioRef.current.playbackRate = newTempo;
        }
    };

    return (
    <>
      <div className="controller">
          <div className="left">
              <div className="jogwheel" onClick={handleClick}>
                  <input type="file" accept="video/*, audio/*" ref={inputRef} onChange={handleFileChange} className="hidden"/>

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
                      <div className="startButton" onClick={handlePlay}>
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
                      <input
                          type="range"
                          min="0.5"
                          defaultValue="1.0"
                          max="2.0"
                          step="0.01"
                          data-action="volume"
                          onChange={handleSetTempo}
                      />
                  </div>
              </div>
          </div>
          <div className="center">
              <div className="mixer">
                  <div className="channel">

                  </div>
                  <div className="channel">

                  </div>
              </div>
              <div className="positionSlider">

              </div>
          </div>
          <div className="right">
              <div className="jogwheel">

              </div>
              <div className="controls">
                  <div className="startMusicButtons">
                      <div className="queButton">

                      </div>
                      <div className="startButton">

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

                  </div>
              </div>
          </div>
      </div>
    </>
  )
}

export default App
