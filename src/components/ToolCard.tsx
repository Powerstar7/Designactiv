import ToolIcon from './ToolIcon';
import type { Tool } from '../data/tools';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

export function ToolCard({ tool, onClick }: ToolCardProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-xl shadow-md border border-gray-100 p-6 text-left hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: tool.color }}
      >
        <ToolIcon iconName={tool.icon} size={28} color="#ffffff" />
      </div>
      <h3 className="text-sm font-bold text-gray-900 mb-1">{tool.name}</h3>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{tool.subtitle}</p>
    </button>
  );
}
