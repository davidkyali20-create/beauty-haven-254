/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import PriceList from "./components/PriceList";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

export default function App() {
  return (
    <main className="relative pt-[32px]">
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Gallery />
      <PriceList />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}

