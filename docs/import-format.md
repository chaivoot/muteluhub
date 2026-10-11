# รูปแบบ JSON สำหรับนำเข้าข้อมูล (/admin/import)

มี 2 ประเภท เลือกแท็บในหลังบ้านก่อนกดนำเข้า: [สถานที่](#สถานที่) และ [หมอดู](#หมอดู)

## สถานที่

วางเป็น array ของสถานที่ (หรือ object เดียว) ครั้งละไม่เกิน 500 รายการ
ระบบตรวจทุกรายการก่อน ถ้ามีรายการผิดแม้แต่รายการเดียวจะไม่นำเข้าเลย (แก้ให้ครบแล้วกดตรวจใหม่)
slug ที่มีอยู่แล้วจะถูกเขียนทับทั้งรายการ และทุกครั้งที่นำเข้าระบบเก็บ JSON ที่วางไว้ในตาราง `import_log`

ตัวอย่างจริง: `data/import/places-batch-01.json`, `data/import/fortune-tellers-batch-01.json` (ไฟล์ใน `data/import` ที่ลงทะเบียนใน `src/lib/seed-batches.ts` จะมีปุ่มนำเข้าในหลังบ้าน ข้ามรายการที่มีอยู่แล้ว)

### ช่องข้อมูลสถานที่

| ช่อง | จำเป็น | รายละเอียด |
|---|---|---|
| `name` | ✓ | ชื่อไทย |
| `nameEn` | | ชื่ออังกฤษ |
| `slug` | ✓ | a-z 0-9 และ - เท่านั้น ห้ามซ้ำกับ slug จังหวัด (เช่น `bangkok`) ใช้เป็น URL `/places/[slug]` |
| `type` | ✓ | `temple` วัด · `shrine` ศาล · `devalai` เทวาลัย · `chinese-shrine` ศาลเจ้าจีน |
| `deities` | ✓ | องค์เทพ / สิ่งศักดิ์สิทธิ์ อย่างน้อย 1 |
| `goals` | ✓ | `love` `career` `money` `business` `health` `study` `family` `protection` อย่างน้อย 1 |
| `province` หรือ `provinceSlug` | ✓ | ชื่อจังหวัดภาษาไทย (รับ "กรุงเทพฯ") หรือ slug ใน `src/data/provinces.ts` |
| `district` | | อำเภอ / เขต |
| `coords` | ✓ | `"lat, lng"` เช่น `"13.74413, 100.54091"` (หรือใช้ `lat` `lng` แยกเป็นตัวเลข) ใช้กับ ใกล้ฉัน และที่พักใกล้สถานที่ |
| `mapsUrl` | | ลิงก์เปิดแผนที่ ถ้าไม่ใส่ระบบสร้างจากพิกัด |
| `description` | ✓ | คำอธิบาย 2-3 ประโยค (em dash จะถูกแปลงเป็น hyphen) |
| `hours` | | เวลาเปิด ไม่แน่ใจให้ไม่ใส่ |
| `offerings` | | ของไหว้ (array) |
| `howToPray` | | วิธีขอพรตามลำดับ (array) |
| `howToRepayVow` | | วิธีแก้บน (array) |
| `images` | | `[{ "src", "alt", "author", "license", "sourceUrl" }]` ภาพจริงพร้อมเครดิตเท่านั้น **ห้ามรูปจาก Google Maps** (ระบบบล็อก) |
| `agodaLinkOverride` | | ลิงก์ Agoda ของสถานที่นี้ |
| `published` | | `true` แสดงบนเว็บทันที, `false` (ค่าเริ่มต้น) ซ่อนไว้ตรวจก่อน |
| `checkedAt` | ✓ | วันที่ตรวจข้อมูล `YYYY-MM-DD` |
| `notes` | | บันทึกภายใน (string หรือ array) แสดงเฉพาะหลังบ้าน ไม่แสดงบนเว็บ |
| `sources` | ✓ | ลิงก์แหล่งข้อมูล อย่างน้อย 1 |

## หมอดู

ไม่มีรูปรายคน ระบบใช้ภาพประกอบตามศาสตร์หลัก (ศาสตร์ตัวแรก) ให้อัตโนมัติ และสร้างภาพแชร์ (OG) จากชื่อ + ศาสตร์

### ช่องข้อมูลหมอดู

| ช่อง | จำเป็น | รายละเอียด |
|---|---|---|
| `name` | ✓ | ชื่อที่ใช้ในการให้บริการ |
| `slug` | ✓ | a-z 0-9 และ - ห้ามซ้ำกับ slug ศาสตร์หรือจังหวัด ใช้เป็น URL `/fortune-tellers/[slug]` |
| `disciplines` | ✓ | slug ศาสตร์จาก `data/disciplines.json` เช่น `tarot`, `palmistry`, `feng-shui` **ตัวแรกคือศาสตร์หลัก** |
| `goals` | ✓ | เรื่องที่ถนัด (8 เป้าหมาย เหมือนสถานที่) |
| `channels` | ✓ | `shop` หน้าร้าน · `online` ออนไลน์ · `line` LINE · `phone` โทร |
| `province` หรือ `provinceSlug` | ถ้ามี `shop` | ไม่ใส่ = ดูออนไลน์อย่างเดียว |
| `district` | | อำเภอ / เขต |
| `description` | ✓ | แนะนำตัว 1-3 ประโยค |
| `hours` | | เวลาให้บริการ |
| `priceFrom` | | ราคาเริ่มต้น (ตัวเลข บาท) ใช้กับตัวกรองราคา |
| `priceNote` | | รายละเอียดราคา เช่น ถาม 3 คำถาม |
| `phone` `line` | ถ้ามีช่องทางนั้น | `line` ใส่ LINE ID (`@xxx` หรือ ID ส่วนตัว) หรือลิงก์ lin.ee |
| `facebook` `instagram` `tiktok` `youtube` `website` | | ลิงก์เต็ม ต้องมีช่องทางติดต่ออย่างน้อย 1 อย่าง |
| `mapsUrl` | | ลิงก์แผนที่หน้าร้าน |
| `claimed` | | `true` เมื่อเจ้าของยืนยันข้อมูลเอง |
| `published` `checkedAt` `notes` `sources` | | เหมือนสถานที่ (`checkedAt` และ `sources` จำเป็น) |

```json
[
  {
    "name": "ชื่อหมอดู",
    "slug": "mor-example",
    "disciplines": ["tarot", "oracle"],
    "goals": ["love", "career"],
    "channels": ["online", "line"],
    "description": "ดูไพ่ทาโรต์ออนไลน์ผ่าน LINE",
    "line": "@example",
    "priceFrom": 299,
    "priceNote": "ถาม 3 คำถาม",
    "published": false,
    "checkedAt": "2026-10-11",
    "notes": ["ยังไม่ได้เช็กราคาล่าสุด"],
    "sources": ["https://www.facebook.com/..."]
  }
]
```

## คำสั่งสำหรับให้ Claude หาข้อมูล (ตัวอย่าง)

> หาข้อมูล[สถานที่เสริมดวง / หมอดู] [ชื่อ] แล้วทำเป็น JSON ตาม docs/import-format.md
> ใส่เฉพาะข้อมูลที่มีแหล่งยืนยัน ไม่แน่ใจให้เว้นว่าง ภาพใช้ Wikimedia Commons ที่เช็ก license แล้วเท่านั้น
> ใส่ published: false และเขียนสิ่งที่ยังต้องเช็กไว้ใน notes
