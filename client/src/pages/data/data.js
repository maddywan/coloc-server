import { Beer, Ellipsis, GlassWater, Martini, Wine } from "lucide-react";

export const drinks = [
  { title: 'Cocktails', type: 'COCKTAIL', icon: <Martini size={24} /> },
  { title: 'Shooters', type: 'SHOOTER', icon: <GlassWater size={24} /> },
  { title: 'Bières', type: 'BEER', icon: <Beer size={24} /> },
  { title: 'Vins', type: 'WINE', icon: <Wine size={24} /> },
  { title: 'Champagnes', type: 'CHAMPAGNE', icon: <Wine size={24} />  },
  { title: 'Produits personnalisés', type: 'CUSTOM', icon: <Ellipsis size={24} />  },
];

export const stock_types = [
  { title: 'Alcools', type: 'ALCOOL'},
  { title: 'Liqueurs', type: 'LIQUEUR'},
  { title: 'Softs', type: 'SOFT'},
  { title: 'Jus de fruits', type: 'JUICE'},
  { title: 'Fruits et aromatiques', type: 'SOLID'},
  { title: 'Bières', type: 'BEER'},
  { title: 'Vins', type: 'WINE'},
  { title: 'Champagnes', type: 'CHAMPAGNE'}
];

export const labels = [
  { title: 'Maddy', active: false },
  { title: 'Mathis', active: false },
  { title: 'Ménage', active: true },
  { title: 'Rangement', active: true },
  { title: 'Organisation', active: true },
  { title: 'Bricolage', active: true }
];