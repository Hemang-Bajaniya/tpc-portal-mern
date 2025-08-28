
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props{
    studentId: string,
    name: string,
    contact: string,
    positon: string,
}

export function TPC({ studentId, name, contact, positon }: Props) {
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
          <span>Position:</span>
          <span className="font-medium">{positon}</span>
        </div>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Contact details:</span>
          <span className="font-medium ">{contact}</span>
        </div>
      </CardContent>
    </Card>
  );
}