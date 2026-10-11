import { ExploreGrid } from '@/components/ExploreGrid';
import { FestivalCard } from '@/components/FestivalCard';
import { GoalPicker } from '@/components/GoalPicker';
import { LuckyNumberShortcut } from '@/components/LuckyNumberShortcut';
import { PlacesForGoal } from '@/components/PlacesForGoal';
import { SectionHeader } from '@/components/SectionHeader';
import { ShirtColorCard } from '@/components/ShirtColorCard';
import { SiteHeader } from '@/components/SiteHeader';
import { upcomingFestivals } from '@/lib/festivals';
import { bangkokDay, formatThaiFullDate } from '@/lib/thai-date';

// วันที่ สีเสื้อ และเทศกาลขึ้นกับวัน จึงสร้างหน้าใหม่ทุก 10 นาที
export const revalidate = 600;

export default function HomePage() {
  const today = bangkokDay();
  const festivals = upcomingFestivals(today.iso);

  return (
    <main>
      <section className="hero">
        {/* TODO: ภาพบรรยากาศจริงพร้อมเครดิต (ห้ามใช้ภาพตัวอย่างใน design/mockups/images) */}
        <div className="hero__art" aria-hidden="true" />
        <div className="hero__scrim" aria-hidden="true" />
        <SiteHeader overlay />
        <div className="hero__content">
          <p className="hero__date">{formatThaiFullDate(today)}</p>
          <h1 className="hero__title">
            วันนี้อยากเสริม
            <br />
            เรื่องอะไร
          </h1>
        </div>
      </section>

      <GoalPicker />

      <div className="home-split">
        <div>
          <ShirtColorCard weekday={today.weekday} />
          <LuckyNumberShortcut />
        </div>
        {festivals.length > 0 && (
          <div>
            <SectionHeader title="เทศกาลที่กำลังจะมา" />
            <div className="stack">
              {festivals.map((o) => (
                <FestivalCard key={`${o.festival.slug}-${o.date.year}`} occurrence={o} />
              ))}
            </div>
          </div>
        )}
      </div>

      <PlacesForGoal />

      <SectionHeader title="มูเรื่องไหนดี" />
      <ExploreGrid />
    </main>
  );
}
