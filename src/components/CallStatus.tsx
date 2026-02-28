import { Phone, CheckCircle, XCircle, Loader2, AlertTriangle, ShieldAlert, Shield } from "lucide-react";

export type CallState = "idle" | "calling" | "completed" | "failed";
export type SpamTag = "spam" | "not_spam" | "unknown";

export interface CallRecord {
  number: string;
  state: CallState;
  spamTag: SpamTag;
  error?: string;
}

interface CallStatusProps {
  calls: CallRecord[];
  onTagSpam: (index: number, tag: SpamTag) => void;
}

const stateConfig: Record<CallState, { icon: typeof Phone; label: string; colorClass: string }> = {
  idle: { icon: Phone, label: "Queued", colorClass: "text-muted-foreground" },
  calling: { icon: Loader2, label: "Calling...", colorClass: "text-info" },
  completed: { icon: CheckCircle, label: "Completed", colorClass: "text-success" },
  failed: { icon: XCircle, label: "Failed", colorClass: "text-danger" },
};

const CallStatus = ({ calls, onTagSpam }: CallStatusProps) => {
  if (calls.length === 0) return null;

  const stats = {
    total: calls.length,
    completed: calls.filter((c) => c.state === "completed").length,
    failed: calls.filter((c) => c.state === "failed").length,
    spam: calls.filter((c) => c.spamTag === "spam").length,
    notSpam: calls.filter((c) => c.spamTag === "not_spam").length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm font-semibold text-primary tracking-wider uppercase glow-text">
          Call Results
        </h2>
        <div className="flex gap-3 font-mono text-xs">
          <span className="text-success">{stats.completed} done</span>
          <span className="text-danger">{stats.failed} failed</span>
          <span className="text-warning">{stats.spam} spam</span>
        </div>
      </div>

      <div className="space-y-1 max-h-[400px] overflow-y-auto terminal-border rounded-md p-2">
        {calls.map((call, i) => {
          const config = stateConfig[call.state];
          const Icon = config.icon;
          return (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 rounded hover:bg-secondary/50"
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${config.colorClass} ${
                    call.state === "calling" ? "animate-spin" : ""
                  }`}
                />
                <span className="font-mono text-xs text-foreground">{call.number}</span>
                <span className={`font-mono text-xs ${config.colorClass}`}>
                  {config.label}
                </span>
                {call.error && (
                  <span className="font-mono text-xs text-danger/70 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {call.error}
                  </span>
                )}
              </div>

              {call.state === "completed" && (
                <div className="flex gap-1">
                  <button
                    onClick={() => onTagSpam(i, "spam")}
                    className={`px-2 py-0.5 rounded text-xs font-mono transition-colors flex items-center gap-1 ${
                      call.spamTag === "spam"
                        ? "bg-danger/20 text-danger"
                        : "text-muted-foreground hover:text-danger hover:bg-danger/10"
                    }`}
                  >
                    <ShieldAlert className="w-3 h-3" /> Spam
                  </button>
                  <button
                    onClick={() => onTagSpam(i, "not_spam")}
                    className={`px-2 py-0.5 rounded text-xs font-mono transition-colors flex items-center gap-1 ${
                      call.spamTag === "not_spam"
                        ? "bg-success/20 text-success"
                        : "text-muted-foreground hover:text-success hover:bg-success/10"
                    }`}
                  >
                    <Shield className="w-3 h-3" /> Clean
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CallStatus;
