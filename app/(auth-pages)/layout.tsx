export default async function AuthPagesLayout({
  // Renamed for clarity
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove the restrictive div and just return children,
  // or return a simple div if absolutely needed for some future reason,
  // but without height/width/flex constraints here.
  return <>{children}</>;

  // Or, if you prefer keeping a div wrapper for semantic reasons,
  // make it neutral:
  // return <div>{children}</div>;
}
