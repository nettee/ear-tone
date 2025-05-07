// 音符到MIDI编号的映射（不含八度）
const NOTE_TO_MIDI: Record<string, number> = {
    'C': 0, 'C#': 1, 'Db': 1,
    'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'Fb': 4, 'E#': 5,
    'F': 5, 'F#': 6, 'Gb': 6,
    'G': 7, 'G#': 8, 'Ab': 8,
    'A': 9, 'A#': 10, 'Bb': 10,
    'B': 11, 'Cb': 11, 'B#': 0
};

// MIDI编号到音符的映射（升号和降号表示法）
const MIDI_TO_NOTE_SHARP: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const MIDI_TO_NOTE_FLAT: string[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// 和弦的音程间隔（相对于根音的半音数）
const CHORD_INTERVALS = {
    major: [0, 4, 7], // 大三和弦（根音，大三度，纯五度）
    minor: [0, 3, 7], // 小三和弦（根音，小三度，纯五度）
    diminished: [0, 3, 6], // 减三和弦
    augmented: [0, 4, 8], // 增三和弦
    sus2: [0, 2, 7], // 挂二和弦
    sus4: [0, 5, 7], // 挂四和弦
};

// 将音符名称转换为MIDI编号
function noteToMidi(noteName: string): number {
    let note: string;
    let octave: number;

    note = noteName.slice(0, -1); // 获取不带八度的音符
    octave = parseInt(noteName.slice(-1)); // 获取八度

    if (!(note in NOTE_TO_MIDI)) {
        throw new Error(`无效的音符名称: ${note}`);
    }

    // MIDI标准：C-1 = 0, C0 = 12, C1 = 24, ..., C4 = 60
    return NOTE_TO_MIDI[note] + ((octave + 1) * 12);
}

// 将MIDI编号转换为音符名称
function midiToNote(midiNumber: number, preferFlat: boolean = false): string {
    const octave = Math.floor(midiNumber / 12) - 1;
    const noteIndex = midiNumber % 12;
    const noteArray = preferFlat ? MIDI_TO_NOTE_FLAT : MIDI_TO_NOTE_SHARP;
    return `${noteArray[noteIndex]}${octave}`;
}

export type ChordQuality = 'major' | 'minor' | 'diminished' | 'augmented' | 'sus2' | 'sus4';
export type ChordInversion = 0 | 1 | 2; // 0 = 原位, 1 = 第一转位, 2 = 第二转位

export class Chord {
    rootNote: string;
    quality: ChordQuality;
    inversion: ChordInversion;
    rootMidi: number;

    constructor(
        root: string,
        quality: ChordQuality = 'major',
        inversion: ChordInversion = 0
    ) {
        // 检查是否提供了八度信息，如果没有，默认添加第4八度
        if (!/\d$/.test(root)) {
            root = `${root}4`;
        }

        this.rootNote = root;
        this.quality = quality;
        this.inversion = inversion;
        
        // 检查根音是否有效
        if (!(root.slice(0, -1) in NOTE_TO_MIDI)) {
            throw new Error(`无效的根音: ${root}`);
        }
        
        // 计算根音的MIDI编号
        this.rootMidi = noteToMidi(root);
    }

    // 获取根音
    getRoot(): string {
        return this.rootNote;
    }

    // 获取和弦类型
    getQuality(): ChordQuality {
        return this.quality;
    }

    // 获取和弦转位
    getInversion(): ChordInversion {
        return this.inversion;
    }

    // 获取和弦中的音符（考虑转位）
    getNotes(): string[] {
        // 获取当前和弦类型的音程
        const intervals = CHORD_INTERVALS[this.quality];
        
        // 计算和弦中各音的MIDI编号
        let midiNotes = intervals.map(interval => this.rootMidi + interval);
        
        // 应用转位
        for (let i = 0; i < this.inversion; i++) {
            const first = midiNotes.shift() as number;
            midiNotes.push(first + 12); // 移至高八度
        }
        
        // 调整和弦位置，保证在合理的音域范围内
        // 理想范围：最低音在C3(48)和C4(60)之间
        let lowestNote = midiNotes[0];
        
        // 如果最低音高于C4，逐渐降低八度，直到最低音处于理想范围内
        while (lowestNote > 60) {
            midiNotes = midiNotes.map(note => note - 12);
            lowestNote = midiNotes[0];
        }
        
        // 如果最低音低于C3，逐渐升高八度，直到最低音处于理想范围内
        while (lowestNote < 48) {
            midiNotes = midiNotes.map(note => note + 12);
            lowestNote = midiNotes[0];
        }
        
        // 确定是否使用降号表示
        // 规则：1. 根音带降号则使用降号 2. 根音带升号则使用升号 3. 根音无升降号时，大三和弦用升号，小三和弦用降号
        const rootNoteName = this.rootNote.slice(0, -1); // 不带八度的根音名称
        let useFlat = false;
        
        if (rootNoteName.includes('b')) {
            // 根音使用降号
            useFlat = true;
        } else if (rootNoteName.includes('#')) {
            // 根音使用升号
            useFlat = false;
        } else {
            // 根音不含升降号，根据和弦类型决定
            useFlat = this.quality === 'minor' || this.quality === 'diminished';
        }
        
        // 将MIDI编号转换回音符名称
        return midiNotes.map(midiNote => midiToNote(midiNote, useFlat));
    }
}

/**
 * 创建默认和弦（C大三和弦原位）
 */
export function createDefaultChord(): Chord {
    return new Chord("C", "major", 0);
}

/**
 * 生成随机和弦
 * @param qualityOptions - 可选的和弦类型数组
 * @param inversionOptions - 可选的转位数组
 * @returns 一个新的随机和弦实例
 */
export function createRandomChord(
    qualityOptions: ChordQuality[] = ['major', 'minor'],
    inversionOptions: ChordInversion[] = [0, 1, 2]
): Chord {
    // 可用的根音
    const roots = Object.keys(NOTE_TO_MIDI)
        .filter(note => !note.includes("b")); // 使用升号表示法，避免重复

    const randomRoot = roots[Math.floor(Math.random() * roots.length)];
    const randomQuality = qualityOptions[Math.floor(Math.random() * qualityOptions.length)];
    const randomInversion = inversionOptions[Math.floor(Math.random() * inversionOptions.length)];

    return new Chord(randomRoot, randomQuality, randomInversion);
}