
export interface User {
  id: number;
  name: string;
  role: string;
  department: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  email: string;
}

export const users: User[] = [
  {
    id: 1,
    name: "Safya Goumri",
    role: "Cheffe Département Développement Clientèle",
    department: "Développement Commercial",
    avatar: "SG",
    status: "online",
    email: "s.goumri@srm.ma"
  },
  {
    id: 2,
    name: "Mohammed Aiatallah",
    role: "Chef Division Administration système et reporting",
    department: "Administration et Reporting",
    avatar: "MA",
    status: "online",
    email: "m.aiatallah@srm.ma"
  },
  {
    id: 3,
    name: "Safaa Errihani",
    role: "Cheffe Division de Développement et Digitalisation",
    department: "Développement et Digitalisation",
    avatar: "SE",
    status: "busy",
    email: "s.errihani@srm.ma"
  },
  {
    id: 4,
    name: "Hamza Dah",
    role: "Chef Service Digitalisation du processus Commercial",
    department: "Digitalisation",
    avatar: "HD",
    status: "online",
    email: "h.dah@srm.ma"
  },
  {
    id: 5,
    name: "Mohamed Ait Mou",
    role: "Chef Service Administration système et assistance aux utilisateurs",
    department: "Administration Système",
    avatar: "MM",
    status: "offline",
    email: "m.aitmou@srm.ma"
  },
  {
    id: 6,
    name: "Adil Hazeb",
    role: "Chef Service Reporting",
    department: "Reporting",
    avatar: "AH",
    status: "online",
    email: "a.hazeb@srm.ma"
  },
  {
    id: 7,
    name: "Laila Ouanim",
    role: "Cheffe Division CRC et gestion des réclamations",
    department: "CRC et Réclamations",
    avatar: "LO",
    status: "busy",
    email: "l.ouanim@srm.ma"
  },
  {
    id: 8,
    name: "Imane Lahdiah",
    role: "Agent",
    department: "Développement Commercial",
    avatar: "IL",
    status: "online",
    email: "i.lahdiah@srm.ma"
  },
  {
    id: 9,
    name: "Salwa Bouderba",
    role: "Chef Service Animation des agences",
    department: "Animation des Agences",
    avatar: "SB",
    status: "online",
    email: "s.bouderba@srm.ma"
  },
  {
    id: 10,
    name: "Mohamed Dakir",
    role: "Agent de Maîtrise",
    department: "Développement Commercial",
    avatar: "MD",
    status: "offline",
    email: "m.dakir@srm.ma"
  },
  {
    id: 11,
    name: "Fatima Ezzahra Chakhais",
    role: "Agent de Maîtrise",
    department: "Développement Commercial",
    avatar: "FC",
    status: "online",
    email: "f.chakhais@srm.ma"
  },
  {
    id: 12,
    name: "Zakaria Naouassih",
    role: "Agent d'Exécution",
    department: "Développement Commercial",
    avatar: "ZN",
    status: "busy",
    email: "z.naouassih@srm.ma"
  }
];
