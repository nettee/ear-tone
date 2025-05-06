"use client";

import { useState } from "react";
import { Chord, createDefaultChord, createRandomChord } from "@/lib/chord";
import { playChord, stopChord } from "@/lib/sound";

export default function Home() {
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentChord, setCurrentChord] = useState<Chord>(createDefaultChord());
  
  const startSound = () => {
    playChord(currentChord);
  };
  
  const stopSound = () => {
    stopChord(currentChord);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const changeChord = () => {
    setCurrentChord(createRandomChord());
    setShowAnswer(false);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <div className="flex flex-col items-center gap-4">
        <button 
          onMouseDown={startSound}
          onMouseUp={stopSound}
          onMouseLeave={stopSound}
          onTouchStart={startSound}
          onTouchEnd={stopSound}
          onTouchCancel={stopSound}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 touch-none select-none"
        >
          Press and Hold
        </button>
        
        <button
          onClick={toggleAnswer}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          显示答案
        </button>
        
        <button
          onClick={changeChord}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          换个和弦
        </button>
      </div>
      
      <div className="h-16 flex items-center justify-center">
        {showAnswer && (
          <div className="p-4 bg-gray-100 rounded">
            <p className="text-center font-semibold">{currentChord.getFullName()}</p>
            <p className="text-center mt-1">{currentChord.getNotes().join(' ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
