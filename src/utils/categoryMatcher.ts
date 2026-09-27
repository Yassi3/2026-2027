import { Product } from '../types';

/**
 * Intelligent Category Matcher for BHSS Shop
 * Guarantees that any product created by the store owner will accurately
 * appear in its corresponding category pill even if category naming varies.
 */
export const matchesCategory = (product: Product, categoryId: string): boolean => {
  if (!categoryId || categoryId === 'all') return true;

  const target = categoryId.toLowerCase().trim();
  const prodCat = (product.category || '').toLowerCase().trim();
  const prodTitle = (product.title || '').toLowerCase().trim();
  const prodSub = (product.subcategory || '').toLowerCase().trim();
  const prodTags = (product.tags || []).join(' ').toLowerCase();

  const combined = `${prodCat} ${prodTitle} ${prodSub} ${prodTags}`;

  // 1. Direct match
  if (prodCat === target) return true;

  // 2. Specialized category groupings
  switch (target) {
    case 'streaming':
    case 'entertainment':
      return (
        prodCat === 'streaming' ||
        prodCat === 'entertainment' ||
        prodCat === 'music' ||
        prodCat.includes('music') ||
        prodCat.includes('stream') ||
        prodCat.includes('apple') ||
        prodCat.includes('spotify') ||
        prodCat.includes('netflix') ||
        prodCat.includes('youtube') ||
        prodCat.includes('crunchyroll') ||
        prodCat.includes('iptv') ||
        /apple\s*music|spotify|netflix|youtube|crunchyroll|disney|shahid|iptv|nitro|deezer|anghami|prime\s*video|hbo|tidal|stream|musique|music/.test(combined)
      );

    case 'software':
    case 'operating-systems':
    case 'office-productivity':
    case 'design-creative':
      return (
        prodCat === 'software' ||
        prodCat === 'operating-systems' ||
        prodCat === 'office-productivity' ||
        prodCat === 'design-creative' ||
        prodCat.includes('soft') ||
        prodCat.includes('adobe') ||
        prodCat.includes('office') ||
        prodCat.includes('windows') ||
        prodCat.includes('canva') ||
        /adobe|express|photoshop|illustrator|canva|windows|win10|win11|win\s*11|office|word|excel|powerpoint|licen[sc]e|suite|logiciel|autodesk|corel|antivirus/.test(combined)
      );

    case 'gaming':
    case 'gaming-keys':
      return (
        prodCat === 'gaming' ||
        prodCat === 'gaming-keys' ||
        prodCat.includes('game') ||
        /steam|xbox|playstation|psn|ea\s*app|fifa|fc\s*25|fc25|gta|rockstar|cod|black\s*ops|elden\s*ring|roblox|robux|ubisoft|epic|battle\.net|jeux|gaming/.test(combined)
      );

    case 'giftcards':
      return (
        prodCat === 'giftcards' ||
        prodCat.includes('gift') ||
        prodCat.includes('card') ||
        /gift\s*card|carte\s*cadeau|wallet|recharge|solde|dh|robux|psn\s*card|steam\s*card/.test(combined)
      );

    case 'vpn':
    case 'vpn-privacy':
    case 'vpn-security':
    case 'antivirus-security':
      return (
        prodCat === 'vpn' ||
        prodCat.includes('vpn') ||
        prodCat.includes('secur') ||
        /nordvpn|expressvpn|cyberghost|surfshark|kaspersky|mcafee|bitdefender|antivirus|sécurité|privacy/.test(combined)
      );

    case 'ai-dev':
    case 'ai-subscriptions':
    case 'developer-tools':
      return (
        prodCat === 'ai-dev' ||
        prodCat.includes('ai') ||
        prodCat.includes('dev') ||
        /chatgpt|gpt|copilot|github|midjourney|openai|gemini|claude|cursor|jetbrains|developer|intelligence/.test(combined)
      );

    default:
      return prodCat.includes(target) || combined.includes(target);
  }
};
