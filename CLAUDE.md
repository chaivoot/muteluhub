# MuteluHub (muteluhub.com) - คำสั่งสำหรับ Claude Code

เว็บ directory สายมู: หมอดูแยกตามศาสตร์, สถานที่เสริมดวงไทย/ต่างประเทศ, เลขมงคล, ปฏิทินฤกษ์, สีเสื้อมงคลรายวัน, หน้าเทศกาล
หัวใจ: ผู้ใช้เริ่มจาก "อยากเสริมเรื่องอะไร" (8 เป้าหมาย) ทุกหน้าตอบเป้าหมายนั้น

## อ่านตามลำดับนี้
1. `docs/mutelu-spec.md` - spec ของเจ้าของโปรเจกต์ + `docs/mutelu-spec-addendum-*.md` (ส่วนเพิ่ม)
    (taxonomy, data model, URL, affiliate, ลำดับการทำ, เรื่องที่ยังไม่ตัดสินใจ) **ถือเป็นแหล่งความจริงหลัก**
2. `docs/design-brief.md` - brief ด้านดีไซน์ (ผู้ใช้, ความรู้สึกแบรนด์, หน้าจอที่ต้องมี)
3. `design/design-system.md` - ระบบดีไซน์ที่เลือกแล้ว (direction C2 ครามทอง ภาพนำ)
4. `design/mockups/*.png` และ `*.html` - ภาพอ้างอิง เปิด HTML ในเบราว์เซอร์ได้ (inline style อ่านค่าได้ตรง)
5. `design/tokens.css`, `design/tokens.json`, `data/goals.json`, `data/disciplines.json`

## สิ่งที่ล็อกแล้ว
- หลักการ 4 ข้อใน spec ข้อ 1
- taxonomy เป้าหมาย 8 อย่าง (slug ใน `data/goals.json` ตรงกับ spec) และศาสตร์ 2 ชั้น (`data/disciplines.json`)
- direction ดีไซน์ C2: พื้นคราม `#172038`, ทอง `#D6B064`, Trirong + Noto Sans Thai, mobile-first
- affiliate อยู่ในเนื้อหาเท่านั้น 3 ถึง 4 ชิ้นต่อบล็อก มีป้าย "ลิงก์ affiliate" ทุกบล็อก

## ข้อห้ามสำคัญ
- **ภาพใน `design/mockups/images/` เป็นภาพ AI ความละเอียดต่ำ (~200px) ใช้เป็นตัวอย่างเท่านั้น** ห้ามนำภาพวัด/ศาลเจ้า/เทศกาล/โทริอิไปใช้เป็นภาพสถานที่จริง ภาพสถานที่ต้องเป็นภาพจริงพร้อมเครดิต ส่วนภาพสินค้าเป็นแค่ตัวอย่าง
- ภาพหมอดู 4 ภาพ (ลายมือ ไพ่ทาโรต์ โหงวเฮ้ง ฮวงจุ้ย) เป็นตัวอย่างสไตล์ ต้องทำชุดจริงความละเอียดสูง ศาสตร์ละ 2 ถึง 3 แบบ (ภาพโหงวเฮ้งตัวอย่างดูคล้ายเทพ ควรทำใหม่)
- ห้ามใช้ชื่อหมอดูหรือแบรนด์จริงในข้อมูลตัวอย่าง (seed) ใช้ชื่อสมมติที่ดูออกว่าสมมติ
- สีเสื้อในม็อกอัป (อาทิตย์: เขียว = การเงิน, เลี่ยงฟ้า/น้ำเงิน) เป็นข้อมูลตัวอย่าง ยังไม่ได้ตรวจกับตำรา ห้าม seed เป็นข้อมูลจริงจนกว่าเจ้าของจะยืนยันหลักทักษาที่ใช้
- ไม่มีแบนเนอร์ ไม่มี pop-up
- ห้ามดึงรูปจาก Google Maps
- CID ของ Agoda อยู่ใน env var เท่านั้น ห้าม hardcode

## เรื่องที่ยังไม่ตัดสินใจ (ถามเจ้าของก่อนทำส่วนที่เกี่ยวข้อง)
ดู spec ข้อ 8: ชื่อแบรนด์/โดเมน, หลักคำนวณเลขมงคล, หลักสีเสื้อ, แหล่งข้อมูลปฏิทินมงคล, รูปแบบ deep link Agoda, เงื่อนไข Shopee, slug ไทยหรืออังกฤษ
ทำโครงให้เปลี่ยนค่าเหล่านี้ได้ง่าย (เช่น daily_colors มีคอลัมน์ source, ฟังก์ชันคำนวณเลขมงคลแยกเป็น module เดียวและแสดงชื่อหลักคำนวณบนหน้า)

