import { motion } from 'motion/react';
import Hero from '../components/Hero';
import QuickAccess from '../components/QuickAccess';
import ActionGroup from '../components/ActionGroup';
import ColorfulGrid from '../components/ColorfulGrid';
import ListSection from '../components/ListSection';
import { useData } from '../components/DataProvider';
import HomepagePopup from '../components/HomepagePopup';

export default function HomePage() {
  const { JOB_NOTIFICATIONS, ADMIT_CARDS, RESULTS, SITE_SETTINGS } = useData();
  const settings = SITE_SETTINGS as any;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <>
      <HomepagePopup />
      <motion.main 
        className="container mx-auto px-4 pb-20 pt-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          {settings.homepageBanner && (
            <div className="w-full mb-8 rounded-2xl overflow-hidden shadow-sm">
              <img src={settings.homepageBanner} alt="Announcement Banner" className="w-full h-auto object-cover" />
            </div>
          )}
          {settings.homepageAnnouncement && (
            <div className="w-full mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl border border-blue-200 dark:border-blue-800/50 text-center font-medium shadow-sm">
              {settings.homepageAnnouncement}
            </div>
          )}
          <Hero />
        </motion.div>

        <motion.div variants={itemVariants}>
          <QuickAccess />
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-12">
          <ActionGroup />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <ColorfulGrid />
        </motion.div>
        
        {/* Three Columns Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <ListSection title="Job Notifications" items={JOB_NOTIFICATIONS} viewAllLink="/category/job-notifications" />
          <ListSection title="Admit Card" items={ADMIT_CARDS} viewAllLink="/category/admit-card" />
          <ListSection title="Results" items={RESULTS} viewAllLink="/category/results" />
        </motion.div>
      </motion.main>
    </>
  );
}
