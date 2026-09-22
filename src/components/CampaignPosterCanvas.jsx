import React, { useRef, useEffect, useState } from 'react';
import { Download, Check, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function CampaignPosterCanvas({ onDownloaded }) {
  const canvasRef = useRef(null);
  const [downloaded, setDownloaded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const generatePoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 1200;
    canvas.width = width;
    canvas.height = height;

    // 1. Background Gradient (Dark Navy / Slate)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#020617'); // slate-950
    bgGrad.addColorStop(0.5, '#0f172a'); // slate-900
    bgGrad.addColorStop(1, '#1e1b4b'); // indigo-950
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative background glow circles
    ctx.fillStyle = 'rgba(244, 63, 94, 0.08)'; // rose glow
    ctx.beginPath();
    ctx.arc(200, 200, 300, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(14, 165, 233, 0.08)'; // sky glow
    ctx.beginPath();
    ctx.arc(1000, 1000, 350, 0, Math.PI * 2);
    ctx.fill();

    // 2. Outer Border & Frame
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.strokeRect(45, 45, width - 90, height - 90);

    // 3. Top Banner: URGENT STUDENT PETITION
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(60, 65, width - 120, 80);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🚨 URGENT WBJEE-2026 CANDIDATES PETITION', width / 2, 120);

    // 4. Main Headline
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px system-ui, -apple-system, sans-serif';
    ctx.fillText('SCRAP ONLINE DCAP AFTER PHASE 2', width / 2, 215);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '800 36px system-ui, -apple-system, sans-serif';
    ctx.fillText('CONDUCT UNIVERSAL OFFLINE SPOT COUNSELLING', width / 2, 265);

    // Divider Line
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 300);
    ctx.lineTo(width - 100, 300);
    ctx.stroke();

    // 5. Why Online DCAP is Failing (Left Column Box)
    const boxY = 330;
    const boxHeight = 440;
    const colWidth = 500;

    // Red Warning Box - Left (The Flaws)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(75, boxY, colWidth, boxHeight);
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 3;
    ctx.strokeRect(75, boxY, colWidth, boxHeight);

    ctx.fillStyle = '#f43f5e';
    ctx.font = '800 26px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('⚠️ WHY ONLINE DC IS FAILING:', 100, boxY + 50);

    const flaws = [
      '1. Multiple Allocation Bottleneck:',
      '   Unordered choices give top rankers multiple',
      '   seats simultaneously with negligible admissions.',
      '',
      '2. No Real-Time Sliding:',
      '   Discrete batch reallocations keep seats locked',
      '   for days instead of instant sliding.',
      '',
      '3. Phase 3 Lockout Merit Violation:',
      '   Phase 1 admitted students barred from Phase 3,',
      '   handing prime JU/CU seats to lower ranks later!'
    ];

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 20px system-ui, -apple-system, sans-serif';
    let lineY = boxY + 95;
    flaws.forEach(line => {
      if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 21px system-ui, -apple-system, sans-serif';
      } else {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '500 19px system-ui, -apple-system, sans-serif';
      }
      ctx.fillText(line, 100, lineY);
      lineY += 28;
    });

    // Green Demand Box - Right (The Solutions)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(625, boxY, colWidth, boxHeight);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(625, boxY, colWidth, boxHeight);

    ctx.fillStyle = '#34d399';
    ctx.font = '800 26px system-ui, -apple-system, sans-serif';
    ctx.fillText('✅ OUR PRIMARY DEMANDS:', 650, boxY + 50);

    const demands = [
      '1. Terminate Online DCAP after Phase 2',
      '   Stop protracted, stagnant online batch rounds.',
      '',
      '2. Universal OFFLINE Spot Counselling',
      '   Conduct on-campus physical rounds for ALL',
      '   valid WBJEE 2026 rankers without exclusion.',
      '',
      '3. Continuous Real-Time Seat Sliding',
      '   Forfeited seats slide instantly to next rank',
      '   on the spot at JU, CU, KGEC, JGEC campuses.',
      '',
      '4. 100% Transparent Seat Occupancy',
      '   Fill every vacant seat based strictly on merit.'
    ];

    lineY = boxY + 95;
    demands.forEach(line => {
      if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.')) {
        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'bold 21px system-ui, -apple-system, sans-serif';
      } else {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '500 19px system-ui, -apple-system, sans-serif';
      }
      ctx.fillText(line, 650, lineY);
      lineY += 27;
    });

    // 6. Institute Badges Box
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.fillRect(75, 800, width - 150, 100);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.strokeRect(75, 800, width - 150, 100);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏛️ CRITICAL SEATS AT RISK ACROSS TOP BENGAL INSTITUTES', width / 2, 838);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 20px system-ui, -apple-system, sans-serif';
    ctx.fillText('Jadavpur University (JU) • Calcutta University (CU) • KGEC • JGEC • Govt Colleges', width / 2, 874);

    // 7. Campaign Hashtags & Call to Action Box
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(75, 925, width - 150, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 28px system-ui, -apple-system, sans-serif';
    ctx.fillText('SAVE OUR ACADEMIC YEAR • UPHOLD STUDENT MERIT', width / 2, 970);

    ctx.font = '800 22px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('#WBJEEOfflineDC   #ScrapOnlineDC   #JusticeForWBJEEStudents', width / 2, 1010);

    // 8. Footer Attribution
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 18px system-ui, -apple-system, sans-serif';
    ctx.fillText('Issued by Aggrieved WBJEE 2026 Candidates | Verified Digital Advocacy Hub at playnodice.com', width / 2, 1080);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 15px system-ui, -apple-system, sans-serif';
    ctx.fillText('Attach this official infographic to your X reply for maximum impact.', width / 2, 1115);

    try {
      const dataUrl = canvas.toDataURL('image/png');
      setPreviewUrl(dataUrl);
    } catch (e) {
      console.error('Failed to generate preview data URL', e);
    }
  };

  useEffect(() => {
    generatePoster();
  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const link = document.createElement('a');
      link.download = 'WBJEE_2026_Offline_DC_Petition_Poster.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
      if (onDownloaded) onDownloaded();
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-4 h-4 text-rose-400" />
          <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Official Campaign Infographic Poster
          </h4>
        </div>
        <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold border border-rose-500/30">
          HD 1200x1200px
        </span>
      </div>

      {/* Hidden full-res generation canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Visual Image Preview */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 mb-4 max-h-[260px] flex items-center justify-center">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="WBJEE 2026 Offline DC Petition Poster"
            className="w-full h-auto object-contain max-h-[260px]"
          />
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs">
            Rendering high-resolution campaign poster...
          </div>
        )}
      </div>

      {/* Download Action */}
      <button
        onClick={handleDownload}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
      >
        {downloaded ? (
          <>
            <Check className="w-4 h-4 text-white" />
            <span>Poster Saved to Device!</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Download Poster to Attach in Reply (PNG)</span>
          </>
        )}
      </button>
      <p className="text-[10px] text-slate-400 text-center mt-2">
        💡 Tip: Attach this downloaded image when replying on X to maximize visibility and bypass text-only spam filters.
      </p>
    </div>
  );
}
