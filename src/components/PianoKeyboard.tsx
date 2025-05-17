"use client";

import React from 'react';

// MIDI编号到音符的映射（升号表示法）
const MIDI_TO_NOTE_SHARP: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 定义钢琴键盘音符的数组，从C3(48)到A4(69)
const PIANO_KEYS = Array.from({ length: 22 }, (_, i) => {
    const midiNote = 48 + i; // 从 C3(48) 开始
    const noteIndex = midiNote % 12;
    const octave = Math.floor(midiNote / 12) - 1;
    const noteName = `${MIDI_TO_NOTE_SHARP[noteIndex]}${octave}`;
    const isBlack = [1, 3, 6, 8, 10].includes(noteIndex); // C#, D#, F#, G#, A# 是黑键
    
    return { midiNote, noteName, isBlack };
});

// 将音符名称转换为MIDI编号
function noteToMidi(noteName: string): number {
    const note: string = noteName.slice(0, -1); // 获取不带八度的音符
    const octave: number = parseInt(noteName.slice(-1)); // 获取八度
    
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

    // MIDI标准：C-1 = 0, C0 = 12, C1 = 24, ..., C4 = 60
    return NOTE_TO_MIDI[note] + ((octave + 1) * 12);
}

// 获取白键索引（仅计算白键）
function getWhiteKeyIndex(midiNote: number): number {
    const noteIndex = midiNote % 12;
    const octave = Math.floor(midiNote / 12) - 4; // 以C3为第0个八度
    
    // 计算白键索引
    let whiteKeyIndex;
    if (noteIndex === 0) whiteKeyIndex = 0; // C
    else if (noteIndex === 2) whiteKeyIndex = 1; // D
    else if (noteIndex === 4) whiteKeyIndex = 2; // E
    else if (noteIndex === 5) whiteKeyIndex = 3; // F
    else if (noteIndex === 7) whiteKeyIndex = 4; // G
    else if (noteIndex === 9) whiteKeyIndex = 5; // A
    else if (noteIndex === 11) whiteKeyIndex = 6; // B
    else return -1; // 黑键，返回-1
    
    return whiteKeyIndex + (octave * 7);
}

interface PianoKeyboardProps {
    /** 要高亮显示的和弦音符 */
    chordNotes: string[];
    /** 键盘高度 */
    height?: number;
}

export function PianoKeyboard({ chordNotes, height = 120 }: PianoKeyboardProps) {
    // 过滤出所有白键
    const whiteKeys = PIANO_KEYS.filter(key => !key.isBlack);
    
    // 检查MIDI音符是否在和弦中
    const isMidiNoteInChord = (midiNote: number): boolean => {
        // 将和弦音符转换为MIDI编号
        const chordMidiNotes = chordNotes.map(noteToMidi);
        return chordMidiNotes.includes(midiNote);
    };
    
    return (
        <div className="relative w-full" style={{ height: `${height}px` }}>
            {/* 白键容器 */}
            <div className="relative h-full w-full flex">
                {/* 白键 */}
                {whiteKeys.map((key) => (
                    <div
                        key={key.midiNote}
                        className={`relative h-full border border-gray-300 rounded-b-md flex-1 ${
                            isMidiNoteInChord(key.midiNote) 
                                ? 'bg-blue-500'
                                : 'bg-white'
                        }`}
                    >
                    </div>
                ))}
                
                {/* 黑键层 */}
                <div className="absolute inset-0 flex">
                    {PIANO_KEYS.filter(key => key.isBlack).map((key) => {
                        // 计算白键的宽度（总宽度除以白键数量）
                        const whiteKeyWidth = 100 / whiteKeys.length;
                        // 获取前一个白键的索引
                        const prevWhiteIndex = getWhiteKeyIndex(key.midiNote - 1);
                        
                        return (
                            <div 
                                key={key.midiNote} 
                                className={`absolute h-3/5 w-[5%] rounded-b-md ${
                                    isMidiNoteInChord(key.midiNote) 
                                        ? 'bg-blue-600'
                                        : 'bg-black'
                                }`}
                                style={{ 
                                    left: `${prevWhiteIndex * whiteKeyWidth + whiteKeyWidth * 0.7}%`,
                                    width: `${whiteKeyWidth * 0.6}%`,
                                    top: 0
                                }}
                            ></div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
} 