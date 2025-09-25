import React from "react";
import { Github, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[rgba(30,30,30,0.85)] border-t border-[rgba(0,225,255,0.2)] backdrop-blur-md py-6 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[#b4b4b4] text-sm flex items-center">
            <span>Made with</span>
            <Heart size={20} className="mx-2 text-[#E10091] stroke-2" />
            <span>for ton.band sessions</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-[#b4b4b4] hover:text-[#00e1ff] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={22} />
            </a>
            <span className="text-[#b4b4b4] text-sm">2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
