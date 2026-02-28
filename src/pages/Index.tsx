import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Zap, Activity } from "lucide-react";
import NumberInput from "@/components/NumberInput";
import CallStatus, { CallRecord, SpamTag } from "@/components/CallStatus";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [numbers, setNumbers] = useState<string[]>([]);
  const [twilioNumber, setTwilioNumber] = useState("");
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [delayMs, setDelayMs] = useState(3000);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const startCalling = async () => {
    if (!twilioNumber.trim()) {
      toast.error("Enter your Twilio number first");
      return;
    }
    if (numbers.length === 0) {
      toast.error("Add destination numbers first");
      return;
    }

    setIsRunning(true);
    const initialCalls: CallRecord[] = numbers.map((n) => ({
      number: n,
      state: "idle",
      spamTag: "unknown",
    }));
    setCalls(initialCalls);

    for (let i = 0; i < numbers.length; i++) {
      setCalls((prev) =>
        prev.map((c, idx) => (idx === i ? { ...c, state: "calling" } : c))
      );

      try {
        const { data, error } = await supabase.functions.invoke("initiate-call", {
          body: { from: twilioNumber, to: numbers[i] },
        });

        if (error) throw error;

        setCalls((prev) =>
          prev.map((c, idx) =>
            idx === i ? { ...c, state: "completed" } : c
          )
        );
      } catch (err: any) {
        setCalls((prev) =>
          prev.map((c, idx) =>
            idx === i
              ? { ...c, state: "failed", error: err.message || "Unknown error" }
              : c
          )
        );
      }

      if (i < numbers.length - 1) {
        await sleep(delayMs);
      }
    }

    setIsRunning(false);
    toast.success("All calls processed!");
  };

  const handleTagSpam = (index: number, tag: SpamTag) => {
    setCalls((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, spamTag: c.spamTag === tag ? "unknown" : tag } : c
      )
    );
  };

  const completedCalls = calls.filter((c) => c.state === "completed").length;
  const spamCount = calls.filter((c) => c.spamTag === "spam").length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center glow-primary">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Spam Tester
              </h1>
              <p className="text-xs font-mono text-muted-foreground">
                Bulk call initiation via Twilio
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        {calls.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Processed", value: `${completedCalls}/${calls.length}`, icon: Activity, color: "text-info" },
              { label: "Spam Detected", value: spamCount, icon: Phone, color: "text-warning" },
              { label: "Spam Rate", value: completedCalls > 0 ? `${Math.round((spamCount / completedCalls) * 100)}%` : "—", icon: Zap, color: "text-danger" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-lg p-4 terminal-border">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`w-3 h-3 ${stat.color}`} />
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <span className={`font-mono text-lg font-bold ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Twilio Number (From) */}
        <div className="bg-card rounded-lg p-5 terminal-border space-y-3">
          <h2 className="font-mono text-sm font-semibold text-primary tracking-wider uppercase glow-text">
            Your Twilio Number
          </h2>
          <p className="font-mono text-xs text-muted-foreground">
            This number will be used as the caller ID for all outgoing calls
          </p>
          <Input
            value={twilioNumber}
            onChange={(e) => setTwilioNumber(e.target.value)}
            placeholder="+1234567890"
            className="font-mono text-sm bg-background"
          />
        </div>

        {/* Destination Numbers */}
        <div className="bg-card rounded-lg p-5 terminal-border">
          <NumberInput numbers={numbers} onNumbersChange={setNumbers} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            onClick={startCalling}
            disabled={isRunning || numbers.length === 0}
            size="lg"
            className="font-mono text-sm glow-primary"
          >
            {isRunning ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-pulse" />
                Running...
              </>
            ) : (
              <>
                <Phone className="w-4 h-4 mr-2" />
                Start Bulk Calls
              </>
            )}
          </Button>

          <div className="flex items-center gap-2">
            <label className="font-mono text-xs text-muted-foreground">Delay:</label>
            <Input
              type="number"
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value))}
              className="w-24 font-mono text-xs bg-background"
              min={1000}
              step={500}
            />
            <span className="font-mono text-xs text-muted-foreground">ms</span>
          </div>
        </div>

        {/* Call Results */}
        <div className="bg-card rounded-lg p-5 terminal-border">
          <CallStatus calls={calls} onTagSpam={handleTagSpam} />
          {calls.length === 0 && (
            <div className="text-center py-12">
              <Phone className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-mono text-xs text-muted-foreground">
                No calls initiated yet. Add destination numbers and start the test.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
