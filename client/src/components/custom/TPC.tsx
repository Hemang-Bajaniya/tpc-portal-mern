
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props{
    name: string,
    contact: string,
    department: string,
}

export function TPC({name, contact, department }: Props) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Department:</span>
          <span className="font-medium">{department}</span>
        </div>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Contact details:</span>
          <span className="font-medium ">{contact}</span>
        </div>
      </CardContent>
    </Card>
  );
}