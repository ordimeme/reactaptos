export interface MarketItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  imageUrl: string;
  creator: string;
  description: string;
  timestamp: string;
}

export const marketData: MarketItem[] = [
  {
    id: "1",
    name: "King of the Hill",
    symbol: "KOTH",
    price: 500.00,
    imageUrl: "/tokens/KOTH.svg",
    creator: "0x1234...5678",
    description: "The first memecoin on our platform",
    timestamp: "2024-03-20T10:00:00Z"
  },
  {
    id: "2",
    name: "Pepe Classic",
    symbol: "PEPE",
    price: 420.69,
    imageUrl: "/tokens/PEPE.svg",
    creator: "0xabcd...efgh",
    description: "The original meme token that started it all",
    timestamp: "2024-03-19T15:30:00Z"
  },
  {
    id: "3",
    name: "Moon Shot",
    symbol: "MOON",
    price: 1337.00,
    imageUrl: "/tokens/MOON.svg",
    creator: "0x9876...5432",
    description: "To the moon and beyond! 🚀",
    timestamp: "2024-03-18T12:00:00Z"
  },
  {
    id: "4",
    name: "Doge Plus",
    symbol: "DOGE+",
    price: 88.88,
    imageUrl: "/tokens/DOGE+.svg",
    creator: "0x2468...1357",
    description: "Much wow, very token",
    timestamp: "2024-03-17T09:15:00Z"
  },
  {
    id: "5",
    name: "Pixel Pals",
    symbol: "PIXEL",
    price: 256.00,
    imageUrl: "/tokens/PIXEL.svg",
    creator: "0x1111...2222",
    description: "8-bit nostalgia in token form",
    timestamp: "2024-03-16T14:20:00Z"
  },
  {
    id: "6",
    name: "Cosmic Cat",
    symbol: "CCAT",
    price: 777.77,
    imageUrl: "/tokens/CCAT.svg",
    creator: "0x3333...4444",
    description: "Feline friends in the metaverse",
    timestamp: "2024-03-15T16:45:00Z"
  },
  {
    id: "7",
    name: "Robot Dreams",
    symbol: "ROBOT",
    price: 101.01,
    imageUrl: "/tokens/ROBOT.svg",
    creator: "0x5555...6666",
    description: "AI-powered meme generation",
    timestamp: "2024-03-14T11:11:00Z"
  },
  {
    id: "8",
    name: "Space Race",
    symbol: "SPACE",
    price: 999.99,
    imageUrl: "/tokens/SPACE.svg",
    creator: "0x7777...8888",
    description: "Intergalactic meme trading",
    timestamp: "2024-03-13T13:30:00Z"
  },
  {
    id: "9",
    name: "Ninja Notes",
    symbol: "NINJA",
    price: 333.33,
    imageUrl: "/tokens/NINJA.svg",
    creator: "0x9999...0000",
    description: "Silent but deadly returns",
    timestamp: "2024-03-12T17:00:00Z"
  },
  {
    id: "10",
    name: "Viking Gold",
    symbol: "VKING",
    price: 888.88,
    imageUrl: "/tokens/VKING.svg",
    creator: "0xaaaa...bbbb",
    description: "Raid the crypto markets",
    timestamp: "2024-03-11T10:00:00Z"
  },
  {
    id: "11",
    name: "Wizard Power",
    symbol: "WIZA",
    price: 444.44,
    imageUrl: "/tokens/WIZA.svg",
    creator: "0xcccc...dddd",
    description: "Magical memes and mystical gains",
    timestamp: "2024-03-10T15:15:00Z"
  },
  {
    id: "12",
    name: "Desert Gold",
    symbol: "GOLD",
    price: 1234.56,
    imageUrl: "/tokens/GOLD.svg",
    creator: "0xeeee...ffff",
    description: "Hidden treasures in the blockchain",
    timestamp: "2024-03-09T12:30:00Z"
  },
  {
    id: "13",
    name: "Cyber Punk",
    symbol: "PUNK",
    price: 555.55,
    imageUrl: "/tokens/PUNK.svg",
    creator: "0x1a1a...2b2b",
    description: "Future-proof your portfolio",
    timestamp: "2024-03-08T14:45:00Z"
  },
  {
    id: "14",
    name: "Forest Token",
    symbol: "FRST",
    price: 222.22,
    imageUrl: "/tokens/FRST.svg",
    creator: "0x3c3c...4d4d",
    description: "Green crypto initiative",
    timestamp: "2024-03-07T16:20:00Z"
  },
  {
    id: "15",
    name: "Ocean Wave",
    symbol: "WAVE",
    price: 666.66,
    imageUrl: "/tokens/WAVE.svg",
    creator: "0x5e5e...6f6f",
    description: "Ride the crypto wave",
    timestamp: "2024-03-06T09:30:00Z"
  },
  {
    id: "16",
    name: "Dragon Fire",
    symbol: "FIRE",
    price: 888.88,
    imageUrl: "/tokens/FIRE.svg",
    creator: "0x7g7g...8h8h",
    description: "Burn through the competition",
    timestamp: "2024-03-05T11:11:00Z"
  },
  {
    id: "17",
    name: "Star Light",
    symbol: "STAR",
    price: 777.77,
    imageUrl: "/tokens/STAR.svg",
    creator: "0x9i9i...0j0j",
    description: "Shine bright like a diamond",
    timestamp: "2024-03-04T13:45:00Z"
  },
  {
    id: "18",
    name: "Thunder Bolt",
    symbol: "BOLT",
    price: 444.44,
    imageUrl: "/tokens/BOLT.svg",
    creator: "0xklkl...mnmn",
    description: "Fast transactions, lightning returns",
    timestamp: "2024-03-03T15:30:00Z"
  },
  {
    id: "19",
    name: "Ice Crystal",
    symbol: "ICE",
    price: 333.33,
    imageUrl: "/tokens/ICE.svg",
    creator: "0xopop...qrqr",
    description: "Cool heads prevail in crypto",
    timestamp: "2024-03-02T17:15:00Z"
  },
  {
    id: "20",
    name: "Wind Runner",
    symbol: "WIND",
    price: 555.55,
    imageUrl: "/tokens/WIND.svg",
    creator: "0xstst...uvuv",
    description: "Swift as the wind, steady as a rock",
    timestamp: "2024-03-01T10:00:00Z"
  },
  {
    id: "21",
    name: "Crystal Core",
    symbol: "CRYST",
    price: 445.55,
    imageUrl: "/tokens/CRYST.svg",
    creator: "0xaaa1...bbb1",
    description: "Pure crystalline power in token form",
    timestamp: "2024-02-28T10:00:00Z"
  },
  {
    id: "22",
    name: "Solar Power",
    symbol: "SOLAR",
    price: 667.77,
    imageUrl: "/tokens/SOLAR.svg",
    creator: "0xaaa2...bbb2",
    description: "Harness the power of the sun",
    timestamp: "2024-02-27T10:00:00Z"
  },
  {
    id: "23",
    name: "Lunar Light",
    symbol: "LUNAR",
    price: 889.99,
    imageUrl: "/tokens/LUNAR.svg",
    creator: "0xaaa3...bbb3",
    description: "Moonlight magic in token form",
    timestamp: "2024-02-26T10:00:00Z"
  },
  {
    id: "24",
    name: "Tech Titan",
    symbol: "TITAN",
    price: 1234.56,
    imageUrl: "/tokens/TITAN.svg",
    creator: "0xaaa4...bbb4",
    description: "Leading the tech revolution",
    timestamp: "2024-02-25T10:00:00Z"
  },
  {
    id: "25",
    name: "Meta Mind",
    symbol: "META",
    price: 876.54,
    imageUrl: "/tokens/META.svg",
    creator: "0xaaa5...bbb5",
    description: "The future of digital interaction",
    timestamp: "2024-02-24T10:00:00Z"
  },
  {
    id: "26",
    name: "Quantum Quark",
    symbol: "QUARK",
    price: 432.10,
    imageUrl: "/tokens/QUARK.svg",
    creator: "0xaaa6...bbb6",
    description: "Quantum computing meets crypto",
    timestamp: "2024-02-23T10:00:00Z"
  },
  {
    id: "27",
    name: "Neo Network",
    symbol: "NEO",
    price: 789.12,
    imageUrl: "/tokens/NEO.svg",
    creator: "0xaaa7...bbb7",
    description: "The new age of networking",
    timestamp: "2024-02-22T10:00:00Z"
  },
  {
    id: "28",
    name: "Digital Dawn",
    symbol: "DAWN",
    price: 345.67,
    imageUrl: "/tokens/DAWN.svg",
    creator: "0xaaa8...bbb8",
    description: "A new era of digital assets",
    timestamp: "2024-02-21T10:00:00Z"
  },
  {
    id: "29",
    name: "Cyber Shield",
    symbol: "SHIELD",
    price: 901.23,
    imageUrl: "/tokens/SHIELD.svg",
    creator: "0xaaa9...bbb9",
    description: "Security in the digital age",
    timestamp: "2024-02-20T10:00:00Z"
  },
  {
    id: "30",
    name: "Future Flow",
    symbol: "FLOW",
    price: 567.89,
    imageUrl: "/tokens/FLOW.svg",
    creator: "0xaaa0...bbb0",
    description: "The flow of the future",
    timestamp: "2024-02-19T10:00:00Z"
  }
]; 