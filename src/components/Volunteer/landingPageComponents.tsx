import type { ButtonProps, FeatureCardProps, NavLinkProps  } from "../../interface/interfaces";


// --- Reusable Components ---
export const Button: React.FC<ButtonProps> = ({ children, variant, className = '', onClick }) => {


  // Adjusted base classes for a cleaner look matching the image
  const baseClasses = 'px-6 py-3 font-semibold rounded-lg transition duration-200 whitespace-nowrap';

  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-[#1877F2] text-white hover:bg-[#156cd4] shadow-md  ';
      break;
    case 'secondary':
      // The "Post a project" button in the image is secondary: white background, light border, text-gray
      variantClasses = 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-300 shadow-md';
      break;
    case 'outline':
      // Used for the Sign Up button in the header
      variantClasses = 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50';
      break;
    case 'green':
      variantClasses = 'bg-[#34A853] text-white hover:bg-green-700'
      break;
    default:
      variantClasses = 'bg-[#34A853] text-white hover:bg-[#156cd4] shadow-md';
  }

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} onClick={onClick}>
      {children}
    </button>

  
  );
};


export const NavLink: React.FC<NavLinkProps> = ({ label, href }) => (
  <a href={href} className="text-gray-600 hover:text-[#1877F2] transition duration-150 py-2 text-sm font-medium">
    {label}
  </a>
);


export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, color }) => {
  let iconBgClass = '';
  let iconTextClass = '';

  switch (color) {
    case 'red':
      iconBgClass = 'bg-red-50';
      iconTextClass = 'text-red-500';
      break;
    case 'green':
      iconBgClass = 'bg-green-50';
      iconTextClass = 'text-green-500';
      break;
    case 'yellow':
      iconBgClass = 'bg-yellow-50';
      iconTextClass = 'text-yellow-600';
      break;
    case 'blue':
      iconBgClass = 'bg-blue-50';
      iconTextClass = 'text-[#1877F2]';
      break;
    case 'lock':
      iconBgClass = 'bg-red-50';
      iconTextClass = 'text-red-500';
      break;
    default:
      iconBgClass = 'bg-gray-50';
      iconTextClass = 'text-gray-500';
      break;
  }

  const cardBaseClasses = 'p-6 rounded-xl transition duration-300 h-full';


  return (
    <div className={cardBaseClasses}>
      <div className={`p-3 rounded-full inline-block mb-4 ${iconBgClass} ${iconTextClass}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
    </div>
  );
};


export const PlatformCategory: React.FC<FeatureCardProps> = ({ color, description, title, cta }) => {

  let listBgColor = "bg-[#1A73E8]";
  if (color == 'green') {
    listBgColor = 'bg-[#34A853]'
  }

  if (typeof description == 'object') {
    return (
      <div className='max-w-md mx-auto bg-white rounded-xl border border-blue-100 p-8 shadow-sm'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>{title}</h2>

        <ol className='space-y-4'>
          {description.map((text, index) => <li key={index} className='flex gap-2 text-left'>
            <span className={`flex items-center justify-center w-6 h-6 rounded-full ${listBgColor} text-white text-sm font-medium`}>{index + 1}</span>
            <span className='text-gray-700 w-full'>{text}</span>
          </li>)}
        </ol>

        <Button variant={color == 'blue' ? 'primary' : 'green'} className='w-full mt-8 py-3'>{cta}</Button>
      </div>
    )
  }

}

export const Card: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="p-8 max-w-lg w-5/6 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl m-4">
    {children}
  </div>
);