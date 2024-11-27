import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MarketItem } from "@/data/marketData"
import { truncateAddress, getFullAddress } from "@/utils/truncateAddress"
import { Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useState, useRef } from "react"
import { Pagination } from "@/components/Pagination"
import { TradesView } from "./TradesView"

const ITEMS_PER_PAGE = 20

interface ActivityTabsProps {
  token: MarketItem;
  activeTab: "comments" | "trades";
  setActiveTab: (tab: "comments" | "trades") => void;
  commentContent: string;
  setCommentContent: (content: string) => void;
  handleSubmitComment: () => void;
  formatTime: (timestamp: string) => string;
}

export function ActivityTabs({
  token,
  activeTab,
  setActiveTab,
  commentContent,
  setCommentContent,
  handleSubmitComment,
  formatTime
}: ActivityTabsProps) {
  const { toast } = useToast();
  const [currentCommentsPage, setCurrentCommentsPage] = useState(1);
  const totalCommentsPages = Math.ceil(token.comments.length / ITEMS_PER_PAGE);
  const commentsRef = useRef<HTMLDivElement>(null);

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(getFullAddress(address));
      toast({
        title: "Success",
        description: "Address has been copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Failed",
        description: "Failed to copy address",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentCommentsPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCurrentPageComments = () => {
    const startIndex = (currentCommentsPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return token.comments.slice(startIndex, endIndex);
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "comments" | "trades")}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="comments" className="relative">
            Comments
            <span className="ml-2 text-xs text-muted-foreground">
              ({token.comments.length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="trades" className="relative hidden lg:inline-flex">
            Trades
            <span className="ml-2 text-xs text-muted-foreground">
              ({token.trades.length})
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="comments" className="space-y-4">
        {/* 评论输入框 */}
        <div className="flex gap-2">
          <Input
            placeholder="Write a comment..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <Button onClick={handleSubmitComment}>Send</Button>
        </div>

        {/* 评论列表 */}
        <div className="space-y-4" ref={commentsRef}>
          {getCurrentPageComments().map((comment, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{truncateAddress(comment.user)}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 hover:bg-muted"
                        onClick={() => handleCopyAddress(comment.user)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            </Card>
          ))}

          {token.comments.length > ITEMS_PER_PAGE && (
            <Pagination 
              currentPage={currentCommentsPage}
              totalPages={totalCommentsPages}
              onPageChange={handlePageChange}
              scrollToRef={commentsRef}
            />
          )}
        </div>
      </TabsContent>

      {/* Trades Tab Content */}
      <TabsContent value="trades">
        <div className="space-y-4">
          <TradesView 
            token={token}
            formatTime={formatTime}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
} 