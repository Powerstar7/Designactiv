import { useNavigate, useParams } from 'react-router-dom';
import ToolPageInner from '../components/ToolPage';
import { tools } from '../data/tools';

export function ToolPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const tool = tools.find((t) => t.id === id);

  if (!tool) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-black text-white mb-4">Tool not found</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleNavigate = (page: string) => {
    if (page === 'home') navigate('/');
    else if (page === 'shop') navigate('/');
    else navigate(`/${page}`);
  };

  return (
    <ToolPageInner
      tool={tool}
      onBack={() => navigate(-1)}
      onNavigate={handleNavigate}
    />
  );
}
