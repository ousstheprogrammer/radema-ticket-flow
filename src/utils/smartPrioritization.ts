// Smart ticket prioritization based on keywords and customer tiers
export interface CustomerTier {
  name: string;
  level: 'enterprise' | 'business' | 'standard';
  multiplier: number;
}

export const customerTiers: CustomerTier[] = [
  { name: 'Enterprise', level: 'enterprise', multiplier: 3 },
  { name: 'Business', level: 'business', multiplier: 2 },
  { name: 'Standard', level: 'standard', multiplier: 1 },
];

// High priority keywords
const highPriorityKeywords = [
  'urgence', 'urgent', 'critique', 'bloquer', 'bloqué', 'arrêt', 'panne',
  'sécurité', 'piratage', 'hack', 'data', 'données', 'corruption',
  'production', 'client', 'vip', 'important', 'asap', 'immédiat'
];

// Medium priority keywords  
const mediumPriorityKeywords = [
  'problème', 'bug', 'erreur', 'dysfonctionnement', 'amélioration',
  'optimisation', 'performance', 'lent', 'lenteur', 'timeout'
];

// Low priority keywords
const lowPriorityKeywords = [
  'question', 'demande', 'information', 'conseil', 'formation',
  'documentation', 'guide', 'tuto', 'tutoriel', 'comment'
];

export function calculateSmartPriority(
  description: string,
  comment: string = '',
  customerTier: 'enterprise' | 'business' | 'standard' = 'standard'
): 'high' | 'medium' | 'low' {
  const text = `${description} ${comment}`.toLowerCase();
  
  // Base priority scores
  let score = 0;
  
  // Check for high priority keywords
  highPriorityKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 3;
    }
  });
  
  // Check for medium priority keywords
  mediumPriorityKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 2;
    }
  });
  
  // Check for low priority keywords
  lowPriorityKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 1;
    }
  });
  
  // Apply customer tier multiplier
  const tier = customerTiers.find(t => t.level === customerTier);
  if (tier) {
    score *= tier.multiplier;
  }
  
  // Determine final priority
  if (score >= 8) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}

export function getPriorityRecommendation(
  description: string,
  comment: string = '',
  customerTier: 'enterprise' | 'business' | 'standard' = 'standard'
): {
  priority: 'high' | 'medium' | 'low';
  reason: string;
  score: number;
} {
  const text = `${description} ${comment}`.toLowerCase();
  let score = 0;
  const reasons: string[] = [];
  
  // Analyze keywords
  const foundHighKeywords = highPriorityKeywords.filter(keyword => text.includes(keyword));
  const foundMediumKeywords = mediumPriorityKeywords.filter(keyword => text.includes(keyword));
  const foundLowKeywords = lowPriorityKeywords.filter(keyword => text.includes(keyword));
  
  if (foundHighKeywords.length > 0) {
    score += foundHighKeywords.length * 3;
    reasons.push(`Mots-clés critiques détectés: ${foundHighKeywords.join(', ')}`);
  }
  
  if (foundMediumKeywords.length > 0) {
    score += foundMediumKeywords.length * 2;
    reasons.push(`Mots-clés moyens détectés: ${foundMediumKeywords.join(', ')}`);
  }
  
  if (foundLowKeywords.length > 0) {
    score += foundLowKeywords.length * 1;
    reasons.push(`Mots-clés standards détectés: ${foundLowKeywords.join(', ')}`);
  }
  
  // Apply customer tier
  const tier = customerTiers.find(t => t.level === customerTier);
  if (tier) {
    const originalScore = score;
    score *= tier.multiplier;
    if (tier.multiplier > 1) {
      reasons.push(`Client ${tier.name} (score x${tier.multiplier})`);
    }
  }
  
  // Determine priority
  let priority: 'high' | 'medium' | 'low' = 'low';
  if (score >= 8) priority = 'high';
  else if (score >= 4) priority = 'medium';
  
  const reason = reasons.length > 0 ? reasons.join(' • ') : 'Analyse basée sur le contenu standard';
  
  return { priority, reason, score };
}