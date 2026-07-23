import { ThemeProvider } from '@/context/ThemeContext';
import { useRouter } from '@/hooks/useRouter';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';

function App() {
  const { route, navigate } = useRouter();

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar route={route} navigate={navigate} />
        <main className="flex-1">
          {route === 'home' && <HomePage navigate={navigate} />}
          {route === 'about' && <AboutPage navigate={navigate} />}
          {route === 'contact' && <ContactPage />}
        </main>
        <Footer navigate={navigate} />
      </div>
    </ThemeProvider>
  );
}

export default App;
