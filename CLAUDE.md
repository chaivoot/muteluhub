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
- สีเสื้อ: เจ้าของยืนยันแล้ว (2026-10-11) ใช้ **ทักษา ตารางคงที่ตามวัน** และจับคู่เป้าหมาย: การเงิน/ความรัก = ศรี, การงาน = เดช, สุขภาพ = อายุ, ค้าขาย = มูละ, การเรียน = อุตสาหะ, ครอบครัว = บริวาร, แคล้วคลาด = มนตรี, สีที่ควรเลี่ยง = กาลกิณี (ข้อมูลอยู่ที่ `src/data/daily-colors.ts`) ห้ามเปลี่ยนหลักโดยไม่ถามเจ้าของ
- ไม่มีแบนเนอร์ ไม่มี pop-up
- ห้ามดึงรูปจาก Google Maps
- CID ของ Agoda อยู่ใน env var เท่านั้น ห้าม hardcode

## เรื่องที่ยังไม่ตัดสินใจ (ถามเจ้าของก่อนทำส่วนที่เกี่ยวข้อง)
ดู spec ข้อ 8: ชื่อแบรนด์/โดเมน, หลักคำนวณเลขมงคล, หลักสีเสื้อ, แหล่งข้อมูลปฏิทินมงคล, เงื่อนไข Shopee, slug ไทยหรืออังกฤษ
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

ตัวเลข: ใช้เลขอารบิกทั้งเว็บ (รวมเลขศาสตร์/เลขมงคล) **ยกเว้นเนื้อหาดูดวงโหราศาสตร์ไทย** ที่คงเลขไทยไว้ (เจ้าของกำหนด 2026-10-11)

## เงื่อนไขการทำงาน (เจ้าของกำหนด 2026-10-11)
- เจ้าของไม่ทำงานบนเครื่องตัวเอง Claude เขียนทุกอย่างใน sandbox แล้ว push ขึ้น GitHub
- เปิด PR ได้เลยไม่ต้องรอคำสั่ง และ merge เข้า `main` ได้เลยเมื่อ test + build ผ่าน
- `main` = Production (Vercel) เจ้าของทดสอบที่ production ไม่ดู preview
- ดังนั้นก่อน merge ต้องรัน `npm test`, `npm run typecheck`, `npm run build` ให้ผ่านทุกครั้ง และเช็กหน้าจริงในเบราว์เซอร์ (มือถือ 390px) เพราะไม่มีใครตรวจ preview ให้
- สรุปสิ่งที่ merge ไปแล้วให้เจ้าของทุกครั้ง พร้อมบอกว่าควรไปดูหน้าไหนบน production

