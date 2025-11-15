import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Building2 } from "lucide-react";

interface Props {
  name?: string;
  contact?: string;
  department?: string;
}

export function TPC({ name, contact, department }: Props) {
  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-all border border-gray-200 rounded-xl">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-semibold text-gray-900 truncate">
          {name || "Unnamed Member"}
        </CardTitle>
      </CardHeader>

      <hr className="w-[90%] m-auto" />

      <CardContent className="text-sm">

        {/* Department Row */}
        <div className="flex items-center gap-2 text-gray-700">
          <Building2 size={16} className="text-gray-500" />
          <span className="font-medium truncate">
            {department || "Department unavailable"}
          </span>
        </div>

        {/* Contact Row */}
        <div className="flex items-center gap-2 text-gray-700">
          <Phone size={16} className="text-gray-500" />
          <span className="font-medium truncate">
            {contact || "No contact number"}
          </span>
        </div>

      </CardContent>
    </Card >
  );
}
