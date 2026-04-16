export type LectureLaw = { equation: string; title: string; description: string }

export type Lecture = {
  id: string
  unit: string
  title: string
  description: string
  youtubeId: string
  difficulty: 'easy' | 'medium' | 'hard'
  videosCount: number
  laws: LectureLaw[]
  attachments: { id: string; name: string; sizeLabel: string; kind: 'pdf' | 'doc' }[]
  quizId: string
  unlockAfter?: string
}

export const LECTURES: Lecture[] = [
  {
    id: 'electric-field',
    unit: 'الكهرومغناطيسية',
    title: 'المحاضرة 1: المجال الكهربائي',
    description: 'فهم مفهوم المجال الكهربائي حول الشحنات وكيفية حسابه.',
    youtubeId: 'dQw4w9WgXcQ',
    difficulty: 'easy',
    videosCount: 1,
    laws: [
      {
        equation: 'E = F / q',
        title: 'شدة المجال الكهربائي',
        description: 'حساب شدة المجال بدلالة القوة المؤثرة على شحنة اختبار.',
      },
      {
        equation: 'E = kQ / r²',
        title: 'مجال الشحنة النقطية',
        description: 'شدة المجال على بعد \(r\) من شحنة مولدة \(Q\).',
      },
      {
        equation: 'Φ = E · A',
        title: 'التدفق الكهربائي',
        description: 'قياس خطوط المجال التي تعبر مساحة معينة عموديًا.',
      },
    ],
    attachments: [
      { id: 'notes', name: 'ملاحظات_المحاضرة_01.pdf', sizeLabel: '4.2 MB', kind: 'pdf' },
      { id: 'sheet', name: 'معادلات_المجال.docx', sizeLabel: '1.1 MB', kind: 'doc' },
    ],
    quizId: 'quiz_electric-field',
  },
  {
    id: 'ohms-law',
    unit: 'الكهربية والتيار',
    title: 'المحاضرة 2: قانون أوم (توالي/توازي)',
    description: 'الجهد والتيار والمقاومة وتطبيقات التوالي والتوازي.',
    youtubeId: 'dQw4w9WgXcQ',
    difficulty: 'easy',
    videosCount: 1,
    laws: [
      { equation: 'V = I R', title: 'قانون أوم', description: 'العلاقة بين الجهد والتيار والمقاومة.' },
      {
        equation: 'Rₛ = R₁ + R₂ + ...',
        title: 'مقاومات على التوالي',
        description: 'المقاومة المكافئة مجموع المقاومات.',
      },
      {
        equation: '1/Rₚ = 1/R₁ + 1/R₂ + ...',
        title: 'مقاومات على التوازي',
        description: 'المقاومة المكافئة في التوازي.',
      },
    ],
    attachments: [{ id: 'ohm', name: 'Ohm_Law_Summary.pdf', sizeLabel: '0.9 MB', kind: 'pdf' }],
    quizId: 'quiz_ohms-law',
    unlockAfter: 'electric-field',
  },
]

export function getLecture(id: string) {
  return LECTURES.find((l) => l.id === id) ?? null
}

