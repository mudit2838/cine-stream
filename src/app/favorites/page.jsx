import Favorites from '@/components/Favorites';
export const metadata = {
  title: 'Your Favorite Movies',
  robots: { index: false, follow: true },
};
export default function Page() {
  return <Favorites />;
}
