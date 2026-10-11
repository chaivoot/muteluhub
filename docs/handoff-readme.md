# Mutelu handoff package

แตก zip นี้ไว้ที่ root ของโปรเจกต์ (หรือโฟลเดอร์ `handoff/`) แล้วบอก Claude Code ว่า
"อ่าน CLAUDE.md ในโฟลเดอร์นี้ก่อน แล้วเริ่มจากข้อ 1 ในลำดับการทำ"

```
CLAUDE.md                      คำสั่งสำหรับ Claude Code (อ่านก่อน)
docs/
  mutelu-spec.md               spec โปรเจกต์ (ของเจ้าของ)
  design-brief.md              brief ดีไซน์
design/
  design-system.md             ระบบดีไซน์ C2 ครามทอง ภาพนำ
  tokens.css / tokens.json     สี ฟอนต์ ขนาด มุม
  fonts/                       Trirong + Noto Sans Thai (self-host, OFL) + fonts.css
  icons/goals/*.svg            ไอคอน 8 เป้าหมาย
  icons/ui/*.svg               ไอคอน UI (หมอดู สถานที่ ต่างประเทศ ปฏิทิน เสื้อ แชร์ ตัวกรอง)
  mockups/
    c2-home-and-fortune-tellers.html/.png   หน้าแรก + รายการหมอดู (direction ที่เลือก)
    c-base-system.html/.png                 ระบบพื้นฐาน C (การ์ดสีเสื้อเต็ม การ์ดต่าง ๆ chip)
    images/                                 ภาพ AI ตัวอย่างความละเอียดต่ำ (ห้ามใช้จริง)
data/
  goals.json                   8 เป้าหมาย: slug ชื่อ สี ไอคอน
  disciplines.json             ศาสตร์ 2 ชั้น ตาม spec
```

ไฟล์ดีไซน์ต้นฉบับ (แก้ไขได้) อยู่บน canvas MuteluHub ใน Claude
