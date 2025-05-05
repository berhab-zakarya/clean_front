import { SetupSection } from '../types';

export const setupSections: SetupSection[] = [
  {
    id: 'name',
    title: 'Choose your store name',
    description: 'Your store is currently named "My Store". The store name appears in your admin and your online store.',
    isCompleted: false
  },
  {
    id: 'domain',
    title: 'Add custom domain',
    isCompleted: false
  },
  {
    id: 'product',
    title: 'Add your first product',
    description: 'Write descriptions, add photos, and set pricing for the products you plan to sell.',
    isCompleted: false
  },
  {
    id: 'shipping',
    title: 'Optimize shipping rates',
    isCompleted: false
  },
  {
    id: 'payment',
    title: 'Configure payment provider',
    isCompleted: false
  },
  {
    id: 'testOrder',
    title: 'Place a test order',
    isCompleted: false
  }
];