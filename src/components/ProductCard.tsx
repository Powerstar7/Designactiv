import { BookOpen } from 'lucide-react';
import { Tool, localizeTool } from '../data/tools';
import ToolIcon from './ToolIcon';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  tool: Tool;
  onClick: () => void;
}

export default function ProductCard({ tool: baseTool, onClick }: ProductCardProps) {
  const { t, lang } = useLanguage();
  const tool = localizeTool(baseTool, lang);

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-6 text-left hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group border border-gray-100 hover:border-brand-200"
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: tool.color + '20', border: `2px solid ${tool.color}40` }}
        >
          <ToolIcon iconName={tool.icon} size={28} color={tool.color} />
        </div>
        <div>
          <h3 className="font-black text-gray-900 text-sm leading-tight uppercase tracking-tight">
            {tool.name}
          </h3>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-2">
        <p className="text-gray-600 text-sm font-medium">{tool.subtitle}</p>
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" style={{ color: tool.color }} />
          <span className="text-sm font-semibold" style={{ color: tool.color }}>
            {t('products.lessons')}: {tool.lessons}
          </span>
        </div>
      </div>
    </button>
  );
}
