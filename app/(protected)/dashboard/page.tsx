export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import DashboardContent from './DashboardContent';

export default function Page() {
  return <DashboardContent />;
}
