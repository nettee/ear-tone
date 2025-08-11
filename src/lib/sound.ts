import * as Tone from "tone";
import { Chord } from "./chord";

// Synth instance that will be reused
let synth: Tone.Sampler | null = null;
let isLoaded = false;
let playbackTimer: NodeJS.Timeout | null = null;
let autoReleaseTimer: NodeJS.Timeout | null = null;
let isPlaying = false;

/**
 * Initialize and get the synth instance
 */
export function getSynth(): Tone.Sampler {
    if (!synth) {
        synth = new Tone.Sampler({
            urls: {
                C4: "C4.mp3",
                "D#4": "Eb4.mp3",
                "F#4": "Gb4.mp3",
                A4: "A4.mp3",
                C5: "C5.mp3",
                "D#5": "Eb5.mp3",
                "F#5": "Gb5.mp3",
                A5: "A5.mp3",
            },
            baseUrl: "https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/violin-mp3/",
            onload: () => {
                isLoaded = true;
                console.log("Violin samples loaded successfully");
            },
        }).toDestination();
    }
    return synth;
}

/**
 * Play a single iteration of the chord
 */
function playChordIteration(chord: Chord): void {
    if (!isPlaying) return; // Stop if not playing anymore

    // Clear any existing timers before setting new ones
    if (autoReleaseTimer) {
        clearTimeout(autoReleaseTimer);
        autoReleaseTimer = null;
    }
    if (playbackTimer) {
        clearTimeout(playbackTimer);
        playbackTimer = null;
    }

    const synthInstance = getSynth();
    const notes = chord.getNotes();
    
    // Release any currently playing notes to avoid volume doubling
    synthInstance.releaseAll();
    
    // Immediately start playing the chord
    synthInstance.triggerAttack(notes);
    
    // Schedule auto-release after 2.5 seconds
    autoReleaseTimer = setTimeout(() => {
        if (isPlaying) {
            synthInstance.triggerRelease(notes);
        }
    }, 2500);
    
    // Schedule the next iteration every 2.4 seconds
    playbackTimer = setTimeout(() => {
        playChordIteration(chord);
    }, 2400);
}

/**
 * Play a chord
 */
export function playChord(chord: Chord): void {
    // Create synth if it doesn't exist
    getSynth();

    // Start the audio context (needed for browsers)
    Tone.start();

    // Check if samples are loaded before playing
    if (!isLoaded) {
        console.warn("Violin samples are still loading, please wait...");
        return;
    }

    // Stop any current playback
    stopChord();

    // Set playing state
    isPlaying = true;

    // Start the looping playback
    playChordIteration(chord);
}

/**
 * Stop playing a chord
 */
export function stopChord(): void {
    // Set playing state to false to stop the loop
    isPlaying = false;

    // Clear all timers
    if (playbackTimer) {
        clearTimeout(playbackTimer);
        playbackTimer = null;
    }
    
    if (autoReleaseTimer) {
        clearTimeout(autoReleaseTimer);
        autoReleaseTimer = null;
    }

    // Release all notes immediately if synth exists
    if (synth) {
        synth.releaseAll();
    }
}

/**
 * Preload the synth samples
 */
export function preloadSamples(): void {
    // Initialize the synth to start loading samples
    getSynth();
}

/**
 * Check if samples are loaded
 */
export function isSamplesLoaded(): boolean {
    return isLoaded;
} 