const fs = require('fs');
let code = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

const target = `  const { JOB_NOTIFICATIONS, ADMIT_CARDS, RESULTS } = useData();`;
const replacement = `  const { JOB_NOTIFICATIONS, ADMIT_CARDS, RESULTS, SITE_SETTINGS } = useData();
  const settings = SITE_SETTINGS as any;`;

const bannerTarget = `      <motion.div variants={itemVariants}>
        <Hero />
      </motion.div>`;
const bannerReplacement = `      <motion.div variants={itemVariants}>
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
      </motion.div>`;

code = code.replace(target, replacement);
code = code.replace(bannerTarget, bannerReplacement);
fs.writeFileSync('src/pages/HomePage.tsx', code);
console.log("HomePage patched");
