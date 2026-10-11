import type { GoalSlug } from '@/lib/goals';

/**
 * คลัง prompt (ตาราง prompt_templates ใน addendum 01 ข้อ 4)
 * - placeholder รูปแบบ {{key}} ต้องมี key ตรงกับ requiredFields
 * - ไม่ต้องใส่ guard block ใน template ระบบต่อท้ายให้ตอน render (lib/prompts.ts)
 * - เนื้อหาเป็นฉบับร่าง เจ้าของจะปรับภาษาเองภายหลัง
 */
export type PromptFieldType = 'date' | 'time' | 'text' | 'select' | 'cards';

export interface PromptField {
  key: string;
  label: string;
  type: PromptFieldType;
  /** select: ตัวเลือก / cards: ชื่อตำแหน่งไพ่ */
  options?: string[];
  multiline?: boolean;
  placeholder?: string;
  /** เติมค่าเริ่มต้นอัตโนมัติฝั่ง client */
  defaultFrom?: 'today-weekday' | 'selected-goal';
}

export interface PromptTemplate {
  slug: string;
  title: string;
  description: string;
  /** slug ศาสตร์จาก data/disciplines.json, null = ทั่วไป */
  discipline: string | null;
  goals: GoalSlug[];
  template: string;
  requiredFields: PromptField[];
  followUps: string[];
  isFeatured: boolean;
  sortOrder: number;
}

const ALL_GOALS: GoalSlug[] = ['love', 'career', 'money', 'business', 'health', 'study', 'family', 'protection'];

const QUESTION: PromptField = {
  key: 'question',
  label: 'คำถาม / สถานการณ์',
  type: 'text',
  multiline: true,
  placeholder: 'เล่าสั้น ๆ ว่าอยากรู้เรื่องอะไร',
};

