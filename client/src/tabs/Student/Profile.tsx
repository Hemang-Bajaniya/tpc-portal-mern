import { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";

export default function StudentProfileForm() {
  const [resume, setResume] = useState<File | null>(null);
  const [selectedDept, setSelectedDept] = useState<string>("");

  // Example departments, replace with real data
  const departments = [
    { id: "1", name: "Computer Science" },
    { id: "2", name: "Electronics" },
    // ...
  ];

  return (
    <Card className="max-w-xl mx-auto mt-4">
      <CardHeader>
        <h2 className="text-2xl font-bold">Student Profile</h2>
      </CardHeader>
      <form>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="college_id" className="pb-4">College ID</Label>
            <Input id="college_id" name="college_id" disabled value="22XX001"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="f_name" className="pb-4">First Name</Label>
              <Input id="f_name" name="f_name" required />
            </div>
            <div>
              <Label htmlFor="m_name" className="pb-4">Middle Name</Label>
              <Input id="m_name" name="m_name" />
            </div>
            <div>
              <Label htmlFor="l_name" className="pb-4">Last Name</Label>
              <Input id="l_name" name="l_name" required />
            </div>
          </div>
          <div>
            <Label htmlFor="mobile" className="pb-4">Mobile</Label>
            <Input id="mobile" name="mobile" type="tel" required />
          </div>
          <div>
            <Label htmlFor="dob" className="pb-4">Date of Birth</Label>
            <Input id="dob" name="dob" type="date" required />
          </div>
          <div>
            <Label htmlFor="address" className="pb-4">Address</Label>
            <Input id="address" name="address" required />
          </div>
          <div>
            <Label htmlFor="dept_id" className="pb-4">Department</Label>
            <Input id="department" name="department" value="Computer" disabled required />
          </div>
          <div>
            <Label htmlFor="skills" className="pb-4">Skills (comma separated)</Label>
            <Input id="skills" name="skills" placeholder="e.g. JavaScript, Python" />
          </div>
          <div>
            <Label htmlFor="resume" className="pb-4">Resume (PDF)</Label>
            <Input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf"
              onChange={e => setResume(e.target.files?.[0] || null)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end mt-4">
          <Button type="submit">Save Profile</Button>
        </CardFooter>
      </form>
    </Card>
  );
}