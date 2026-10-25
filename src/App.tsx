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
import AdminPriceModal from "./components/AdminPriceModal";
import { ServiceProvider, useServices } from "./context/ServiceContext";

function MainApp() {
  const { discountRibbon } = useServices();

  return (
    <main className="relative transition-all duration-300 pt-9">
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Gallery />
      <PriceList />
      <Footer />
      <WhatsAppButton />
      <AdminPriceModal />
    </main>
  );
}

export default function App() {
  return (
    <ServiceProvider>
      <MainApp />
    </ServiceProvider>
  );
}
