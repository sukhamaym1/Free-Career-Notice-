import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="font-bold text-xl leading-none tracking-tight text-white">
                Free Career <br />
                <span className="text-green-500">Notice</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted portal for the latest job notifications, admit cards, exam results, and career updates across India. Stay ahead in your career journey with real-time alerts.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all text-slate-400">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all text-slate-400">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all text-slate-400">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />Home</Link></li>
              <li><Link to="/category/job-notifications" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />Latest Job Notifications</Link></li>
              <li><Link to="/category/admit-card" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />Admit Cards Download</Link></li>
              <li><Link to="/category/results" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />Exam Results</Link></li>
              <li><Link to="/category/answer-keys" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />Answer Keys</Link></li>
              <li><Link to="/category/syllabus" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />Syllabus & Exam Pattern</Link></li>
              <li><Link to="/admin" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />Admin Panel</Link></li>
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Top Categories</h3>
            <ul className="space-y-3">
              <li><Link to="/category/ssc-exams" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />SSC Exams</Link></li>
              <li><Link to="/category/railway" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />Railway (RRB)</Link></li>
              <li><Link to="/category/banking" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />Banking (IBPS/SBI)</Link></li>
              <li><Link to="/category/upsc" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />UPSC / State PSC</Link></li>
              <li><Link to="/category/defence" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />Defence / Police Jobs</Link></li>
              <li><Link to="/category/teaching" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors group"><ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />Teaching Jobs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                <span>123 Career Avenue, Tech Park, Block B, New Delhi, India 110001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-rose-500 shrink-0" />
                <a href="mailto:support@freecareernotice.com" className="hover:text-white transition-colors">
                  support@freecareernotice.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Free Career Notice. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
