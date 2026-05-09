import { AuthSection } from "./components/form/AuthSection";
import { ClientSection } from "./components/form/ClientSection";
import { ParamsSection } from "./components/form/ParamsSection";
import { ProductsSection } from "./components/form/ProductsSection";
import { FooterActions } from "./components/form/FooterActions";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <h1 className="text-xl font-bold text-center">Мобильный заказ</h1>
        <p className="text-sm text-muted-foreground text-center">WebApp для создания продажи и проведения в один клик.</p>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        <AuthSection />
        <p className="text-sm text-muted-foreground mb-4">Касса не подключена</p>
        <ClientSection />
        <ParamsSection />
        <ProductsSection />
      </main>

      <FooterActions />
    </div>
  );
}

export default App;