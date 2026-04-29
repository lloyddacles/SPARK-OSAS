export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // PASS-THROUGH ONLY: The Root ClientWrapper handles all Sidebar and Nav logic.
  // This prevents the 'Double Sidebar' mess.
  return <>{children}</>;
}
