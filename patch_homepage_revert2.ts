import fs from 'fs';

const content = `import { motion } from 'motion/react';
import Hero from '../components/Hero';
import ActionGroup from '../components/ActionGroup';
import ColorfulGrid from '../components/ColorfulGrid';
import ListSection from '../components/ListSection';
import { JOB_NOTIFICATIONS, ADMIT_CARDS, RESULTS } from '../data';

export default function HomePage() {
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
    <motion.main 
      className="container mx-auto px-4 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <Hero />
      </motion.div>
      
      <motion.div variants={itemVariants} className="mb-12">
        <ActionGroup />
      </motion.div>
            
      <motion.div variants={itemVariants}>
        <ColorfulGrid />
      </motion.div>
      
      {/* Three Columns Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ListSection title="Job Notifications" items={JOB_NOTIFICATIONS} viewAllLink="/category/job-notifications" />
        <ListSection title="Admit Card" items={ADMIT_CARDS} viewAllLink="/category/admit-cards" />
        <ListSection title="Results" items={RESULTS} viewAllLink="/category/results" />
      </motion.div>
    </motion.main>
  );
}
`;

fs.writeFileSync('src/pages/HomePage.tsx', content);
