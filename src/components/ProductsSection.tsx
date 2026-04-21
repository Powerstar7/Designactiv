import { tools } from '../data/tools';
import ProductCard from './ProductCard';
import { useLanguage } from '../context/LanguageContext';

interface ProductsSectionProps {
  onToolSelect: (toolId: string) => void;
}

export default function ProductsSection({ onToolSelect }: ProductsSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="bg-[#f4f6fa] py-16 px-4" id="products">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-6">{t('products.title')}</h2>
          <div className="bg-gradient-to-r from-brand-500 to-fuchsia-500 rounded-2xl p-8 max-w-3xl mx-auto">
            <p className="text-white font-black text-2xl md:text-3xl leading-tight">
              {t('products.banner')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ProductCard
              key={tool.id}
              tool={tool}
              onClick={() => onToolSelect(tool.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
