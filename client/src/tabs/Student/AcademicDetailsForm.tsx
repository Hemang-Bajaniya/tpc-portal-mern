import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AcademicDetailsForm() {
  return (
    <Card className="max-w-xl mx-auto mt-4">
      <CardHeader>
        <h2 className="text-2xl font-bold">Academic Details</h2>
      </CardHeader>
      <form>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="be_percentage" className="pb-4">B.E. Percentage</Label>
            <Input id="be_percentage" name="be_percentage" type="number" step="0.01" min="0" max="100" required />
          </div>
          <div>
            <Label htmlFor="be_cgpa" className="pb-4">B.E. CGPA</Label>
            <Input id="be_cgpa" name="be_cgpa" type="number" step="0.01" min="0" max="10" required />
          </div>
          <div>
            <Label htmlFor="hsc_percentage" className="pb-4">HSC Percentage</Label>
            <Input id="hsc_percentage" name="hsc_percentage" type="number" step="0.01" min="0" max="100" />
          </div>
          <div>
            <Label htmlFor="diploma_percentage" className="pb-4">Diploma Percentage</Label>
            <Input id="diploma_percentage" name="diploma_percentage" type="number" step="0.01" min="0" max="100" />
          </div>
          <div>
            <Label htmlFor="ssc_percentage" className="pb-4">SSC Percentage</Label>
            <Input id="ssc_percentage" name="ssc_percentage" type="number" step="0.01" min="0" max="100" />
          </div>
          <div>
            <Label htmlFor="liveKT" className="pb-4">Live KTs</Label>
            <Input id="liveKT" name="liveKT" type="number" min="0" />
          </div>
          <div>
            <Label htmlFor="deadKT" className="pb-4">Dead KTs</Label>
            <Input id="deadKT" name="deadKT" type="number" min="0" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end mt-4">
          <Button type="submit">Save Academic Details</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
