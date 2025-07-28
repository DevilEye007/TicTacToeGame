import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaRegCopy,
  FaCheck,
} from "react-icons/fa";
import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const Contact = () => {
  return (
    <motion.div
      className="mt-10 w-full max-w-md mx-auto bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 text-sm text-gray-200 shadow-2xl transition-all duration-700 ease-in-out hover:scale-[1.01]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Toaster position="top-right" toastOptions={{ duration: 1500 }} />

      <h2 className="text-xl text-white font-bold mb-5 border-b border-gray-600 pb-2 flex items-center gap-2">
        Let's Connect
      </h2>

      <div className="space-y-4">
        <ContactItem
          icon={<FaEnvelope className="text-blue-400 animate-pulse" />}
          text="fs6700408@gmail.com"
          copy
          color="hover:text-blue-300"
        />
        <ContactItem
          icon={<FaPhone className="text-green-400" />}
          text="+923107889209"
          copy
          color="hover:text-green-300"
        />
        <ContactItem
          icon={<FaMapMarkerAlt className="text-red-400" />}
          text="Pasrur, Punjab, Pakistan"
          color="hover:text-red-300"
        />
        <ContactItem
          icon={<FaGlobe className="text-purple-400" />}
          text="faizan-posrfolio.vercel.app"
          link="https://faizan-posrfolio.vercel.app/"
          color="hover:text-purple-300"
        />
        <ContactItem
          icon={<FaLinkedin className="text-blue-500" />}
          text="linkedin.com/in/faizan-sultan-302b1b24b"
          link="https://pk.linkedin.com/in/faizan-sultan-302b1b24b"
          color="hover:text-blue-400"
        />
        <ContactItem
          icon={<FaGithub className="text-gray-300" />}
          text="github.com/DevilEye007"
          link="https://github.com/DevilEye007"
          color="hover:text-gray-300"
        />
      </div>
    </motion.div>
  );
};

const ContactItem = ({ icon, text, link, copy = false, color }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const baseClasses = `flex items-center justify-between transition-transform duration-300 transform hover:translate-x-1 ${color}`;

  return (
    <motion.div
      className={baseClasses}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        {link ? (
          <a
            href={link}
            className="hover:underline focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
            target="_blank"
            rel="noreferrer"
          >
            {text}
          </a>
        ) : (
          <span>{text}</span>
        )}
      </div>

      {copy && (
        <button
          onClick={handleCopy}
          className="ml-2 text-gray-400 hover:text-white transition"
          title="Copy"
        >
          {copied ? (
            <FaCheck className="text-green-400 transition duration-300" />
          ) : (
            <FaRegCopy />
          )}
        </button>
      )}
    </motion.div>
  );
};

export default Contact;
