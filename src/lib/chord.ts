// Root notes (C, D, E, etc)
const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Semitone intervals for different chord qualities
const CHORD_INTERVALS = {
  major: [0, 4, 7], // Major triad (Root, Major 3rd, Perfect 5th)
  minor: [0, 3, 7], // Minor triad (Root, Minor 3rd, Perfect 5th)
  diminished: [0, 3, 6], // Diminished triad
  augmented: [0, 4, 8], // Augmented triad
  sus2: [0, 2, 7], // Suspended 2nd
  sus4: [0, 5, 7], // Suspended 4th
};

// Chinese chord quality names
const QUALITY_NAMES_ZH = {
  major: '大三',
  minor: '小三',
  diminished: '减三',
  augmented: '增三',
  sus2: 'sus2',
  sus4: 'sus4',
};

// Chinese inversion names
const INVERSION_NAMES_ZH = {
  0: '原位',
  1: '第一转位',
  2: '第二转位',
};

// Translate note index to actual note with octave
function getNote(rootIndex: number, interval: number, octave: number): string {
  const noteIndex = (rootIndex + interval) % 12;
  const octaveShift = Math.floor((rootIndex + interval) / 12);
  return `${ROOT_NOTES[noteIndex]}${octave + octaveShift}`;
}

// Calculate MIDI note number (C4 = 60)
function getMidiNoteNumber(noteName: string): number {
  const note = noteName.slice(0, -1); // Get note without octave
  const octave = parseInt(noteName.slice(-1)); // Get octave
  const noteIndex = ROOT_NOTES.indexOf(note);
  
  // In MIDI standard: C-1 = 0, C0 = 12, C1 = 24, ..., C4 = 60
  return noteIndex + ((octave + 1) * 12);
}

export type ChordQuality = 'major' | 'minor' | 'diminished' | 'augmented' | 'sus2' | 'sus4';
export type ChordInversion = 0 | 1 | 2; // 0 = root position, 1 = first inversion, 2 = second inversion

export class Chord {
  root: string;
  quality: ChordQuality;
  inversion: ChordInversion;

  constructor(
    root: string, 
    quality: ChordQuality = 'major', 
    inversion: ChordInversion = 0
  ) {
    this.root = root;
    this.quality = quality;
    this.inversion = inversion;
  }

  // Get the root note index
  private getRootIndex(): number {
    return ROOT_NOTES.indexOf(this.root);
  }

  // Get notes in the chord with proper inversions
  getNotes(): string[] {
    const rootIndex = this.getRootIndex();
    if (rootIndex === -1) {
      console.error(`Invalid root note: ${this.root}`);
      return [];
    }

    // Get the intervals for this chord quality
    const intervals = CHORD_INTERVALS[this.quality];
    
    // Apply the inversion to the intervals
    const invertedIntervals = [...intervals];
    for (let i = 0; i < this.inversion; i++) {
      const first = invertedIntervals.shift() as number;
      invertedIntervals.push(first + 12); // Move to the next octave
    }
    
    // Start with octave 4 (middle C)
    let baseOctave = 4;
    
    // Generate notes with initial octave
    let notes = invertedIntervals.map(interval => 
      getNote(rootIndex, interval, baseOctave)
    );
    
    // Calculate MIDI note number for the lowest note (first note after inversion)
    const lowestNote = notes[0];
    const lowestNoteMidi = getMidiNoteNumber(lowestNote);
    
    // C3 = 48, C4 = 60
    if (lowestNoteMidi > 60) {
      // If the lowest note is higher than C4, decrease the octave
      baseOctave = 3;
      notes = invertedIntervals.map(interval => 
        getNote(rootIndex, interval, baseOctave)
      );
    } else if (lowestNoteMidi < 48) {
      // If the lowest note is lower than C3, increase the octave
      baseOctave = 4;
      notes = invertedIntervals.map(interval => 
        getNote(rootIndex, interval, baseOctave)
      );
    }
    
    return notes;
  }

  // Get display text for the chord (e.g., "C - 原位")
  getDisplayText(language: 'zh' | 'en' = 'zh'): string {
    if (language === 'zh') {
      return `${this.root} - ${INVERSION_NAMES_ZH[this.inversion]}`;
    } else {
      const inversionNames = {
        0: 'Root Position',
        1: '1st Inversion',
        2: '2nd Inversion',
      };
      return `${this.root} - ${inversionNames[this.inversion]}`;
    }
  }

  // Get full chord name (e.g., "C大三和弦")
  getFullName(language: 'zh' | 'en' = 'zh'): string {
    if (language === 'zh') {
      return `${this.root}${QUALITY_NAMES_ZH[this.quality]}和弦 - ${INVERSION_NAMES_ZH[this.inversion]}`;
    } else {
      const qualityNames = {
        major: 'Major',
        minor: 'Minor',
        diminished: 'Diminished',
        augmented: 'Augmented',
        sus2: 'Sus2',
        sus4: 'Sus4',
      };
      const inversionNames = {
        0: 'Root Position',
        1: '1st Inversion',
        2: '2nd Inversion',
      };
      return `${this.root} ${qualityNames[this.quality]} - ${inversionNames[this.inversion]}`;
    }
  }
} 

// Utility functions for creating chords

/**
 * Creates a default chord (C major in root position)
 */
export function createDefaultChord(): Chord {
  return new Chord("C", "major", 0);
}

/**
 * Generates a random chord
 * @param qualityOptions - Optional array of chord qualities to choose from
 * @param inversionOptions - Optional array of inversions to choose from
 * @returns A new random Chord instance
 */
export function createRandomChord(
  qualityOptions: ChordQuality[] = ['major', 'minor'],
  inversionOptions: ChordInversion[] = [0, 1, 2]
): Chord {
  const roots = ROOT_NOTES;
  
  const randomRoot = roots[Math.floor(Math.random() * roots.length)];
  const randomQuality = qualityOptions[Math.floor(Math.random() * qualityOptions.length)];
  const randomInversion = inversionOptions[Math.floor(Math.random() * inversionOptions.length)];
  
  return new Chord(randomRoot, randomQuality, randomInversion);
} 