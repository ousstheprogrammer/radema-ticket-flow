
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
    name: "Ahmed Bennani",
    role: "Chef de Département",
    department: "Développement Commercial",
    avatar: "AB",
    status: "online",
    email: "a.bennani@radema.ma"
  },
  {
    id: 2,
    name: "Fatima El Alaoui",
    role: "Chef de Service",
    department: "Développement Commercial",
    avatar: "FE",
    status: "online",
    email: "f.elalaoui@radema.ma"
  },
  {
    id: 3,
    name: "Mohamed Chakib",
    role: "Responsable Clientèle",
    department: "Développement Commercial",
    avatar: "MC",
    status: "busy",
    email: "m.chakib@radema.ma"
  },
  {
    id: 4,
    name: "Aicha Benali",
    role: "Agent Commercial",
    department: "Développement Commercial",
    avatar: "AB",
    status: "online",
    email: "a.benali@radema.ma"
  },
  {
    id: 5,
    name: "Youssef Mansouri",
    role: "Chargé de Développement",
    department: "Développement Commercial",
    avatar: "YM",
    status: "offline",
    email: "y.mansouri@radema.ma"
  },
  {
    id: 6,
    name: "Khadija Rami",
    role: "Agent Commercial",
    department: "Développement Commercial",
    avatar: "KR",
    status: "online",
    email: "k.rami@radema.ma"
  },
  {
    id: 7,
    name: "Omar Zahiri",
    role: "Conseiller Commercial",
    department: "Développement Commercial",
    avatar: "OZ",
    status: "busy",
    email: "o.zahiri@radema.ma"
  },
  {
    id: 8,
    name: "Nadia Berrada",
    role: "Agent Commercial",
    department: "Développement Commercial",
    avatar: "NB",
    status: "online",
    email: "n.berrada@radema.ma"
  },
  {
    id: 9,
    name: "Rachid Amrani",
    role: "Superviseur Commercial",
    department: "Développement Commercial",
    avatar: "RA",
    status: "online",
    email: "r.amrani@radema.ma"
  },
  {
    id: 10,
    name: "Salma Ouali",
    role: "Agent Commercial",
    department: "Développement Commercial",
    avatar: "SO",
    status: "offline",
    email: "s.ouali@radema.ma"
  },
  {
    id: 11,
    name: "Hassan Tazi",
    role: "Chargé de Clientèle",
    department: "Développement Commercial",
    avatar: "HT",
    status: "online",
    email: "h.tazi@radema.ma"
  },
  {
    id: 12,
    name: "Zineb Fassi",
    role: "Agent Commercial",
    department: "Développement Commercial",
    avatar: "ZF",
    status: "busy",
    email: "z.fassi@radema.ma"
  }
];
