import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Settings() {
  return (
    <Card className="max-w-md mx-auto mt-4">
      <CardHeader>
        <h2 className="text-2xl font-bold">Change Password</h2>
      </CardHeader>
      <form>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="current_password" className="pb-4">Current Password</Label>
            <Input id="current_password" name="current_password" type="password" required />
          </div>
          <div>
            <Label htmlFor="new_password" className="pb-4">New Password</Label>
            <Input id="new_password" name="new_password" type="password" required />
          </div>
          <div>
            <Label htmlFor="confirm_password" className="pb-4">Confirm New Password</Label>
            <Input id="confirm_password" name="confirm_password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end mt-4">
          <Button type="submit">Change Password</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
