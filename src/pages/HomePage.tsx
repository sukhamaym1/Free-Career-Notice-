import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ActionGroup from '../components/ActionGroup';
import NewUpdates from '../components/NewUpdates';
import ColorfulGrid from '../components/ColorfulGrid';
import ListSection from '../components/ListSection';
import { JOB_NOTIFICATIONS, ADMIT_CARDS, RESULTS } from '../data';

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 pb-20 animate-in fade-in duration-500">
      <Hero />
      
      <div className="mb-12">
        <ActionGroup />
      </div>

      <NewUpdates />
      
      <ColorfulGrid />

      {/* Three Columns Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ListSection title="Job Notifications" items={JOB_NOTIFICATIONS} viewAllLink="/category/job-notifications" />
        <ListSection title="Admit Card" items={ADMIT_CARDS} viewAllLink="/category/admit-card" />
        <ListSection title="Results" items={RESULTS} viewAllLink="/category/results" />
      </div>
    </main>
  );
}
