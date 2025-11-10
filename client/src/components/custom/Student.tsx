import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  studentId: string;
  name: string;
  department: string;
  companie: string | null;
  jobTitle?: string | null;
  ctc: string | null;
  logo?: string | null;
}

export function Student({ studentId, name, department, companie, jobTitle, ctc, logo }: Props) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-md hover:shadow-lg transition-all">
      <CardHeader className="flex items-center gap-3">
        {logo && (
          <img
            src={logo}
            alt={companie || "Company Logo"}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <CardTitle className="text-xl font-semibold">{name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Student ID:</span>
          <span className="font-medium text-black">{studentId}</span>
        </div>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Student Name:</span>
          <span className="font-medium text-black">{name}</span>
        </div>

        {companie && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Company:</span>
            <span className="font-medium text-black"><Badge variant={"outline"}>{companie}</Badge></span>
          </div>
        )}

        {jobTitle && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Job Profile:</span>
            <span className="font-medium text-black">{jobTitle}</span>
          </div>
        )}

        {ctc && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>CTC:</span>
            <span className="font-medium text-green-600">{ctc} LPA</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}