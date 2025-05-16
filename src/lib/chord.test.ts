import { Chord } from './chord';

describe('Chord.getNotes', () => {
  // 测试不同和弦类型（原位）
  test('返回正确的原位和弦音符', () => {
    // C 大三和弦原位
    const cMajor = new Chord('C', 'major', 0);
    expect(cMajor.getNotes()).toEqual(['C4', 'E4', 'G4']);
    
    // D 小三和弦原位
    const dMinor = new Chord('D', 'minor', 0);
    expect(dMinor.getNotes()).toEqual(['D3', 'F3', 'A3']);

    // Db 小三和弦原位
    const dbMinor = new Chord('Db', 'minor', 0);
    expect(dbMinor.getNotes()).toEqual(['Db3', 'E3', 'Ab3']);
    
    // F# 减三和弦原位
    const fSharpDim = new Chord('F#', 'diminished', 0);
    expect(fSharpDim.getNotes()).toEqual(['F#3', 'A3', 'C4']);
    
    // A# 增三和弦原位
    const aSharpAug = new Chord('A#', 'augmented', 0);
    expect(aSharpAug.getNotes()).toEqual(['A#3', 'D4', 'F#4']);
  });

  // 测试和弦转位
  test('处理第一转位正确', () => {
    // C 大三和弦第一转位 (E-G-C)
    const cMajorFirstInv = new Chord('C', 'major', 1);
    expect(cMajorFirstInv.getNotes()).toEqual(['E3', 'G3', 'C4']);
    
    // G 小三和弦第一转位 (Bb-D-G)
    const gMinorFirstInv = new Chord('G', 'minor', 1);
    expect(gMinorFirstInv.getNotes()).toEqual(['Bb3', 'D4', 'G4']);
  });

  test('处理第二转位正确', () => {
    // C 大三和弦第二转位 (G-C-E)
    const cMajorSecondInv = new Chord('C', 'major', 2);
    expect(cMajorSecondInv.getNotes()).toEqual(['G3', 'C4', 'E4']);
    
    // E 小三和弦第二转位 (B-E-G)
    const eMinorSecondInv = new Chord('E', 'minor', 2);
    expect(eMinorSecondInv.getNotes()).toEqual(['B3', 'E4', 'G4']);
  });

  // 测试八度调整
  test('当最低音可能高于 C4 时调整八度', () => {
    // 选择一个高音域的和弦，确保它的最低音会高于 C4 如果不进行调整
    // 例如 B 大调第一转位 (D#-F#-B)，D# 可能高于 C4，应向下调整八度
    const bMajorFirstInv = new Chord('B', 'major', 1);
    expect(bMajorFirstInv.getNotes()[0]).toBe('D#3'); // 应调整为 D#3 而不是 D#4
    
    // 测试八度调整后，和弦音符仍然保持正确顺序
    expect(bMajorFirstInv.getNotes()).toEqual(['D#3', 'F#3', 'B3']);
  });

  test('当最低音可能低于 C3 时调整八度', () => {
    // 创建一个会导致最低音低于 C3 的和弦配置
    // 我们强制使用C2作为测试
    const lowChord = new Chord('C2', 'major', 0);
    
    // 验证最低音不低于 C3
    const notes = lowChord.getNotes();
    const octave = parseInt(notes[0].slice(-1));
    expect(octave).toBeGreaterThanOrEqual(3);
  });

  // 测试同时支持带八度和不带八度的输入
  test('同时支持带八度和不带八度的输入', () => {
    // 不带八度（默认使用第4八度）
    const cWithoutOctave = new Chord('C', 'major', 0);
    // 带八度（明确指定第4八度）
    const cWithOctave = new Chord('C4', 'major', 0);
    
    // 两者应该产生相同的结果
    expect(cWithoutOctave.getNotes()).toEqual(cWithOctave.getNotes());
  });

  // 测试异常情况
  test('处理无效根音', () => {
    expect(() => {
      // 故意传入无效值进行测试
      new Chord('Z' as string, 'major', 0);
    }).toThrow();
  });
});