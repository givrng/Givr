import React, { useState, useEffect, useCallback } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  X,  
} from 'lucide-react';

// --- Interfaces ---

interface ShareData {
  title: string;
  text: string;
  url: string;
}

// interface SocialPlatform {
//   name: string;
//   icon: React.ReactElement<LucideIcon>;
//   color: string;
//   link: string;
// }

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: ShareData;
}

// --- Internal Modal Component ---

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareData }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isNativeSupported, setIsNativeSupported] = useState<boolean>(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      setIsNativeSupported(true);
    }
  }, []);

  const handleNativeShare = async (): Promise<void> => {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const copyToClipboard = (): void => {
    const textArea = document.createElement("textarea");
    textArea.value = shareData.url;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  // const socialPlatforms: SocialPlatform[] = [
  //   {
  //     name: 'Twitter',
  //     icon: <Twitter size={20} />,
  //     color: 'bg-black text-white',
  //     link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`
  //   },
  //   {
  //     name: 'Facebook',
  //     icon: <Facebook size={20} />,
  //     color: 'bg-[#1877F2] text-white',
  //     link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`
  //   },
  //   {
  //     name: 'LinkedIn',
  //     icon: <Linkedin size={20} />,
  //     color: 'bg-[#0077B5] text-white',
  //     link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`
  //   },
  //   {
  //     name: 'Email',
  //     icon: <Mail size={20} />,
  //     color: 'bg-gray-600 text-white',
  //     link: `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`
  //   }
  // ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 ml-2">
            <Share2 size={18} className="text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-800">Share</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {isNativeSupported && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all active:scale-[0.98]"
            >
              
              <Share2 size={20} /> Share Project
            </button>
          )}

          {/* <div className="grid grid-cols-4 gap-4">
            {socialPlatforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-12 h-12 ${platform.color} rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110`}>
                  {platform.icon}
                </div>
                <span className="text-xs font-medium text-gray-600">{platform.name}</span>
              </a>
            ))}
          </div> */}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Copy Link</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-1.5 rounded-xl">
              <div className="flex-1 overflow-hidden px-2">
                <p className="text-xs text-gray-500 truncate font-mono">{shareData.url}</p>
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex items-center justify-center gap-2 h-10 px-4 rounded-lg font-semibold transition-all ${
                  copied 
                    ? 'bg-green-500 text-white w-28' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 w-24'
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="text-sm">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- The Custom Hook ---

export const useShareModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ShareData>({ title: '', text: '', url: '' });

  const openShare = useCallback((shareConfig: ShareData) => {
    setData(shareConfig);
    setIsOpen(true);
  }, []);

  const closeShare = useCallback(() => {
    setIsOpen(false);
  }, []);

  const ShareModalComponent = () => (
    <ShareModal isOpen={isOpen} onClose={closeShare} shareData={data} />
  );

  return { openShare, ShareModalComponent };
};


export default useShareModal;