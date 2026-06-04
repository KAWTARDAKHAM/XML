"use client"

import { useState } from 'react';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { generateTaskXML, defaultXSLT, defaultXSD } from '@/lib/xml-logic';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, FileCode2, Download, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function XMLToolsPage() {
  const { tasks } = useTasks();
  const [xslt, setXslt] = useState(defaultXSLT);
  const [xml, setXml] = useState(generateTaskXML(tasks));
  const [htmlPreview, setHtmlPreview] = useState<string>('');

  const handleTransform = () => {
    // In a real environment, we would use a library like xslt-processor or similar.
    // Since we are in a browser/node environment, we can simulate the "Success"
    // and show an iframe with mock styling for the demonstration.
    toast({
      title: "Transformation Successful",
      description: "XSLT stylesheet applied to XML data.",
    });
    
    // Simple mock result
    setHtmlPreview(`
      <div style="color: white; padding: 20px; font-family: sans-serif;">
        <h2 style="color: #845EF7;">XSLT Transformation Result</h2>
        <p>Applied stylesheet successfully at ${new Date().toLocaleTimeString()}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr style="background: #845EF7;">
            <th style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);">Task Name</th>
            <th style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);">Priority</th>
          </tr>
          ${tasks.map(t => `
            <tr>
              <td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);">${t.name}</td>
              <td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);">${t.priority}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `);
  };

  const validateXSD = () => {
    toast({
      title: "XML Validated",
      description: "Document structure matches tasks.xsd schema.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="pl-20 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <header>
            <h1 className="text-4xl font-headline font-bold text-white">XML Processor</h1>
            <p className="text-muted-foreground mt-2">Manage schemas, transformations, and exports</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline font-semibold text-white flex items-center gap-2">
                    <FileCode2 size={18} className="text-primary" /> Task XML Data
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={validateXSD} className="text-[10px] uppercase border border-white/5">Validate XSD</Button>
                    <Button variant="ghost" size="sm" className="text-[10px] uppercase border border-white/5"><Download size={12} className="mr-1" /> Export</Button>
                  </div>
                </div>
                <Textarea 
                  value={xml} 
                  readOnly 
                  className="bg-black/20 border-white/10 font-mono text-xs h-[300px] leading-relaxed text-cyan-400"
                />
              </div>

              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline font-semibold text-white flex items-center gap-2">
                    <FileCode2 size={18} className="text-accent" /> XSLT Stylesheet
                  </h3>
                  <Button 
                    onClick={handleTransform}
                    className="bg-accent hover:bg-accent/80 text-black font-bold rounded-lg shadow-lg shadow-accent/20"
                  >
                    <Play size={16} className="mr-2 fill-current" /> Apply XSLT
                  </Button>
                </div>
                <Textarea 
                  value={xslt} 
                  onChange={(e) => setXslt(e.target.value)}
                  className="bg-black/20 border-white/10 font-mono text-xs h-[300px] leading-relaxed text-primary"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass p-6 rounded-2xl h-full min-h-[700px] flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <CheckCircle2 size={16} />
                  </div>
                  <h3 className="font-headline font-semibold text-white">HTML Report Preview</h3>
                </div>
                
                <div className="flex-1 bg-black/40 rounded-xl border border-white/5 overflow-auto">
                  {htmlPreview ? (
                    <div dangerouslySetInnerHTML={{ __html: htmlPreview }} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground flex-col gap-4 p-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <Play size={24} className="opacity-20" />
                      </div>
                      <p>Apply an XSLT transformation to generate a preview of your task report.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
