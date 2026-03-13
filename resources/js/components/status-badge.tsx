import { Badge } from '@/components/ui/badge';

export type SignalementStatus = 'enregistre' | 'en_cours' | 'resolu' | 'rejete';

interface StatusBadgeProps {
  status: SignalementStatus;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const statusConfig = {
    enregistre: { label: 'Reçu',        color: 'bg-gray-500' },
    en_cours:   { label: 'En cours',    color: 'bg-[#E67E22]' },
    resolu:     { label: 'Résolu ✓',   color: 'bg-[#27AE60]' },
    rejete:     { label: 'Rejeté',      color: 'bg-red-600' },
  };

  const config = statusConfig[status];

  return (
    <Badge className={`${config.color} text-white hover:${config.color} ${className}`}>
      {config.label}
    </Badge>
  );
}
