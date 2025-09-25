import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect root path to home page to show manga immediately
  redirect('/home');
}