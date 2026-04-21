import { LayoutDashboard, Play, BookOpen, Award, ChevronRight } from 'lucide-react';
import { tools, localizeTool } from '../data/tools';
import ToolIcon from '../components/ToolIcon';
import { useLanguage } from '../context/LanguageContext';

interface DashboardPageProps {
  onToolSelect: (toolId: string) => void;
}

export default function DashboardPage({ onToolSelect }: DashboardPageProps) {
  const { t, lang } = useLanguage();
  const localizedTools = tools.map((x) => localizeTool(x, lang));

  const stats = [
    { label: t('dashboard.toolsAvail'), value: '9', color: 'text-brand-400' },
    { label: t('dashboard.totalLessons'), value: '95', color: 'text-cyan-400' },
    { label: t('dashboard.projectsCreated'), value: '0', color: 'text-green-400' },
    { label: t('dashboard.daysActive'), value: '1', color: 'text-yellow-400' },
  ];

  const steps = [
    t('dashboard.step1'),
    t('dashboard.step2'),
    t('dashboard.step3'),
    t('dashboard.step4'),
  ];

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-brand-500/20 border border-brand-500/40 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{t('dashboard.title')}</h1>
            <p className="text-gray-500 text-sm">{t('dashboard.welcome')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="card-dark rounded-xl p-5 text-center">
              <p className={`text-3xl font-black mb-1 ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Play className="w-5 h-5 text-brand-400" />
            <h2 className="text-xl font-black text-white">{t('dashboard.yourTools')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {localizedTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className="card-dark rounded-xl p-5 text-left hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
                style={{ borderColor: tool.color + '30' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: tool.color + '20' }}
                  >
                    <ToolIcon iconName={tool.icon} size={22} color={tool.color} />
                  </div>
                  <h3 className="text-white font-black text-sm leading-tight">{tool.name}</h3>
                </div>
                <p className="text-gray-400 text-xs mb-3">{tool.subtitle}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" style={{ color: tool.color }} />
                    <span className="text-xs font-semibold" style={{ color: tool.color }}>
                      {tool.lessons} {t('dashboard.lessons')}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card-dark rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-brand-400" />
            <h3 className="text-white font-bold">{t('dashboard.gettingStarted')}</h3>
          </div>
          <ul className="space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-400 text-sm">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
