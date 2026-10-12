/** ป้ายเครดิตรูป: วางใน container ที่ position: relative */
export function CreditBadge({ credit, position = 'bottom-left' }: { credit: string; position?: 'bottom-left' | 'top-right' | 'bottom-right' }) {
  return <span className={`credit-badge credit-badge--${position}`}>ภาพ: {credit}</span>;
}
