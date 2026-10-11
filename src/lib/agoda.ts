/**
 * ลิงก์ที่พัก Agoda (spec ข้อ 4.2)
 * CID อยู่ใน env AGODA_CID เท่านั้น ห้าม hardcode
 * ยังไม่ได้ยืนยันรูปแบบ deep link ที่บัญชี partner รองรับ (city id / พิกัด / วันที่)
 * จึงใช้เฉพาะลิงก์ที่ใส่เองต่อสถานที่ (agodaLinkOverride) ไปก่อน
 * เมื่อได้รูปแบบจากบัญชี partner แล้ว ให้ประกอบลิงก์อัตโนมัติในฟังก์ชันนี้ที่เดียว
 * (ใช้ร่วมกันทั้งหน้าสถานที่ หน้าจังหวัด หน้าเทศกาล)
 */
export interface AgodaTarget {
  provinceSlug: string;
  lat: number | null;
  lng: number | null;
  agodaLinkOverride?: string;
}

export function agodaLink(target: AgodaTarget): string | null {
  return target.agodaLinkOverride ?? null;
}

/** บล็อกที่พักแสดงเฉพาะต่างจังหวัด (spec ข้อ 3.2) */
export const showsLodging = (target: AgodaTarget) => target.provinceSlug !== 'bangkok';
