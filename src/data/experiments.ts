export type Experiment = {
  id: string
  title: string
  description: string
  imageTag: string
  law: { equation: string; description: string }
  steps: string[]
  simulator: 'lens' | 'ohm' | 'compass' | 'hooke' | 'pendulum' | 'projectile' | 'micrometer'
  unlockAfter?: string
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'lens-convex-concave',
    title: 'تجربة العدسة المحدبة والمقعرة',
    description: 'تأثير البعد البؤري ومكان الجسم على الصورة (تكبير/تصغير).',
    imageTag: 'Optics',
    law: {
      equation: '1/f = 1/u + 1/v',
      description: 'قانون العدسة الرقيقة: \(f\) البعد البؤري، \(u\) بعد الجسم، \(v\) بعد الصورة.',
    },
    steps: [
      'اختار نوع العدسة (محدبة/مقعرة).',
      'غيّر بعد الجسم عن العدسة.',
      'لاحظ موضع الصورة والتكبير.',
    ],
    simulator: 'lens',
  },
  {
    id: 'ohm-series-parallel',
    title: 'تجربة قانون أوم (توالي وتوازي)',
    description: 'حساب التيار والجهد والمقاومة المكافئة عمليًا.',
    imageTag: 'Electricity',
    law: { equation: 'V = I R', description: 'قانون أوم وتطبيقات التوالي/التوازي.' },
    steps: ['حدد قيمة مصدر الجهد.', 'اختر قيم المقاومات.', 'اختار توالي أو توازي وشاهد النتائج.'],
    simulator: 'ohm',
    unlockAfter: 'lens-convex-concave',
  },
  {
    id: 'compass-magnet',
    title: 'تجربة البوصلة والمغناطيس',
    description: 'تأثير مجال مغناطيسي على اتجاه الإبرة.',
    imageTag: 'Magnetism',
    law: { equation: 'τ = m B sin(θ)', description: 'عزم ثنائي القطب المغناطيسي في مجال \(B\).' },
    steps: ['حرك المغناطيس قرب البوصلة.', 'غير المسافة والزاوية.', 'لاحظ اتجاه الإبرة.'],
    simulator: 'compass',
    unlockAfter: 'ohm-series-parallel',
  },
  {
    id: 'hookes-law',
    title: 'تجربة قانون هوك (الزنبرك)',
    description: 'العلاقة بين القوة والاستطالة وثابت الزنبرك.',
    imageTag: 'Mechanics',
    law: { equation: 'F = k x', description: 'قوة شد الزنبرك تتناسب طرديًا مع الاستطالة.' },
    steps: ['غيّر الكتلة المعلقة.', 'شاهد الاستطالة.', 'استنتج ثابت الزنبرك.'],
    simulator: 'hooke',
    unlockAfter: 'compass-magnet',
  },
  {
    id: 'pendulum',
    title: 'تجربة الباندول البسيط',
    description: 'تأثير طول الخيط على الزمن الدوري.',
    imageTag: 'Waves',
    law: { equation: 'T = 2π √(L/g)', description: 'الزمن الدوري يعتمد على طول الباندول.' },
    steps: ['غيّر طول الخيط.', 'اختر زاوية صغيرة.', 'قارن الزمن الدوري.'],
    simulator: 'pendulum',
    unlockAfter: 'hookes-law',
  },
  {
    id: 'projectiles',
    title: 'تجربة المقذوفات',
    description: 'زاوية الإطلاق والسرعة وتأثيرهم على المدى والزمن.',
    imageTag: 'Kinematics',
    law: { equation: 'R = v² sin(2θ) / g', description: 'مدى المقذوف (بدون مقاومة هواء).' },
    steps: ['حدد السرعة الابتدائية.', 'غيّر زاوية الإطلاق.', 'شاهد المسار والمدى.'],
    simulator: 'projectile',
    unlockAfter: 'pendulum',
  },
  {
    id: 'micrometer',
    title: 'تجربة الميكرومتر',
    description: 'قراءة الميكرومتر بدقة وتحويل القراءة لقيمة حقيقية.',
    imageTag: 'Measurement',
    law: { equation: 'Least Count', description: 'أقل قيمة = \(pitch / number\\ of\\ divisions\).' },
    steps: ['حرك السليف والثيمبل.', 'اقرأ السكيل الرئيسي والثيمبل.', 'احسب القيمة النهائية.'],
    simulator: 'micrometer',
    unlockAfter: 'projectiles',
  },
]

export function getExperiment(id: string) {
  return EXPERIMENTS.find((e) => e.id === id) ?? null
}

