"use client";

import { useState } from "react";
import { Chord, createDefaultChord, createRandomChord, ChordQuality, ChordInversion } from "@/lib/chord";
import { playChord, stopChord } from "@/lib/sound";

// 中文和弦品质名称
const QUALITY_NAMES_ZH: Record<ChordQuality, string> = {
    major: '大三',
    minor: '小三',
    diminished: '减三',
    augmented: '增三',
    sus2: 'sus2',
    sus4: 'sus4',
};

// 中文转位名称
const INVERSION_NAMES_ZH: Record<ChordInversion, string> = {
    0: '原位',
    1: '第一转位',
    2: '第二转位',
};

// 获取和弦全名
function getChordFullName(chord: Chord): string {
    const root = chord.getRoot();
    const quality = chord.getQuality();
    const inversion = chord.getInversion();
    
    return `${root}${QUALITY_NAMES_ZH[quality]}和弦 - ${INVERSION_NAMES_ZH[inversion]}`;
}

export function ChordPlayer() {
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

            <div className="h-16 flex items-center justify-center">
                {showAnswer && (
                    <div className="p-4 bg-gray-100 rounded">
                        <p className="text-center font-semibold">{getChordFullName(currentChord)}</p>
                        <p className="text-center mt-1">{currentChord.getNotes().join(' ')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}