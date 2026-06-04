
"use client"

import { useState } from 'react';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { generateTaskXML, defaultXSLT, defaultXSD } from '@/lib/xml-logic';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileCode2, 
  Download, 
  CheckCircle2, 
  Terminal, 
  ChevronDown, 
  ChevronUp,
  FileText,
  FileType,
  Calendar,
  Clock
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function XMLToolsPage() {
  const { tasks } = useTasks();
  const [xslt, setXslt] = useState(defaultXSLT);
  const [xml, setXml] = useState(generateTaskXML(tasks));
  const [htmlPreview, setHtmlPreview] = useState<string>('');
  const [activeView, setActiveView] = useState<'xml' | 'xsd'>('xml');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [exportFormat, setExportFormat] = useState<'html' | 'pdf'>('html');

  const handleGenerate = () => {
    const generatedXml = generateTaskXML(tasks);
    setXml(generatedXml);
    
    const preview = `
      <div id="printable-report" style="color: white; padding: 40px; font-family: 'Inter', sans-serif; background: #09090B; min-height: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 24px;">
          <div>
            <h1 style="color: #845EF7; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.02em;">PROJECT ARCHITECTURE REPORT</h1>
            <p style="color: rgba(255,255,255,0.4); font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; margin-top: 8px;">System Status: Synchronized • Version 4.2</p>
          </div>
          <div style="text-align: right;">
            <p style="color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; margin: 0;">Generation Date</p>
            <p style="font-weight: 700; font-size: 14px; margin: 4px 0 0 0;">${new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 32px; backdrop-filter: blur(10px);">
          <table style="width: 100%; border-collapse: separate; border-spacing: 0 12px;">
            <thead>
              <tr style="text-align: left;">
                <th style="padding: 0 16px 8px 16px; color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;">Node Identity</th>
                <th style="padding: 0 16px 8px 16px; color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;">Timeline</th>
                <th style="padding: 0 16px 8px 16px; color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;">Priority</th>
                <th style="padding: 0 16px 8px 16px; color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;">Effort</th>
                <th style="padding: 0 16px 8px 16px; color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;">Integrity</th>
              </tr>
            </thead>
            <tbody>
              ${tasks.map(t => `
                <tr style="background: rgba(255,255,255,0.02);">
                  <td style="padding: 20px 16px; border-radius: 12px 0 0 12px; border-left: 2px solid ${t.priority === 'Critical' ? '#F43F5E' : '#845EF7'};">
                    <div style="font-weight: 600; font-size: 14px;">${t.name}</div>
                    <div style="font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 4px;">${t.status}</div>
                  </td>
                  <td style="padding: 20px 16px; font-size: 12px; color: rgba(255,255,255,0.6);">
                    ${t.startDate} → ${t.endDate}
                  </td>
                  <td style="padding: 20px 16px; font-size: 12px;">
                    <span style="color: ${t.priority === 'Critical' ? '#F43F5E' : '#845EF7'}; font-weight: 700;">${t.priority}</span>
                  </td>
                  <td style="padding: 20px 16px; font-size: 12px;">
                    ${t.estimatedEffortHours}h
                  </td>
                  <td style="padding: 20px 16px; font-size: 14px; font-weight: 700; border-radius: 0 12px 12px 0; color: #845EF7;">
                    ${t.progress}%
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 40px; background: rgba(132, 94, 247, 0.05); border-radius: 20px; padding: 24px; border: 1px solid rgba(132, 94, 247, 0.1);">
          <h4 style="margin: 0 0 8px 0; font-size: 12px; color: #845EF7; text-transform: uppercase; letter-spacing: 0.1em;">Architecture Summary</h4>
          <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.6;">
            This report summarizes ${tasks.length} active nodes. Total project scope estimated at ${tasks.reduce((acc, t) => acc + (t.estimatedEffortHours || 0), 0)} hours of effort. 
            The system is operating at an overall integrity level of ${Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / (tasks.length || 1))}% based on the current synchronization.
          </p>
        </div>
        
        <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px;">
          <p style="font-size: 10px; color: rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: 0.1em;">Generated by FluentGantt Engine • Digital Project Node Certification</p>
          <div style="width: 40px; height: 2px; background: #845EF7; border-radius: 2px;"></div>
        </div>
      </div>
    `;
    setHtmlPreview(preview);
    
    toast({
      title: "Architecture Sync Complete",
      description: "Neural report data has been visualized.",
    });
  };

  const handleExport = () => {
    if (!htmlPreview) {
      toast({ variant: "destructive", title: "Missing Data", description: "Generate a report before exporting." });
      return;
    }

    if (exportFormat === 'pdf') {
      toast({ title: "PDF Generation", description: "Select 'Save as PDF' in the print dialog as a prototype fallback." });
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Project Report</title>
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
              <style>
                body { margin: 0; background: #09090B; }
                @media print {
                  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
              </style>
            </head>
            <body>${htmlPreview}</body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    } else {
      const blob = new Blob([htmlPreview], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fluentgantt-report-${new Date().getTime()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({ title: "Download Initiated", description: "HTML architecture document exported successfully." });
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <DashboardNav />
      <main className="pl-20 p-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Report Center</h1>
              <p className="text-muted-foreground mt-2">Generate professional project documentation from your neural data</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 px-3 text-muted-foreground">
                <FileType size={16} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Format</span>
              </div>
              <Select value={exportFormat} onValueChange={(v: any) => setExportFormat(v)}>
                <SelectTrigger className="w-[100px] bg-black/40 border-white/5 text-[10px] font-bold uppercase tracking-widest h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="html" className="text-[10px] font-bold uppercase">HTML</SelectItem>
                  <SelectItem value="pdf" className="text-[10px] font-bold uppercase">PDF</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleGenerate}
                className="bg-primary hover:bg-primary/80 text-white font-bold rounded-xl shadow-lg shadow-primary/20 px-8 h-10 text-[10px] uppercase tracking-widest"
              >
                <FileText size={16} className="mr-2" /> Generate
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-8">
            <div className="glass p-8 rounded-[2.5rem] min-h-[500px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-white text-xl">Architecture Preview</h3>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Neural Rendering Engine</p>
                  </div>
                </div>
                
                {htmlPreview && (
                  <Button 
                    variant="ghost" 
                    onClick={handleExport}
                    className="text-[10px] uppercase font-bold tracking-widest border border-white/5 bg-white/5 hover:bg-white/10 rounded-xl h-10 px-6"
                  >
                    <Download size={14} className="mr-2" /> Download {exportFormat}
                  </Button>
                )}
              </div>
              
              <div className="flex-1 bg-black/40 rounded-[2rem] border border-white/5 overflow-auto custom-scrollbar">
                {htmlPreview ? (
                  <div dangerouslySetInnerHTML={{ __html: htmlPreview }} className="animate-in fade-in duration-500" />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground flex-col gap-6 p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                      <FileText size={32} className="opacity-10" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-white/40">No report generated yet</p>
                      <p className="text-[10px] uppercase tracking-widest text-white/20 max-w-[280px]">
                        Configure your format and click "Generate" to synchronize the architecture
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced} className="glass p-6 rounded-[2rem] border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Terminal size={18} className="text-primary" />
                  <span className="text-sm font-bold uppercase tracking-widest text-white/60">Advanced Neural Tools</span>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                    {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Source Architecture (XML)</h4>
                      <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                        <button 
                          onClick={() => setActiveView('xml')}
                          className={cn("px-3 py-1 rounded-md text-[10px] font-bold transition-all", activeView === 'xml' ? "bg-primary text-white" : "text-white/40")}
                        >XML</button>
                        <button 
                          onClick={() => setActiveView('xsd')}
                          className={cn("px-3 py-1 rounded-md text-[10px] font-bold transition-all", activeView === 'xsd' ? "bg-primary text-white" : "text-white/40")}
                        >XSD</button>
                      </div>
                    </div>
                    <Textarea 
                      value={activeView === 'xml' ? xml : defaultXSD} 
                      readOnly 
                      className="bg-black/60 border-white/5 font-mono text-[10px] h-[250px] leading-relaxed text-cyan-400/60 rounded-2xl"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Transformation Engine (XSLT)</h4>
                      <Button variant="ghost" size="sm" className="h-6 text-[9px] uppercase font-black bg-white/5">Reset Default</Button>
                    </div>
                    <Textarea 
                      value={xslt} 
                      onChange={(e) => setXslt(e.target.value)}
                      className="bg-black/60 border-white/5 font-mono text-[10px] h-[250px] leading-relaxed text-primary/60 rounded-2xl"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </main>
    </div>
  );
}
