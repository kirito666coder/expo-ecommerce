import { OrderStatus } from '@/types';

export const capitalizeText = (text: string) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getOrderStatusBadge = (status?: OrderStatus | string): string => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'badge-success';
    case 'shipped':
      return 'badge-info';
    case 'pending':
      return 'badge-warning';
    default:
      return 'badge-ghost';
  }
};

type StockBadge = {
  text: string;
  class: string;
};

export const getStockStatusBadge = (stock: number): StockBadge => {
  if (stock === 0) return { text: 'Out of Stock', class: 'badge-error' };
  if (stock < 20) return { text: 'Low Stock', class: 'badge-warning' };
  return { text: 'In Stock', class: 'badge-success' };
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
