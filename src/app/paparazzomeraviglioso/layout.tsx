import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Amministrazione Blog',
  description: 'Pannello di controllo per modificare gli articoli del blog',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}