import React, { useState } from "react";
import axios from "axios";
import { API_ROUTES } from "@/lib/apiRoutes";

// --- ShadCN UI Components ---
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// --- Icons ---
import { UploadCloud, Building2 } from "lucide-react";

// --- TypeScript Interface ---
interface CompanyData {
  name: string;
  logo: string; // URL path now
  company_description: string;
  company_website: string;
  company_location: string;
  company_type: string;
  contact_email: string;
  contact_phone: string;
}

export default function AddCompanyForm() {
  const [formData, setFormData] = useState<CompanyData>({
    name: "",
    logo: "",
    company_description: "",
    company_website: "",
    company_location: "",
    company_type: "",
    contact_email: "",
    contact_phone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic URL validation for logo (optional)
    if (formData.logo && !/^https?:\/\/.+\..+/.test(formData.logo)) {
      alert("Please enter a valid URL for the company logo.");
      return;
    }

    const dataToSubmit = {
      ...formData,
      // logo is already a URL string
    };

    try {
      await axios.post(API_ROUTES.COMPANIES, dataToSubmit, {
        withCredentials: true,
      });
      // Reset form after submission
      setFormData({
        name: "",
        logo: "",
        company_description: "",
        company_website: "",
        company_location: "",
        company_type: "",
        contact_email: "",
        contact_phone: "",
      });
      alert("Company added successfully!");
    } catch (error) {
      console.error("Error submitting company data:", error);
      alert("Error submitting company data. See console for details.");
    }

    // Debug payload
    // eslint-disable-next-line no-console
    console.log("Submitting Data:", dataToSubmit);
  };

  return (
    <Card className="w-full h-full flex flex-col border-0 shadow-none">
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Add New Company
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Fill out the form below to register a new company.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Logo URL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="flex flex-col items-center">
              <Label htmlFor="logo" className="mb-2 text-center">
                Company Logo URL
              </Label>
              <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/50 overflow-hidden">
                {formData.logo ? (
                  // Preview the provided URL
                  // If image fails to load, browser will show broken image icon
                  <img
                    src={formData.logo}
                    alt="Logo Preview"
                    className="h-full w-full object-contain rounded-md"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <UploadCloud className="mx-auto h-8 w-8" />
                    <p className="text-xs mt-1">Preview</p>
                  </div>
                )}
              </div>
              <Input
                id="logo"
                name="logo"
                type="url"
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="mt-3 text-sm"
              />
            </div>

            {/* Name + Type */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <Label htmlFor="name" className="pb-2">
                  Company Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Stellar Solutions Inc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="company_type" className="pb-2">
                  Industry / Type
                </Label>
                <Input
                  id="company_type"
                  name="company_type"
                  value={formData.company_type}
                  onChange={handleChange}
                  placeholder="e.g., Information Technology"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="company_description" className="pb-2">
              Company Description
            </Label>
            <Textarea
              id="company_description"
              name="company_description"
              value={formData.company_description}
              onChange={handleChange}
              placeholder="Provide a brief overview of the company..."
              className="min-h-[120px]"
            />
          </div>

          {/* Website + Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_website" className="pb-2">
                Company Website
              </Label>
              <Input
                id="company_website"
                name="company_website"
                type="url"
                value={formData.company_website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="company_location" className="pb-2">
                Headquarters Location
              </Label>
              <Input
                id="company_location"
                name="company_location"
                value={formData.company_location}
                onChange={handleChange}
                placeholder="e.g., Bengaluru, Karnataka"
              />
            </div>
          </div>

          {/* Contact Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_email" className="pb-2">
                Contact Email
              </Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
                placeholder="hr@example.com"
              />
            </div>
            <div>
              <Label htmlFor="contact_phone" className="pb-2">
                Contact Phone
              </Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="+91 1234567890"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border pt-6 px-6 sm:px-8 bg-white flex justify-end">
          <Button type="submit" size="lg">
            Add Company
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}