## สถานะโปรเจกต์ (อัปเดตล่าสุด 2026-10-11)
- ชื่อแบรนด์/โดเมน: **MuteluHub / muteluhub.com** (เจ้าของยืนยันแล้ว)
- Stack: Next.js 15 (App Router) + TypeScript + CSS ธรรมดา (`design/tokens.css` import ตรงใน `src/app/layout.tsx`), deploy Vercel
- ข้อมูล: taxonomy/เทศกาล/prompt อยู่ในไฟล์ (`data/*.json`, `src/data/*.ts`) ส่วน **สถานที่และหมอดูอยู่ใน Neon Postgres (สิงคโปร์)** นำเข้าผ่าน `/admin/import` (รูปแบบ: `docs/import-format.md`) ฟังก์ชัน Vercel ตั้ง region `sin1` ใน `vercel.json` ให้ตรงกับฐานข้อมูล และปิด preview deploy ของ branch อื่น (deploy เฉพาะ `main` ประหยัด Deployment Storage ของแผนฟรี 10 GB เจ้าของไม่ดู preview อยู่แล้ว)
- env: `DATABASE_URL` (Neon), `ADMIN_PASSWORD` (หลังบ้าน), `NEXT_PUBLIC_SITE_URL`, `AGODA_CID`, `NEXT_PUBLIC_POSTHOG_KEY` (+ `NEXT_PUBLIC_POSTHOG_HOST` ถ้าใช้ EU)
- ข้อควรระวัง: route ที่อ่านข้อมูลจาก DB ห้ามตั้ง `dynamicParams = false` (หลัง revalidateTag Next 15 จะตอบ 404) ให้ใช้ notFound() แทน
- เสร็จแล้ว: ข้อ 1 ในลำดับการทำ (ระบบดีไซน์ layout มือถือ หน้าแรก) + addendum 01 AI prompt (คลัง, หน้า prompt เดี่ยว, generator) + เครื่องคำนวณเลขมงคล `/tools/lucky-number` + สถานที่ในไทย + หมอดู (รายการ ตัวกรอง bottom sheet โปรไฟล์ หน้าตามศาสตร์ OG image) + สีเสื้อมงคลวันนี้ `/color-today` (การ์ดแชร์ 1080x1350 / 1080x1920) หน้าอื่นเป็นโครงรอ
- ภาพหมอดู: ภาพ SVG ตามศาสตร์ 3 แบบ (`src/lib/art/discipline-art.ts`, เสิร์ฟที่ `/art/[slug]-[n].svg`) เป็นชุดชั่วคราวจนกว่าจะมีภาพวาดจริงความละเอียดสูง
- หลักคำนวณเลขมงคล: **Numerology แบบพีทาโกรัส** (เจ้าของเลือกแล้ว) โค้ดอยู่ที่ `src/lib/lucky-number/` ที่เดียว การจับคู่เลขกับเป้าหมายอยู่ใน `meanings.ts` (เป็นการตีความของเว็บ แก้ได้)
- เช็กเบอร์มงคล `/tools/phone-number`: หลัก **ผลรวม + คู่เลข** (เจ้าของเลือก 2026-10-13) อ่าน 7 ตัวท้ายเป็น 6 คู่ 3 คู่สุดท้ายเป็นคู่หลัก โค้ด `src/lib/phone-number/` ความหมายคู่เลข/ผลรวมพร้อมแหล่ง `src/data/phone-pairs.ts` คู่เลขแนะนำตามวันเกิดใช้ทักษา (`personal.ts` หลักเดียวกับสีเสื้อ) คำนวณในเครื่องเท่านั้น ถาม AI ต่อไม่ส่งตัวเบอร์ affiliate ร้านขายเบอร์: เจ้าของกำลังคุย ยังไม่มีบล็อก
- เช็กทะเบียนรถ `/tools/license-plate`: ผลรวม = ค่าอักษร (`LETTER_VALUES` ใน `src/data/plate-letters.ts`) + ตัวเลขทุกตัวรวมเลขหน้าหมวด ไม่นับจังหวัด แสดงผลรวมหลักเดียวแบบตัวเลขล้วนด้วย คู่เลขใช้ `PHONE_PAIRS` + กลุ่มเฉพาะรถ อักษรกาลกิณี/อักษรเสริมตามวันเกิดจากอักษรประจำดาว (ทักษา) โค้ด `src/lib/license-plate/` ช่องวันเกิดใช้ร่วม `BirthDayField`
- ปุ่ม ถาม AI ต่อ ทำแล้วทั้งเลขมงคลและสีเสื้อ ส่งค่าผ่าน sessionStorage (`src/lib/prompt-handoff.ts`) ไม่ใส่วันเกิดใน URL; addendum 01 ที่ยังไม่ทำ: ปุ่มเปิดใน ChatGPT/Claude ยังไม่ทำเพราะยังไม่ได้ทดสอบว่า URL parameter ใช้ได้จริง
- คำสั่ง: `npm run dev`, `npm test`, `npm run typecheck`, `npm run build`

