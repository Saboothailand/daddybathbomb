import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface ProductBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function ProductBreadcrumb({ items }: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm py-4">
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
        className="flex items-center text-[#64748B] hover:text-[#007AFF] transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        <span>Home</span>
      </button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 text-[#475569] mx-2" />
          {item.active ? (
            <span className="text-[#007AFF] font-medium">{item.label}</span>
          ) : (
            <button
              className="text-[#64748B] hover:text-[#007AFF] transition-colors"
              onClick={() => item.href && console.log('Navigate to:', item.href)}
            >
              {item.label}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}