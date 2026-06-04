
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
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useSettings } from '@/hooks/use-settings-context';

export default function XMLToolsPage() {
  const { tasks } = useTasks();
  const { t: trans, language } = useSettings();
  const [xslt, setXslt] = useState(defaultXSLT);
  const [xml, setXml] = useState(generateTaskXML(tasks));
  const [htmlPreview, setHtmlPreview] = useState<string>('');
  const [activeView, setActiveView] = useState<'xml' | 'xsd'>('xml');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [exportFormat, setExportFormat] = useState<'html' | 'pdf'>('html');

  const handleGenerate = () => {
    const generatedXml = generateTaskXML(tasks);
    setXml(generatedXml);
    
    const progress = Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / (tasks.length || 1));
    const effort = tasks.reduce((acc, t) => acc + (t.estimatedEffortHours || 0), 0);

    const preview = `
      <div id="printable-report" style="color: ${language === 'fr' ? 'white' : 'white'}; padding: 40px; font-family: 'Inter', sans-serif; background: #09090B; min-height: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 24px;">
          <div>
            <h1 style="color: #845EF7; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.02em;">${trans.report.title}</h1>
            <p style="color: rgba(255,255,255,0.4); font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; margin-top: 8px;">${trans.report.subtitle}</p>
          </div>
          <div style="text-align: right;">
            <p style="color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; margin: 0;">${trans.report.genDate}</p>
            <p style="font-weight: 700; font-size: 14px; margin: 4px 0 0 0;">${new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
          </div>
        </div>
        
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 32px; backdrop-filter: blur(10px);">
          <table style="width: 100%; border-collapse: separate; border-spacing: 0 12px;">
            <thead>
              <tr style="text-align: left;">
                <th style="padding: 0 16px 8px 16px; color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;">${trans.report.nodeIdentity}</th>
                <th style="padding: 0 16px 8px 16px; color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;">${trans.report.timeline}</th>
                <th style="padding: 0 16px 8px 16px; color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;">${trans.report.priority}</th>
                <th style="padding: 0 16px 8px 16px; color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;">${trans.report.effort}</th>
                <th style="padding: 0 16px 8px 16px; color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;">${trans.report.integrity}</th>
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
          <h4 style="margin: 0 0 8px 0; font-size: 12px; color: #845EF7; text-transform: uppercase; letter-spacing: 0.1em;">${trans.report.summaryTitle}</h4>
          <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.6;">
            ${trans.report.summaryDesc.replace('{count}', tasks.length.toString()).replace('{progress}', progress.toString())}
          </p>
        </div>
      </div>
    `;
    setHtmlPreview(preview);
    
    toast({
      title: language === 'fr' ? "Rapport Généré" : "Report Generated",
      description: language === 'fr' ? "Le bilan architectural est prêt." : "Architectural review is ready.",
    });
  };

  const handleExport = () => {
    if (!htmlPreview) return;
    const blob = new Blob([htmlPreview], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${language}-${new Date().getTime()}.html`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <main className="pl-20 p-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-headline font-bold tracking-tight">{trans.nav.xmlTools}</h1>
              <p className="text-muted-foreground mt-2">Generate professional documents in {language.toUpperCase()}</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
              <Select value={exportFormat} onValueChange={(v: any) => setExportFormat(v)}>
                <SelectTrigger className="w-[100px] bg-black/40 border-white/5 text-[10px] font-bold uppercase tracking-widest h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleGenerate} className="bg-primary hover:bg-primary/80 rounded-xl px-8 h-10 text-[10px] uppercase font-bold tracking-widest">
                <FileText size={16} className="mr-2" /> Generate
              </Button>
            </div>
          </header>

          <div className="glass p-8 rounded-[2.5rem] min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-semibold text-xl">Preview</h3>
              {htmlPreview && (
                <Button variant="outline" onClick={handleExport} className="rounded-xl h-10 px-6 text-xs font-bold uppercase tracking-widest">
                  <Download size={14} className="mr-2" /> Download
                </Button>
              )}
            </div>
            
            <div className="flex-1 bg-black/40 rounded-[2rem] border border-white/5 overflow-auto">
              {htmlPreview ? (
                <div dangerouslySetInnerHTML={{ __html: htmlPreview }} />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground flex-col gap-4">
                  <FileText size={32} className="opacity-10" />
                  <p className="text-sm">Click generate to see the architecture review</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
