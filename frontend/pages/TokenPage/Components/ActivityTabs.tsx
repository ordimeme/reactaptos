import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketItem } from "@/types/market";
import { TradesView } from "./TradesView";
import { Comments } from "./Comments";
import { MessageCircle, BarChart2 } from "lucide-react";
import { usePriceContext } from "@/context/PriceContext";

interface ActivityTabsProps {
  token: MarketItem;
  activeTab: "comments" | "trades";
  setActiveTab: (tab: "comments" | "trades") => void;
  commentContent: string;
  setCommentContent: (content: string) => void;
  handleSubmitComment: () => void;
}

export function ActivityTabs({
  token,
  activeTab,
  setActiveTab,
  commentContent,
  setCommentContent,
  handleSubmitComment,
}: ActivityTabsProps) {
  const { tokenTrades } = usePriceContext();
  const trades = tokenTrades[token.id] || [];

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "comments" | "trades")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="comments" className="flex items-center gap-1.5">
          Comments
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>{token.comments?.length || 0}</span>
          </div>
        </TabsTrigger>
        <TabsTrigger value="trades" className="flex items-center gap-1.5">
          Trades
          <div className="flex items-center gap-1">
            <BarChart2 className="h-3.5 w-3.5" />
            <span>{trades.length}</span>
          </div>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="comments" className="outline-none">
        <Comments 
          token={token}
          commentContent={commentContent}
          setCommentContent={setCommentContent}
          handleSubmitComment={handleSubmitComment}
        />
      </TabsContent>

      <TabsContent value="trades" className="outline-none">
        <TradesView token={token} />
      </TabsContent>
    </Tabs>
  );
} 