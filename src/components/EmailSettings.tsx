import React, { useState } from "react";
import { useLinks } from "@/contexts/LinkContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmailConfig } from "@/types";
import { toast } from "sonner";

export const EmailSettings = () => {
  const { emailConfig, updateEmailConfig } = useLinks();
  const [formState, setFormState] = useState<EmailConfig>(emailConfig);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formState.enabled && !formState.email) {
      toast.error("Please enter your email address");
      return;
    }

    // Simple email validation
    if (formState.enabled && !/\S+@\S+\.\S+/.test(formState.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    updateEmailConfig(formState);
  };

  return (
    <form
      id="email-settings-form"
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <h3 className="text-lg font-medium">Email digest settings</h3>
      <p className="text-sm text-muted-foreground">
        Configure periodic email summaries of your unread links
      </p>

      <div className="flex items-center justify-between">
        <Label htmlFor="email-enabled" className="text-sm">
          Enable email digests
        </Label>
        <Switch
          id="email-enabled"
          checked={formState.enabled}
          onCheckedChange={(checked) =>
            setFormState((prev) => ({ ...prev, enabled: checked }))
          }
        />
      </div>

      {formState.enabled && (
        <>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formState.email}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-sm">
              Frequency
            </Label>
            <Select
              value={formState.frequency}
              onValueChange={(value) =>
                setFormState((prev) => ({
                  ...prev,
                  frequency: value as EmailConfig["frequency"],
                }))
              }
            >
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem id="frequency-daily" value="daily">
                  Daily
                </SelectItem>
                <SelectItem id="frequency-weekly" value="weekly">
                  Weekly
                </SelectItem>
                <SelectItem id="frequency-monthly" value="monthly">
                  Monthly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <Button id="save-email-settings" type="submit" className="w-full">
        Save email preferences
      </Button>
    </form>
  );
};
