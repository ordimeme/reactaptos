import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface NetworkSelectorProps {
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
}

export function NetworkSelector({ selectedNetwork, onNetworkChange }: NetworkSelectorProps) {
  const networks = [
    { value: "Move", label: "Move" },
    { value: "Solana", label: "Solana" },
    { value: "Ethereum", label: "Ethereum" }
  ];

  return (
    <Select 
      value={selectedNetwork}
      onValueChange={onNetworkChange}
    >
      <SelectTrigger className="w-[80px] md:w-[160px] h-8 md:h-10 text-sm md:text-base">
        <SelectValue>{selectedNetwork}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {networks.map((network) => (
            <SelectItem key={network.value} value={network.value}>
              {network.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
} 