export type QuizLevel = 'easy' | 'medium' | 'hard'

export type QuizQuestion = {
  id: string
  prompt: string
  choices: { id: string; text: string }[]
  correctChoiceId: string
  explanation: string
}

export type Quiz = {
  id: string
  title: string
  level: QuizLevel
  minutes: number
  questions: QuizQuestion[]
  relatedLectureId?: string
}

export const QUIZZES: Quiz[] = [
  {
    id: 'quiz_electric-field',
    title: 'اختبار: المجال الكهربائي',
    level: 'easy',
    minutes: 10,
    relatedLectureId: 'electric-field',
    questions: [
      {
        id: 'q1',
        prompt: 'وحدة شدة المجال الكهربائي \(E\) في النظام الدولي هي…',
        choices: [
          { id: 'a', text: 'نيوتن/كولوم' },
          { id: 'b', text: 'جول' },
          { id: 'c', text: 'واط' },
          { id: 'd', text: 'أوم' },
        ],
        correctChoiceId: 'a',
        explanation: 'لأن \(E = F/q\) ⇒ نيوتن لكل كولوم.',
      },
      {
        id: 'q2',
        prompt: 'عند مضاعفة المسافة \(r\) من شحنة نقطية، شدة المجال…',
        choices: [
          { id: 'a', text: 'تتضاعف' },
          { id: 'b', text: 'تقل إلى النصف' },
          { id: 'c', text: 'تقل إلى الربع' },
          { id: 'd', text: 'لا تتغير' },
        ],
        correctChoiceId: 'c',
        explanation: 'لأن \(E ∝ 1/r^2\).',
      },
    ],
  },
  {
    id: 'quiz_ohms-law',
    title: 'اختبار: قانون أوم (توالي/توازي)',
    level: 'easy',
    minutes: 10,
    relatedLectureId: 'ohms-law',
    questions: [
      {
        id: 'q1',
        prompt: 'إذا كان \(V=12V\) و \(R=6Ω\) فإن \(I\) يساوي…',
        choices: [
          { id: 'a', text: '0.5 A' },
          { id: 'b', text: '2 A' },
          { id: 'c', text: '6 A' },
          { id: 'd', text: '72 A' },
        ],
        correctChoiceId: 'b',
        explanation: 'من \(I = V/R = 12/6 = 2A\).',
      },
      {
        id: 'q2',
        prompt: 'في التوالي: المقاومة المكافئة…',
        choices: [
          { id: 'a', text: 'مجموع المقاومات' },
          { id: 'b', text: 'مقلوب مجموع المقلوبات' },
          { id: 'c', text: 'أكبر مقاومة فقط' },
          { id: 'd', text: 'أصغر مقاومة فقط' },
        ],
        correctChoiceId: 'a',
        explanation: 'في التوالي: \(R_s = R_1 + R_2 + ...\).',
      },
    ],
  },
]

export function getQuiz(id: string) {
  return QUIZZES.find((q) => q.id === id) ?? null
}

