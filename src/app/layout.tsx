import "./globals.css";

import { Montserrat } from 'next/font/google';
import type { Metadata } from 'next';
import BackToTop from "./components/ui/BacktoTop";

// for fontsize control
import FontSizeControl from "./components/fontZoom/FontsizeControl";
import { FontSizeProvider } from "./components/fontZoom/FontsizeContext";

import { AssessmentProvider } from "@/contexts/AssessmentContext";

// components
import AssistantWidget from "./components/chatbot/AssistantWidget";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

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