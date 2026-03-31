import "./globals.css";

export const metadata = {
  title: "Slightly Biased News",
  description:
    "Multi-agent editorial intelligence platform that analyzes news coverage for bias, credibility, and perspective diversity across major publications.",
  keywords: ["news bias", "media analysis", "editorial intelligence", "fact checking"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400..700;1,400..700&family=DM+Serif+Display:ital@0;1&family=Newsreader:ital,wght@0,300..600;1,300..600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