const GOAL_FIELD: PromptField = {
  key: 'goal',
  label: 'เรื่องที่อยากเสริม',
  type: 'select',
  defaultFrom: 'selected-goal',
};

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    slug: 'tarot-love',
    title: 'ตีความไพ่ทาโรต์เรื่องความรัก',
    description: 'จั่วไพ่ 3 ใบ (อดีต / ปัจจุบัน / อนาคต) แล้วให้ AI ช่วยตีความในบริบทความรัก',
    discipline: 'tarot',
    goals: ['love'],
    template: `ช่วยตีความไพ่ทาโรต์เรื่องความรักให้หน่อย
คำถามของฉัน: {{question}}
ไพ่ที่จั่วได้ (เรียงตามตำแหน่ง อดีต / ปัจจุบัน / อนาคต): {{cards}}
สถานะตอนนี้: {{relationship_status}}
อธิบายความหมายไพ่แต่ละใบในบริบทความรัก แล้วสรุปภาพรวม`,
    requiredFields: [
      QUESTION,
      { key: 'cards', label: 'ไพ่ที่จั่วได้', type: 'cards', options: ['อดีต', 'ปัจจุบัน', 'อนาคต'], placeholder: 'เช่น The Lovers' },
      {
        key: 'relationship_status',
        label: 'สถานะตอนนี้',
        type: 'select',
        options: ['โสด', 'กำลังคุย', 'มีแฟน', 'แต่งงานแล้ว', 'เพิ่งเลิกกัน'],
      },
    ],
    followUps: ['ไพ่ใบไหนเป็นจุดที่ฉันควรระวังที่สุด', 'ถ้าอยากให้อนาคตดีขึ้น ควรทำอะไรใน 30 วันนี้'],
    isFeatured: true,
    sortOrder: 1,
  },
  {
    slug: 'lucky-number-money',
    title: 'ถาม AI เรื่องเลขมงคลด้านการเงิน',
    description: 'ใช้ผลจากเครื่องคำนวณเลขมงคล ให้ AI อธิบายและแนะนำวิธีใช้ในชีวิตประจำวัน',
    discipline: 'numerology',
    goals: ['money'],
    template: `ฉันเกิดวันที่ {{birth_date}}
เว็บคำนวณเลขมงคลให้ตามหลัก {{method}} ได้ผลดังนี้: {{lucky_numbers}}
ช่วยอธิบายว่าเลขเหล่านี้เกี่ยวกับการเงินของฉันอย่างไร และแนะนำวิธีใช้ในชีวิตประจำวัน เช่น เบอร์โทร เลขบัญชี ป้ายทะเบียน`,
    requiredFields: [
      { key: 'birth_date', label: 'วันเกิด', type: 'date' },
      { key: 'method', label: 'หลักคำนวณ', type: 'text', placeholder: 'ได้จากหน้าเลขมงคล' },
      { key: 'lucky_numbers', label: 'เลขมงคลที่ได้', type: 'text', placeholder: 'เช่น 5, 9, 24' },
    ],
    followUps: [],
    isFeatured: true,
    sortOrder: 2,
  },
  {
    slug: 'color-today-career',
    title: 'แต่งตัวไปทำงานตามสีมงคลวันนี้',
    description: 'ใช้สีเสื้อมงคลด้านการงานของวันนี้ ให้ AI ช่วยแนะนำการแต่งตัวและการวางตัว',
    discipline: 'lek-7-tua',
    goals: ['career'],
    template: `วันนี้วัน{{weekday}} สีมงคลด้านการงานของฉันคือ {{color}} และสีที่ควรเลี่ยงคือ {{avoid_color}}
วันนี้ฉันมีเรื่องงานคือ: {{question}}
ช่วยแนะนำการแต่งตัวและการวางตัวสำหรับวันนี้ให้เหมาะกับเรื่องนี้`,
    requiredFields: [
      { key: 'weekday', label: 'วัน', type: 'text', defaultFrom: 'today-weekday' },
      { key: 'color', label: 'สีมงคล', type: 'text', placeholder: 'ได้จากหน้าสีเสื้อวันนี้' },
      { key: 'avoid_color', label: 'สีที่ควรเลี่ยง', type: 'text' },
      { ...QUESTION, label: 'เรื่องงานวันนี้', placeholder: 'เช่น ประชุมนำเสนองานกับลูกค้า' },
    ],
    followUps: [],
    isFeatured: false,
    sortOrder: 3,
  },
  {
    slug: 'chart-reading-general',
    title: 'ตีความผังดวงที่มีอยู่แล้ว',
    description: 'วางข้อมูลผังดวงที่คุณมี (จากหมอดูหรือโปรแกรมผูกดวง) ให้ AI ตีความจากข้อมูลนั้นเท่านั้น',
    discipline: null,
    goals: ALL_GOALS,
    template: `นี่คือข้อมูลผังดวงของฉันตามหลัก {{discipline}}:
{{chart_data}}
เรื่องที่อยากรู้: {{goal}} - {{question}}
ช่วยตีความจากข้อมูลนี้เท่านั้น`,
    requiredFields: [
      { key: 'discipline', label: 'ศาสตร์ของผังดวง', type: 'select' },
      { key: 'chart_data', label: 'ข้อมูลผังดวง', type: 'text', multiline: true, placeholder: 'วางตำแหน่งดาว / ลัคนา / เสา ฯลฯ ที่มีอยู่' },
      GOAL_FIELD,
      QUESTION,
    ],
    followUps: [],
    isFeatured: true,
    sortOrder: 4,
  },
  {
    slug: 'general-plan',
    title: 'วางแผนเสริมดวงแบบลงมือทำได้จริง',
    description: 'เล่าสถานการณ์ แล้วให้ AI แนะนำทั้งมุมความเชื่อแบบไทยและสิ่งที่ทำได้จริง',
    discipline: null,
    goals: ALL_GOALS,
    template: `ฉันอยากเสริมดวงเรื่อง{{goal}} สถานการณ์ตอนนี้คือ: {{question}}
ช่วยแนะนำในมุมความเชื่อแบบไทย เช่น การทำบุญ ไหว้พระ สีมงคล ควบคู่กับสิ่งที่ลงมือทำได้จริงในชีวิต`,
    requiredFields: [GOAL_FIELD, QUESTION],
    followUps: [],
    isFeatured: true,
    sortOrder: 5,
  },
];
