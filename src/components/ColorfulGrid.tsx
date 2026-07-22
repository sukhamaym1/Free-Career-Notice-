import { COLOR_BLOCKS } from '../data';
import { Link } from 'react-router-dom';

export default function ColorfulGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
      {COLOR_BLOCKS.map((block, idx) => (
        <Link
          key={idx}
          to={block.id ? `/post/${block.id}` : "/post/wbpsc-recruitment-2026"}
          className={`block p-6 ${block.bgClass} text-white hover:brightness-110 transition-all shadow-sm rounded-lg`}
        >
          <h3 className="text-lg md:text-xl font-bold leading-tight">
            {block.title}
          </h3>
        </Link>
      ))}
    </div>
  );
}
