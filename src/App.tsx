import './App.css'
import {useRef, useState} from "react";
import * as React from "react";

function App() {
    const inputRef = useRef(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);

    const handlePlay = () => {
        if(audioRef.current?.paused) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    };

    const handleClick = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        inputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAudioSrc(url);
        }
    };

    return (
    <>
      <div className="controller">
          <div className="left">
              <div className="jogwheel" onClick={handleClick}>
                  <input type="file" accept="video/*, audio/*" ref={inputRef} onChange={handleFileChange} className="hidden"/>

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
                          min="-1"
                          max="1"
                          value="0"
                          step="0.01"
                          data-action="volume"
                          onChange={console.log}
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
