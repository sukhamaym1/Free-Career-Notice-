export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-3xl">
      {/* Base background color */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#020817] transition-colors duration-500" />
      
      {/* Static Gradient Blobs - low opacity, minimal blur */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl opacity-50" />
      
      {/* Simple Grid pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]"
        style={{ backgroundSize: '2rem 2rem' }}
      />
    </div>
  );
}
