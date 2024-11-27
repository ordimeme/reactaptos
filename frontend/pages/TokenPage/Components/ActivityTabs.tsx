import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketItem } from "@/data/marketData";
import { TradesView } from "./TradesView";
import { Comments } from "./Comments";

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
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "comments" | "trades")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="comments">Comments</TabsTrigger>
        <TabsTrigger value="trades">Trades</TabsTrigger>
      </TabsList>

      <TabsContent value="comments">
        <Comments 
          token={token}
          commentContent={commentContent}
          setCommentContent={setCommentContent}
          handleSubmitComment={handleSubmitComment}
        />
      </TabsContent>

      <TabsContent value="trades">
        <TradesView token={token} />
      </TabsContent>
    </Tabs>
  );
} 