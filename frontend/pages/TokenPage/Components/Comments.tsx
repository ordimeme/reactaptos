import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarketItem } from "@/types/market";
import { truncateAddress } from "@/utils/truncateAddress";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Pagination } from "@/components/Pagination";
import { formatRelativeTime } from "@/utils/formatDate";
import { MessageCircle } from "lucide-react";
import { Comment } from "@/types/market";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ConnectWalletDialog } from "@/components/WalletSelector";

interface CommentsProps {
  token: MarketItem;
  commentContent: string;
  setCommentContent: (content: string) => void;
  handleSubmitComment: () => void;
}

const COMMENTS_PER_PAGE = 20;

export function Comments({
  token,
  commentContent,
  setCommentContent,
  handleSubmitComment,
}: CommentsProps) {
  const { connected, account } = useWalletConnect();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalPages = Math.ceil((token.comments?.length || 0) / COMMENTS_PER_PAGE);

  const getCurrentPageComments = () => {
    if (!token.comments) return [];
    const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
    const endIndex = startIndex + COMMENTS_PER_PAGE;
    return token.comments.slice(startIndex, endIndex);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      setIsDialogOpen(true);
      return;
    }
    
    if (!account?.address) {
      toast({
        title: "Error",
        description: "No wallet address found",
        variant: "destructive",
      });
      return;
    }

    if (!commentContent.trim()) {
      toast({
        title: "Error", 
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    handleSubmitComment();
  };

  return (
    <div className="space-y-4">
      {/* 标题和评论数量 - 在桌面端隐藏 */}
      <div className="flex items-center justify-between lg:hidden">
        <h3 className="text-lg font-semibold">Comments</h3>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm">{token.comments?.length || 0}</span>
        </div>
      </div>

      {/* 评论输入区域 */}
      <form onSubmit={handleCommentSubmit} className="space-y-4">
        <Textarea
          placeholder={connected ? "Write a comment..." : "Please connect wallet to comment"}
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          disabled={!connected}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          {connected ? (
            <Button 
              type="submit" 
              disabled={!commentContent.trim()}
            >
              Post
            </Button>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">Connect Wallet</Button>
              </DialogTrigger>
              <ConnectWalletDialog close={() => setIsDialogOpen(false)} />
            </Dialog>
          )}
        </div>
      </form>

      {/* 评论列表 */}
      <div className="space-y-4">
        {getCurrentPageComments().map((comment: Comment, index: number) => (
          <div 
            key={index}
            className="border border-muted/40 dark:border-muted/20 rounded-lg p-4 space-y-2"
          >
            {/* 用户信息和时间 */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-mono text-muted-foreground">
                  {truncateAddress(comment.author, 6, 4, true)}
                </span>
              </div>
              <span className="text-muted-foreground">
                {formatRelativeTime(comment.timestamp)}
              </span>
            </div>
            {/* 评论内容 */}
            <p className="text-sm">{comment.content}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 border-t border-muted/20 pt-4">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
} 