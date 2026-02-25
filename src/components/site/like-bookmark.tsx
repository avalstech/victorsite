"use client";
import { useEffect, useState, useCallback } from "react";
import { Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dataClient } from "@/lib/amplify/data";
import { getCurrentUser } from "aws-amplify/auth";
import { toast } from "sonner";

export function LikeBookmark({ contentType, contentId }: { contentType: "BLOG" | "CASE"; contentId: string }) {
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      const id = `${user.userId}#${contentType}#${contentId}`;
      const res = await dataClient.models.Interaction.get({ id });
      setLiked(!!res.data?.liked);
      setBookmarked(!!res.data?.bookmarked);
    } catch {
      setLiked(false);
      setBookmarked(false);
    } finally {
      setLoading(false);
    }
  }, [contentType, contentId]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (field: "liked" | "bookmarked") => {
    try {
      const user = await getCurrentUser();
      const id = `${user.userId}#${contentType}#${contentId}`;
      const next = field === "liked" ? !liked : !bookmarked;

      // optimistic UI
      if (field === "liked") setLiked(next);
      else setBookmarked(next);

      await dataClient.models.Interaction.upsert({
        id,
        userId: user.userId,
        contentType,
        contentId,
        liked: field === "liked" ? next : liked,
        bookmarked: field === "bookmarked" ? next : bookmarked
      });

      toast.success(field === "liked" ? (next ? "Liked" : "Unliked") : (next ? "Bookmarked" : "Removed bookmark"));
    } catch (e: any) {
      toast.error("Sign in required");
      // revert on failure
      await load();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" disabled={loading} onClick={() => toggle("liked")}>
        <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-brand-600 text-brand-600" : ""}`} /> Like
      </Button>
      <Button variant="outline" disabled={loading} onClick={() => toggle("bookmarked")}>
        <Bookmark className={`mr-2 h-4 w-4 ${bookmarked ? "fill-slate-900 text-slate-900" : ""}`} /> Save
      </Button>
    </div>
  );
}