## โครงโค้ด
- `src/lib/goals.ts` อ่าน `data/goals.json` (แหล่งเดียวของเป้าหมาย)
- `src/lib/thai-date.ts` วันที่ไทย พ.ศ. ตามเวลา Asia/Bangkok
- `src/data/festivals.ts` + `src/lib/festivals.ts` เทศกาลและวันที่รายปี
- `src/data/daily-colors.ts` + `src/lib/daily-colors.ts` สีเสื้อตามหลักทักษา (คำนวณจากลำดับทักษา + สีประจำดาว), การ์ดแชร์ `src/lib/og/color-card.tsx` เสิร์ฟที่ `/color-today/card?goal=&size=portrait|story`
- `src/components/goal-context.tsx` จำเป้าหมายที่เลือกใน localStorage + cookie `mh_goal`
- `src/data/prompt-templates.ts` + `src/lib/prompts.ts` คลัง prompt, `GUARD_BLOCK` (ต่อท้ายทุก prompt ตอน render), ประกอบ prompt ฝั่ง client เท่านั้น
- `src/lib/analytics.ts` event copy_prompt / open_followup / click_to_fortune_teller / click_affiliate รับเฉพาะ slug goal discipline ส่งเข้า PostHog (`src/components/PostHogInit.tsx`: cookieless ไม่มีแบนเนอร์ ต้องเปิด Cookieless server hash mode ในโปรเจกต์ PostHog, proxy ผ่าน `/ingest` ใน next.config, ไม่อัดหน้าจอ ไม่นับ /admin) ส่วนที่ผู้ใช้กรอกข้อมูลส่วนตัวใส่ class `ph-no-capture`
- `src/lib/db.ts` (postgres.js, สร้างตารางอัตโนมัติใต้ advisory lock), `src/lib/directory-repo.ts` (อ่าน/เขียนตาราง directory + cache tag ตามประเภท) ใช้โดย `places-repo.ts` และ `tellers-repo.ts`, `src/lib/import/*-schema.ts` (ตรวจ JSON นำเข้า), `src/lib/admin-auth.ts` (รหัสผ่านเดียว)
- OG image หมอดู: `src/app/fortune-tellers/[slug]/opengraph-image.tsx` ใช้ฟอนต์ TTF ใน `src/assets/og` (ต้องอยู่ใน outputFileTracingIncludes ของ next.config)
- ชุดข้อมูลเริ่มต้น: `data/import/*.json` ลงทะเบียนใน `src/lib/seed-batches.ts` แล้วเจ้าของกดนำเข้าได้ที่ `/admin` (ข้าม slug ที่มีอยู่แล้ว ไม่เขียนทับ) Claude เข้าถึงฐานข้อมูล production ไม่ได้ ให้ส่งข้อมูลผ่านทางนี้
- ปฏิทินมงคล `/calendar`, `/calendar/[event]`: กาลโยครายปี (`src/data/auspicious.ts` ใส่เฉพาะปีที่มีประกาศสงกรานต์แล้ว ปีถัดไปออกราว ก.พ.-มี.ค.) + วันจันทรคติ (`src/data/lunar-calendar.ts` ข้อมูลถึง ม.ค. 2571) + กติกาตามงาน วันหลังช่วงกาลโยคล่าสุดแสดงเป็น "รอประกาศ" งานรายปี: เพิ่มกาลโยค จศ. 1389 หลังประกาศสงกรานต์ 2570 และขยายเดือนจันทรคติ
- มูต่างประเทศ `/abroad`, `/abroad/[country]`: สถานที่ต่างประเทศอยู่ตารางเดียวกับสถานที่ไทย (ช่อง `country` ISO + `city`) ประเทศที่รองรับอยู่ใน `src/data/countries.ts` (เพิ่มประเทศใหม่ต้องเพิ่มที่นี่ก่อนนำเข้า) หน้า `/places` หน้าจังหวัด และ carousel หน้าแรกแสดงเฉพาะในไทย
- SEO: `src/app/sitemap.ts` (รวมสถานที่/หมอดูจาก DB, revalidate 1 ชม.), `src/app/robots.ts` (กัน /admin), ทุกหน้าสาธารณะตั้ง `alternates.canonical` (หน้าใหม่ต้องใส่ด้วย และเพิ่มใน sitemap), หน้าแรกมี JSON-LD WebSite, ภาพแชร์เริ่มต้น `src/app/opengraph-image.tsx`
- ภาพ OG ภาษาไทย: Satori ไม่จัดวรรณยุกต์ซ้อนสระบน ฟอนต์ใน `src/assets/og` เพิ่มวรรณยุกต์ยกสูงด้วย `scripts/og-thai-marks.py` และทุก ImageResponse ต้องห่อด้วย `ogThai()` (`src/lib/og/thai.ts`)
- รูปสถานที่จากหลังบ้าน: `/admin` แท็บสถานที่ แตะช่องรูป (`PlaceImageSlot` เปิด bottom sheet + `PlaceImagesForm`) ย่อรูปในเบราว์เซอร์ webp ถ้าทำไม่ได้ (Safari) ใช้ JPG อัปโหลดผ่าน `/admin/media` เก็บในคอลัมน์ `extra_images` (แยกจาก data นำเข้าซ้ำไม่ล้าง) แสดงก่อนรูปจากไฟล์นำเข้า ต้องใส่เจ้าของภาพ + สิทธิ์ และติ๊กยืนยันว่าเป็นภาพจริงไม่ใช่ AI/Google Maps
- สถานที่หน้าแรก/หน้าเป้าหมาย: `featuredPlaces()` ใน `src/lib/places.ts` เอาเฉพาะที่มีภาพ (เจ้าของขอ 2026-10-13) เรียง ปักหมุด `home` จากหลังบ้าน > `POPULAR_PLACE_SLUGS` (`src/data/popular-places.ts` แก้รายการได้) > ที่เหลือ การ์ดต่างประเทศหน้าแรกก็ใช้กติกาเดียวกัน
- ภาพแทนสถานที่ที่ยังไม่มีรูป: `src/lib/place-placeholder.ts` (ภาพบรรยากาศ AI ที่เจ้าของให้มา 2026-10-13 แยกตามประเภทใน `BY_TYPE` ตอนนี้มีวัด ศาลเจ้าจีน ที่เหลือใช้ภาพกลาง) ใช้ในการ์ดและหัวหน้าสถานที่ ป้ายบอกว่า ยังไม่มีภาพสถานที่นี้ ไม่ใช้เป็น OG ไม่นับว่ามีภาพ (ไม่ขึ้นหน้าแรก)
- ใกล้ฉัน: `src/lib/geo.ts` + ปุ่มใน `PlacesBrowser` ตำแหน่งใช้ในเบราว์เซอร์เท่านั้น พิกัดสถานที่บังคับตอนนำเข้า
- ภาพ hero หน้าแรก `public/images/hero/` เป็นภาพ AI ที่เจ้าของให้มา ใช้เป็นภาพบรรยากาศได้ แต่ห้ามนำภาพ AI ไปใช้เป็นภาพสถานที่จริง
- สินค้า affiliate (Shopee): ตาราง `products` นำเข้าที่ `/admin/import?kind=products` (`src/lib/import/product-schema.ts` รับเฉพาะลิงก์ affiliate `s.shopee.co.th` / `shope.ee`) ตอนนี้ใช้กับเสื้อสีมงคล: `listShirtOffers()` สีละ 1 ตัว แสดงรูปแทนไอคอนใน `/color-today` และการ์ดหน้าแรก + ลิงก์ rel="sponsored" ป้าย ลิงก์ affiliate (การ์ดแชร์ PNG ยังใช้ไอคอน) รูปสินค้าเก็บที่ `public/images/shirts/`
- ที่พัก Agoda: `src/lib/agoda.ts` ลิงก์ `partners/partnersearch.aspx?pcs=1&cid=&city=&poi=` (ทดสอบแล้ว 2026-10-12 cid คงอยู่หลัง redirect) รหัส city/poi อยู่ที่ `src/data/agoda-ids.ts` (มี poi = ที่พักรอบสถานที่ ไม่มี = ทั้งจังหวัด) แสดงทุกสถานที่รวม กทม. (เจ้าของขอ 2026-10-12) + หน้าจังหวัด ผ่าน `LodgingBlock` ไม่มี AGODA_CID = ไม่แสดง
- ปักหมุดหมอดู: คอลัมน์ `pinned_in text[]` (แยกจาก data นำเข้าซ้ำไม่ล้าง) ตั้งที่ `/admin` แท็บหมอดู ค่า = slug ศาสตร์ หรือ `all` (หน้ารวม) `sortPinned()` ใน `src/lib/tellers.ts` ป้าย `PINNED_LABEL` = ผู้สนับสนุน (เจ้าของเปลี่ยน 2026-10-12)
- บทความ: เขียนที่ `/admin/articles` (ตาราง `articles`, ตรวจด้วย `src/lib/import/article-schema.ts`) เนื้อหาเป็น markdown แบบย่อ render ด้วย `src/lib/markdown.tsx` (ไม่รับ HTML ดิบ) หน้าเว็บ `/articles/[slug]` + รายการใน `/festival` + "อ่านต่อ" ในหน้าเทศกาลที่ผูกไว้ รูปอัปโหลดเก็บในตาราง `media` (เบราว์เซอร์ย่อเป็น webp ≤1600px ก่อนส่ง, POST `/admin/media` เฉพาะแอดมิน, เสิร์ฟ `/media/[id]` cache immutable) รูปปกหน้าเทศกาลแทนรูปในโค้ดได้ (ตาราง `festival_covers`, `withCover()` ใน `src/lib/festivals.ts`) บทความตั้งต้นใน `data/articles/*.json` ลงทะเบียนที่ `src/lib/starter-articles.ts` เจ้าของกดนำเข้าเป็นฉบับร่างที่ `/admin/articles`
- หน้าแรก เทศกาล: ขึ้นล่วงหน้า 45 วัน (ตั้งรายเทศกาลด้วย `featureDays`) แสดงไม่เกิน 3 ใบ + บทความที่ผูกกับเทศกาลที่กำลังจะมา (`festivalArticles()`) ขึ้นและหายเองตามช่วงเทศกาล หน้าเทศกาลมี section style `checklist`/`steps` และ `placeFilter` สำหรับ ไหว้ที่ไหนดี
- ขนาดตัวอักษร: ทั้งเว็บใหญ่ขึ้น (ฐาน 18px เจ้าของขอ 2026-10-13 ผู้ใช้สูงอายุเยอะ) ทุก font-size ต้องคูณ `var(--fs)` (ใช้ token `--text-*` หรือ `calc(Npx * var(--fs))`) ปุ่ม ก ก ก (`TextSizeToggle`) อยู่ในเมนูและหน้าบทความ ค่าเริ่มต้น = ขนาดกลาง 1.12 (เจ้าของขอ 2026-10-13) ตั้ง `html[data-text-size]` m = 1 / xl = 1.25 เก็บใน localStorage `mh_fs` สคริปต์ใน head ตั้งค่าก่อนวาดหน้า (`src/lib/text-size.ts`)
- โลโก้: ของเจ้าของ (`design/logo/logo-original.jpg`) ตัดเป็น `public/logo-badge.png` (โลโก้เต็ม ใช้ภาพแชร์หลัก) และ `public/logo-mark.png` / `logo-mark-96.webp` (เหรียญ M ใช้ header การ์ดสีเสื้อ) favicon `src/app/icon.png` + `apple-icon.png` ภาพแชร์อ่านผ่าน `src/lib/og/logo.ts`
