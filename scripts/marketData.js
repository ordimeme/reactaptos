import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 完整的代币列表，确保与 frontend/data/marketData.ts 中的列表完全一致
const tokenList = [
  { name: "Woodstock", symbol: "WOODSTOCK", imageUrl: "/tokens/woodstock.svg" },
  { name: "Doge Plus", symbol: "DOGE+", imageUrl: "/tokens/doge.svg" },
  { name: "Crypto Cat", symbol: "CCAT", imageUrl: "/tokens/ccat.svg" },
  { name: "Bolt Finance", symbol: "BOLT", imageUrl: "/tokens/bolt.svg" },
  { name: "Dawn Protocol", symbol: "DAWN", imageUrl: "/tokens/dawn.svg" },
  { name: "Flow Token", symbol: "FLOW", imageUrl: "/tokens/flow.svg" },
  { name: "Fire Token", symbol: "FIRE", imageUrl: "/tokens/fire.svg" },
  { name: "Star Light", symbol: "STAR", imageUrl: "/tokens/star.svg" },
  { name: "Pepe Classic", symbol: "PEPE", imageUrl: "/tokens/pepe.svg" },
  { name: "Moon Shot", symbol: "MOON", imageUrl: "/tokens/moon.svg" },
  { name: "Meta World", symbol: "META", imageUrl: "/tokens/meta.svg" },
  { name: "Pixel Art", symbol: "PIXEL", imageUrl: "/tokens/pixel.svg" },
  { name: "Cyber Punk", symbol: "PUNK", imageUrl: "/tokens/punk.svg" },
  { name: "Galaxy Quest", symbol: "GLXY", imageUrl: "/tokens/glxy.svg" },
  { name: "Diamond Hands", symbol: "DIAM", imageUrl: "/tokens/diam.svg" },
  { name: "Quantum Leap", symbol: "QNTM", imageUrl: "/tokens/qntm.svg" },
  { name: "Solar Power", symbol: "SOLR", imageUrl: "/tokens/solr.svg" },
  { name: "Neural Net", symbol: "NNET", imageUrl: "/tokens/nnet.svg" },
  { name: "Rocket Fuel", symbol: "FUEL", imageUrl: "/tokens/fuel.svg" },
  { name: "Cosmic Ray", symbol: "CRAY", imageUrl: "/tokens/cray.svg" },
  { name: "Black Hole", symbol: "HOLE", imageUrl: "/tokens/hole.svg" },
  { name: "Time Lock", symbol: "TIME", imageUrl: "/tokens/time.svg" },
  { name: "Infinity Edge", symbol: "EDGE", imageUrl: "/tokens/edge.svg" },
  { name: "Genesis One", symbol: "GEN1", imageUrl: "/tokens/gen1.svg" },
  { name: "Astro Dog", symbol: "ADOG", imageUrl: "/tokens/adog.svg" },
  { name: "Cyber Dragon", symbol: "CDRG", imageUrl: "/tokens/cdrg.svg" },
  { name: "Magic Portal", symbol: "PRTL", imageUrl: "/tokens/prtl.svg" },
  { name: "Phoenix Rise", symbol: "PHNX", imageUrl: "/tokens/phnx.svg" },
  { name: "Crystal Core", symbol: "CRYS", imageUrl: "/tokens/crys.svg" },
  { name: "Ocean Wave", symbol: "WAVE", imageUrl: "/tokens/wave.svg" },
  { name: "Desert Gold", symbol: "DGLD", imageUrl: "/tokens/dgld.svg" },
  { name: "Arctic Fox", symbol: "AFOX", imageUrl: "/tokens/afox.svg" },
  { name: "Jungle Beat", symbol: "JBEAT", imageUrl: "/tokens/jbeat.svg" },
  { name: "Storm Cloud", symbol: "STRM", imageUrl: "/tokens/strm.svg" }
];

export default { tokenList }; 