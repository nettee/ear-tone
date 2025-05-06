import * as Tone from "tone";
import { Chord } from "./chord";

// Synth instance that will be reused
let synth: Tone.PolySynth | null = null;

/**
 * Initialize and get the synth instance
 */
export function getSynth(): Tone.PolySynth {
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth).toDestination();
  }
  return synth;
}

/**
 * Play a chord
 */
export function playChord(chord: Chord): void {
  // Create synth if it doesn't exist
  const synthInstance = getSynth();
  
  // Start the audio context (needed for browsers)
  Tone.start();
  
  // Play the chord
  const notes = chord.getNotes();
  synthInstance.triggerAttack(notes);
}

/**
 * Stop playing a chord
 */
export function stopChord(chord: Chord): void {
  // Release all notes if synth exists
  if (synth) {
    const notes = chord.getNotes();
    synth.triggerRelease(notes);
  }
} 