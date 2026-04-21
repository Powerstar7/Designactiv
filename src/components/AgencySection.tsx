import { useLanguage } from '../context/LanguageContext';

interface AgencySectionProps {
  onNavigate: (page: string) => void;
}

export default function AgencySection({ onNavigate: _onNavigate }: AgencySectionProps) {
  const { t } = useLanguage();

  return (
    <section className="py-0 relative overflow-hidden" id="agency">
      <div className="relative">
        <img
          src="https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Design Agency workspace"
          className="w-full h-72 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0a1e]/80 to-transparent flex items-center">
          <div className="px-8 md:px-16">
            <a
              href="https://www.powerstar7.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-6 max-w-xs block hover:bg-white/15 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-xs">P7</span>
                </div>
                <div>
                  <p className="text-white font-black text-sm">Powerstar7</p>
                  <p className="text-gray-300 text-xs">{t('agency.digitalAgency')}</p>
                </div>
              </div>
              <p className="text-gray-200 text-sm">www.powerstar7.com</p>
            </a>
          </div>
        </div>
      </div>

      <div className="bg-[#0f0a1e] py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 opacity-50">
          {['VISA', 'Mastercard', 'PayPal', 'Amex', 'Stripe', 'Discover'].map((brand) => (
            <div key={brand} className="bg-white/10 text-white text-sm font-bold px-4 py-2 rounded-lg">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
