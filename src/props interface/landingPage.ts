export interface NavLinkProps {
  label: string;
  href: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'outline'| 'green';
  onClick?: () => void;
  className?: string;
}

export interface FeatureCardProps {
  title: string;
  description: string | Array<string>;
  icon?: React.ReactNode;
  color: 'red' | 'green' | 'yellow' | 'blue' | 'lock';
  cta?:string
}

export interface Cards {
    icon?: string,
    header: string,
    content: string | string[]
}

export interface LabeledIcon {
    icon: string,
    label: string,
    altText: string
}