## Stack
spec ไม่ได้กำหนด framework ระบุแค่ว่า deploy บน Vercel (มี env var ของ Agoda)
ถ้ามี repo อยู่แล้วให้ใช้ stack เดิม แล้วแปลง `design/tokens.css` เข้าไป (CSS variables หรือ theme ของ Tailwind)
ถ้าเริ่มใหม่ เสนอ stack ให้เจ้าของเลือกก่อนลงมือ

## ลำดับการทำที่แนะนำ (จาก spec ข้อ 7)
1. ระบบดีไซน์ + layout มือถือ + หน้าแรก (goal picker จำค่า, การ์ดสีเสื้อ, ทางลัดเลขมงคล, เทศกาลที่กำลังมา)
2. สีเสื้อรายวัน + การ์ดแชร์ (1080x1350, 1080x1920) + เครื่องคำนวณเลขมงคล
3. สถานที่ในไทย
4. หมอดู (+ OG image อัตโนมัติ: ภาพ default + ชื่อ + ศาสตร์)
5. ต่างประเทศ + ปฏิทินมงคล; หน้าเทศกาลแทรกตามจังหวะ (กินเจ 2569 = 10-18 ต.ค. 2569 ตาม spec)

## สไตล์การเขียนข้อความในเว็บ
ภาษาไทยเป็นกันเอง กระชับ ไม่ใช้ em dash (—) ใช้ hyphen (-) แทนเมื่อจำเป็น ไม่ใส่อัญประกาศพร่ำเพรื่อ

## เงื่อนไขการทำงาน (เจ้าของกำหนด 2026-10-11)
- เจ้าของไม่ทำงานบนเครื่องตัวเอง Claude เขียนทุกอย่างใน sandbox แล้ว push ขึ้น GitHub
- เปิด PR ได้เลยไม่ต้องรอคำสั่ง และ merge เข้า `main` ได้เลยเมื่อ test + build ผ่าน
- `main` = Production (Vercel) เจ้าของทดสอบที่ production ไม่ดู preview
- ดังนั้นก่อน merge ต้องรัน `npm test`, `npm run typecheck`, `npm run build` ให้ผ่านทุกครั้ง และเช็กหน้าจริงในเบราว์เซอร์ (มือถือ 390px) เพราะไม่มีใครตรวจ preview ให้
- สรุปสิ่งที่ merge ไปแล้วให้เจ้าของทุกครั้ง พร้อมบอกว่าควรไปดูหน้าไหนบน production

## สถานะโปรเจกต์ (อัปเดตล่าสุด 2026-10-11)
- ชื่อแบรนด์/โดเมน: **MuteluHub / muteluhub.com** (เจ้าของยืนยันแล้ว)
- Stack: Next.js 15 (App Router) + TypeScript + CSS ธรรมดา (`design/tokens.css` import ตรงใน `src/app/layout.tsx`), deploy Vercel
- ข้อมูล: ยังไม่มี database ใช้ไฟล์ใน `data/*.json` และ `src/data/*.ts` (โครงตรงกับ data model ใน spec ข้อ 5) ย้ายไป DB ได้ภายหลัง
- เสร็จแล้ว: ข้อ 1 ในลำดับการทำ (ระบบดีไซน์ layout มือถือ หน้าแรก) + addendum 01 AI prompt (คลัง, หน้า prompt เดี่ยว, generator) หน้าอื่นเป็นโครงรอ
- addendum 01 ที่ยังไม่ทำ: ปุ่ม ถาม AI ต่อ ใน /tools/lucky-number และ /color-today (รอหลักคำนวณ/หลักทักษา) ส่วน prefill ผ่าน query string รองรับแล้ว; ปุ่มเปิดใน ChatGPT/Claude ยังไม่ทำเพราะยังไม่ได้ทดสอบว่า URL parameter ใช้ได้จริง
- คำสั่ง: `npm run dev`, `npm test`, `npm run typecheck`, `npm run build`

## โครงโค้ด
- `src/lib/goals.ts` อ่าน `data/goals.json` (แหล่งเดียวของเป้าหมาย)
- `src/lib/thai-date.ts` วันที่ไทย พ.ศ. ตามเวลา Asia/Bangkok
- `src/data/festivals.ts` + `src/lib/festivals.ts` เทศกาลและวันที่รายปี
- `src/data/daily-colors.ts` สีเสื้อ (ตอนนี้เป็นข้อมูลตัวอย่างเท่านั้น `DAILY_COLORS_STATUS = 'sample'`)
- `src/components/goal-context.tsx` จำเป้าหมายที่เลือกใน localStorage + cookie `mh_goal`
- `src/data/prompt-templates.ts` + `src/lib/prompts.ts` คลัง prompt, `GUARD_BLOCK` (ต่อท้ายทุก prompt ตอน render), ประกอบ prompt ฝั่ง client เท่านั้น
- `src/lib/analytics.ts` event copy_prompt / open_followup / click_to_fortune_teller รับเฉพาะ slug goal discipline (ยังไม่ได้เลือกผู้ให้บริการ push เข้า window.dataLayer)
