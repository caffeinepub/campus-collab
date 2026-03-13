import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@icp-sdk/core/principal";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSendMessage } from "../hooks/useQueries";
import AvatarCircle from "./AvatarCircle";

interface SendMessageDialogProps {
  open: boolean;
  onClose: () => void;
  recipientPrincipal: Principal | null;
  recipientName: string;
  projectId?: bigint;
  projectTitle?: string;
  onAfterSend?: () => void;
}

export default function SendMessageDialog({
  open,
  onClose,
  recipientPrincipal,
  recipientName,
  projectId,
  projectTitle,
  onAfterSend,
}: SendMessageDialogProps) {
  const [body, setBody] = useState("");
  const { mutateAsync, isPending } = useSendMessage();

  const handleSend = async () => {
    if (!body.trim() || !recipientPrincipal) return;
    try {
      await mutateAsync({
        to: recipientPrincipal,
        body: body.trim(),
        projectId: projectId ?? null,
      });
      toast.success(
        <span>
          Message sent! Check{" "}
          <button
            type="button"
            className="underline font-bold"
            onClick={() => {
              toast.dismiss();
              onAfterSend?.();
            }}
          >
            Messages
          </button>{" "}
          to see your inbox.
        </span>,
      );
      setBody("");
      onClose();
    } catch {
      toast.error("Failed to send message");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="border-2 border-border bg-card"
        style={{ boxShadow: "4px 4px 0px oklch(0.92 0.26 129)" }}
        data-ocid="messages.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 font-bold text-lg">
            <AvatarCircle name={recipientName} size={36} />
            <span>Message {recipientName}</span>
          </DialogTitle>
        </DialogHeader>
        {projectTitle && (
          <div
            className="border border-accent text-accent text-xs font-semibold px-3 py-1.5"
            style={{ background: "oklch(0.9 0.15 195 / 0.1)" }}
          >
            Re: {projectTitle}
          </div>
        )}
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Yo! I saw your project and I'm totally down to collab..."
          className="border-2 border-border bg-input min-h-[120px] resize-none focus:border-primary"
          data-ocid="messages.message_input"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend();
          }}
        />
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-2 border-border btn-outline"
            data-ocid="messages.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isPending || !body.trim()}
            className="btn-primary"
            data-ocid="messages.send_button"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
            ) : null}
            Send it 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
