"use client";

import { useState, useEffect } from "react";
import { Chord, createDefaultChord, createRandomChord, ChordQuality, ChordInversion } from "@/lib/chord";
import { playChord, stopChord, preloadSamples, isSamplesLoaded } from "@/lib/sound";
import { PianoKeyboard } from "./PianoKeyboard";

// 和弦简写符号
const QUALITY_SYMBOLS: Record<ChordQuality, string> = {
    major: '',    // 大三和弦不需要额外符号
    minor: 'm',
    diminished: 'dim',
    augmented: 'aug',
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
    const root = chord.getRootName();
    const quality = chord.getQuality();
    const inversion = chord.getInversion();
    
    return `${root}${QUALITY_SYMBOLS[quality]} 和弦 - ${INVERSION_NAMES_ZH[inversion]}`;
}

export function ChordPlayer() {
    const [showAnswer, setShowAnswer] = useState(false);
    const [currentChord, setCurrentChord] = useState<Chord>(createDefaultChord());
    const [samplesLoaded, setSamplesLoaded] = useState(false);

    useEffect(() => {
        // Preload audio samples when the component mounts
        preloadSamples();
        
        // Check if samples are loaded every 500ms
        const checkInterval = setInterval(() => {
            if (isSamplesLoaded()) {
                setSamplesLoaded(true);
                clearInterval(checkInterval);
            }
        }, 500);

        return () => clearInterval(checkInterval);
    }, []);

    const startSound = () => {
        playChord(currentChord);
    };

    const stopSound = () => {
        stopChord();
    };

    const toggleAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    const changeChord = () => {
        setCurrentChord(createRandomChord());
        setShowAnswer(false);
    };

    // 答案内容组件
    const AnswerContent = () => {
        const chordNotes = currentChord.getNotes();
        
        return (
            <div className="w-full h-full flex flex-col justify-center items-center rounded-lg">
                <div className="max-w-md w-full">
                    <p className="text-xl text-center font-semibold mb-2">{getChordFullName(currentChord)}</p>
                    <p className="text-lg text-center mb-6">{chordNotes.join(' ')}</p>
                    
                    {/* 钢琴键盘 */}
                    <div className="mb-6">
                        <PianoKeyboard chordNotes={chordNotes} height={120} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full h-full">
            {/* 上方 3/4 高度，答案区域 */}
            <div className="w-full h-3/4 p-2">
                {showAnswer ? (
                    <AnswerContent />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <button
                            onClick={toggleAnswer}
                            className="px-6 py-3 bg-green-500 text-white rounded-lg touch-none select-none font-medium"
                        >
                            显示答案
                        </button>
                    </div>
                )}
            </div>
            
            {/* 下方 1/4 高度，操作区域 */}
            <div className="w-full h-1/4 flex items-center justify-center p-2">
                <div className="flex justify-center gap-10">
                    <button
                        onMouseDown={startSound}
                        onMouseUp={stopSound}
                        onMouseLeave={stopSound}
                        onTouchStart={startSound}
                        onTouchEnd={stopSound}
                        onTouchCancel={stopSound}
                        disabled={!samplesLoaded}
                        className={`px-6 py-3 text-white rounded-lg touch-none select-none font-medium ${
                            samplesLoaded 
                                ? 'bg-blue-500 hover:bg-blue-600' 
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {samplesLoaded ? '按住播放' : '加载中...'}
                    </button>

                    <button
                        onClick={changeChord}
                        className="px-6 py-3 bg-purple-500 text-white rounded-lg touch-none select-none font-medium"
                    >
                        换个和弦
                    </button>
                </div>
            </div>
        </div>
    );
}