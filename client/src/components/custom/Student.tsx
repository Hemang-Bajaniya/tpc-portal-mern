import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  studentId: string;
  name: string;
  department: string;
  companie: string | null;
  ctc: string | null;
}

export function Student({ studentId, name, department, companie, ctc }: Props) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Student ID:</span>
          <span className="font-medium text-black">{studentId}</span>
        </div>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Department:</span>
          <span className="font-medium text-black">{department}</span>
        </div>

        {companie && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Company:</span>
            <Badge variant="outline">{companie}</Badge>
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
