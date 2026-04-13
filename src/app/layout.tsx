import "./globals.css";

import { Montserrat } from 'next/font/google';
import type { Metadata } from 'next';
import BackToTop from "./components/BacktoTop";

// for fontsize control
import FontSizeControl from "./components/fontZoom/FontsizeControl";
import { FontSizeProvider } from "./components/fontZoom/FontsizeContext";

import { AssessmentProvider } from "./assessment/AssessmentContext";
import AssistantWidget from "./components/AssistantWidget";

// components
import Header from "./components/Header";
import Footer from "./components/Footer";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AANR TRACER',
  description: 'We’re building something great.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AssessmentProvider>
          <FontSizeProvider>
            <Header />
            {children}
            <AssistantWidget
              context={{
                technologyType: "",
                currentCategory: "",
                currentTRLLevel: 0,
                questionText: undefined,
              }}
            />
            <Footer />
            <FontSizeControl />
            <BackToTop />
        </FontSizeProvider>
      </AssessmentProvider>
      </body>
    </html>
  );
}