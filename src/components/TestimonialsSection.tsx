import { Star, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const testimonials = [
  {
    name: 'Jack Hathaway',
    location: 'UK',
    rating: 5,
    quote: 'The service here were beyond my wildest dreams',
    body: "This world's #1 fully cloud-based software helps you to create designer-quality professional designs without any tech skills.",
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    name: 'Sarah Mitchell',
    location: 'USA',
    rating: 5,
    quote: 'Saved my business thousands in design costs!',
    body: "I was spending over $2000/month on a freelance designer. With DesignActiv I do everything myself in minutes. Absolute game-changer.",
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    name: 'Marco Rossi',
    location: 'Italy',
    rating: 5,
    quote: 'The background remover alone is worth 10x the price',
    body: "I use the AI background remover for all my product photos. The quality is incredible and it saves me hours every single week.",
    photo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

export default function TestimonialsSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#160f2e] py-16 px-4" id="testimonials">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-8 h-8 text-brand-400 fill-brand-400" />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {t('testimonials.featuredQuote')}
          </h2>
          <p className="text-gray-400 italic text-lg max-w-2xl mx-auto">
            "{t('testimonials.featuredBody')}"
          </p>
          <p className="text-brand-400 font-bold mt-3">— Jack Hathaway, UK</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {testimonials.map((item, i) => (
            <div key={i} className="card-dark p-6 rounded-2xl relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-brand-500/20" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 text-brand-400 fill-brand-400" />
                ))}
              </div>
              <h4 className="text-white font-bold text-lg mb-2">"{item.quote}"</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.body}</p>
              <div className="flex items-center gap-3 border-t border-[#2a1f5c] pt-4">
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-bold text-sm">{item.name}</p>
                  <p className="text-gray-500 text-xs">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
