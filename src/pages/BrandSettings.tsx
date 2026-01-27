import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Save,
  Mail,
  Phone,
  Link,
  Palette,
  Image,
  Type,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

const BrandSettings = () => {
  const [brandData, setBrandData] = useState({
    companyName: "Opex Consulting",
    tagline: "Strategic Solutions for Business Growth",
    email: "sales@opexconsulting.com",
    phone: "+1 (555) 987-6543",
    website: "https://opexconsulting.com",
    linkedin: "https://linkedin.com/company/opexconsulting",
    twitter: "https://twitter.com/opexconsulting",
    primaryColor: "#1e3a5f",
    accentColor: "#2d9d92",
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout 
      title="Brand Settings" 
      subtitle="Configure your brand identity for emails, SMS, and UI"
      actions={
        <Button variant="accent" onClick={handleSave}>
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      }
    >
      <div className="max-w-4xl space-y-8">
        {/* Logo & Assets */}
        <section className="chart-container">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Image size={20} className="text-accent" />
            Logo & Assets
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Company Logo</label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Upload size={24} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, SVG up to 2MB
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Email Banner / Background</label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Image size={24} className="text-accent" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload banner image
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  1200x400px recommended
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Info */}
        <section className="chart-container">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Type size={20} className="text-accent" />
            Company Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Company Name</label>
              <input 
                type="text"
                value={brandData.companyName}
                onChange={(e) => setBrandData({ ...brandData, companyName: e.target.value })}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tagline</label>
              <input 
                type="text"
                value={brandData.tagline}
                onChange={(e) => setBrandData({ ...brandData, tagline: e.target.value })}
                className="input-field w-full"
              />
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="chart-container">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Mail size={20} className="text-accent" />
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Mail size={14} className="text-muted-foreground" />
                Official Email (Sender)
              </label>
              <input 
                type="email"
                value={brandData.email}
                onChange={(e) => setBrandData({ ...brandData, email: e.target.value })}
                className="input-field w-full"
                placeholder="sales@company.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Phone size={14} className="text-muted-foreground" />
                Official Phone (SMS Sender)
              </label>
              <input 
                type="tel"
                value={brandData.phone}
                onChange={(e) => setBrandData({ ...brandData, phone: e.target.value })}
                className="input-field w-full"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Link size={14} className="text-muted-foreground" />
                Website
              </label>
              <input 
                type="url"
                value={brandData.website}
                onChange={(e) => setBrandData({ ...brandData, website: e.target.value })}
                className="input-field w-full"
              />
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="chart-container">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Link size={20} className="text-accent" />
            Social Media Links
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">LinkedIn</label>
              <input 
                type="url"
                value={brandData.linkedin}
                onChange={(e) => setBrandData({ ...brandData, linkedin: e.target.value })}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Twitter / X</label>
              <input 
                type="url"
                value={brandData.twitter}
                onChange={(e) => setBrandData({ ...brandData, twitter: e.target.value })}
                className="input-field w-full"
              />
            </div>
          </div>
        </section>

        {/* Brand Colors */}
        <section className="chart-container">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Palette size={20} className="text-accent" />
            Brand Colors
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Primary Color</label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                  style={{ backgroundColor: brandData.primaryColor }}
                />
                <input 
                  type="text"
                  value={brandData.primaryColor}
                  onChange={(e) => setBrandData({ ...brandData, primaryColor: e.target.value })}
                  className="input-field flex-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Accent Color</label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                  style={{ backgroundColor: brandData.accentColor }}
                />
                <input 
                  type="text"
                  value={brandData.accentColor}
                  onChange={(e) => setBrandData({ ...brandData, accentColor: e.target.value })}
                  className="input-field flex-1"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 pt-6 border-t border-border">
            <label className="text-sm font-medium mb-3 block">Email Preview</label>
            <div 
              className="rounded-xl p-6 text-center"
              style={{ 
                background: `linear-gradient(135deg, ${brandData.primaryColor} 0%, ${brandData.accentColor} 100%)` 
              }}
            >
              <h4 className="text-xl font-bold text-white mb-1">{brandData.companyName}</h4>
              <p className="text-white/80 text-sm">{brandData.tagline}</p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default BrandSettings;
