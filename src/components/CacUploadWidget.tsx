
import { FileText, Upload, AlertCircle,  ExternalLink } from 'lucide-react';
import { CloudinaryUpload } from './CloudinaryWidget';
import type { OrganizationProps } from '../interface/interfaces';

/**
 * CAC Document Upload Widget
 * Designed for organization registration flows.
 * Includes support for PDFs and Images with a preview/status indicator.
 */
const CACUploadWidget:React.FC<{form: OrganizationProps, setForm: React.Dispatch<React.SetStateAction<Partial<OrganizationProps>>>}> = ({form, setForm}) => {


  const clearFile = () => {
    setForm(prev => ({ ...prev, cacDocUrl: '', cacFileName: '' }));
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center flex-col  gap-4">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          CAC Registration Document
          <span className="text-xs font-normal text-gray-400">(Required)</span>
        </label>

        <div className={`relative flex items-center gap-4 p-4 rounded-lg border-2 border-dashed transition-all ${
          form.cacDocUrl ? 'border-green-100 bg-green-50' : 'border-gray-200 bg-gray-50'
        }`}>
          
          {/* Document Preview Icon Area */}
          <div className={`flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center ${
            form.cacDocUrl ? 'bg-white text-green-600 shadow-sm' : 'bg-gray-100 text-gray-400'
          }`}>
            {form.cacDocUrl ? (
              <FileText size={32} />
            ) : (
              <Upload size={28} />
            )}
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            {form.cacDocUrl ? (
              <>
                <div className="flex gap-3 mt-2">
                  <a 
                    href={form.cacDocUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View Document <ExternalLink size={12} />
                  </a>
                  <button 
                    onClick={clearFile}
                    className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-600 font-medium">
                  Upload CAC Certificate
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  JPG or PNG. Max 2MB.
                </p>
              </>
            )}
          </div>

        </div>

        {/* Action Button (Internal Trigger Version) */}
        {!form.cacDocUrl && (
          <span
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Upload size={16} />
            <CloudinaryUpload
                folder="avatars"
                sources={["google_drive", "local", "camera"]}
                buttonText="Select Document"
                onUploadSuccess={(url) => {
                    setForm(prev => ({
                    ...prev,
                    cacDocUrl: url,
                    }));
                }}
                />
            
          </span>
        )}

        {/* Helpful Tip */}
        <div className="flex gap-2 p-3 bg-blue-50 rounded-md border border-blue-100">
          <AlertCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-blue-700 leading-relaxed">
            Ensure the registration number and organization name are clearly visible on the document.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CACUploadWidget;