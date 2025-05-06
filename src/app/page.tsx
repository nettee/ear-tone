"use client";

import * as Tone from "tone";
import { useRef, useState } from "react";
import { Chord, ChordQuality, ChordInversion } from "@/lib/chord";

export default function Home() {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentChord, setCurrentChord] = useState<Chord>(
    new Chord("C", "major", 0)
  );
  
  const startSound = () => {
    // Create synth if it doesn't exist
    if (!synthRef.current) {
      synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    }
    // Start the audio context (needed for browsers)
    Tone.start();
    // Play the chord
    const notes = currentChord.getNotes();
    synthRef.current.triggerAttack(notes);
  };
  
  const stopSound = () => {
    // Release all notes if synth exists
    if (synthRef.current) {
      const notes = currentChord.getNotes();
      synthRef.current.triggerRelease(notes);
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const changeChord = () => {
    // Example: randomly select a root note, quality, and inversion
    const roots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const qualities: ChordQuality[] = ['major', 'minor'];
    const inversions: ChordInversion[] = [0, 1, 2];
    
    const randomRoot = roots[Math.floor(Math.random() * roots.length)];
    const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
    const randomInversion = inversions[Math.floor(Math.random() * inversions.length)];
    
    setCurrentChord(new Chord(randomRoot, randomQuality, randomInversion));
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
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
