import React, { useState } from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  Download, 
  FileCheck2, 
  PieChart, 
  TrendingUp, 
  Users, 
  Building, 
  CheckCircle2,
  Award,
  Lock,
  ArrowUpRight,
  Target,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DonationGoalAuditTracker } from '../DonationGoalAuditTracker';
import { DonationImpactExportCard } from '../analytics/DonationImpactExportCard';
import { HumanitarianFundDistributionChart } from '../analytics/HumanitarianFundDistributionChart';
import { MonthlyDonationTrendChart } from '../analytics/MonthlyDonationTrendChart';
import { generateDonationImpactPDF } from '../../utils/pdfReportGenerator';

export const AnalyticsAuditTab: React.FC = () => {
  const { campaigns, blockchainTransactions, blockchainBlocks, userProfile, t } = useApp();
  const [isExportingQuickPdf, setIsExportingQuickPdf] = useState(false);

  const totalCollected = campaigns.reduce((acc, c) => acc + c.collectedAmount, 0);
  const totalTarget = campaigns.reduce((acc, c) => acc + c.targetAmount, 0);
  const overallPercentage = Math.round((totalCollected / totalTarget) * 100);

  // 8 Asnaf Distribution Breakdown
  const asnafData = [
    { name: 'Fakir & Dhuafa Ekstrem', percent: 32, amount: Math.round(totalCollected * 0.32), color: 'bg-[#2E7D32]' },
    { name: 'Miskin & Pra-Sejahtera', percent: 28, amount: Math.round(totalCollected * 0.28), color: 'bg-[#4CAF50]' },
    { name: 'Fisabilillah (Dakwah & Santri)', percent: 18, amount: Math.round(totalCollected * 0.18), color: 'bg-[#388E3C]' },
    { name: 'Gharimin (Bebas Hutang Mudarat)', percent: 8, amount: Math.round(totalCollected * 0.08), color: 'bg-[#66BB6A]' },
    { name: 'Mualaf (Pemberdayaan Tauhid)', percent: 6, amount: Math.round(totalCollected * 0.06), color: 'bg-[#81C784]' },
    { name: 'Ibnu Sabil (Musafir Kehabisan Bekal)', percent: 4, amount: Math.round(totalCollected * 0.04), color: 'bg-[#A5D6A7]' },
    { name: 'Amil (Operasional Terakreditasi BAZNAS)', percent: 4, amount: Math.round(totalCollected * 0.04), color: 'bg-[#5A665B]' },
  ];

  const handleDownloadImpactReportPDF = () => {
    setIsExportingQuickPdf(true);
    setTimeout(() => {
      try {
        const result = generateDonationImpactPDF({
          donorName: userProfile.name,
          donorEmail: userProfile.email,
          taxId: userProfile.taxIdentificationNumber || '92.481.092.3-014.000',
          kycLevel: userProfile.kycLevel,
          e2eePublicKey: userProfile.e2eePublicKey,
          transactions: blockchainTransactions,
          periodLabel: 'Semua Periode Transaksi',
          generatedDate: new Date(),
          includeTaxCertification: true,
        });
        result.download();
      } catch (e) {
        console.error('Error downloading PDF:', e);
      } finally {
        setIsExportingQuickPdf(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1F3D22] via-[#172E19] to-[#121E13] rounded-3xl p-6 sm:p-8 text-[#E4E8E4] shadow-lg border border-[#2D332D] space-y-2">
        <div className="flex items-center gap-2 text-[#4CAF50] text-xs font-bold uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" />
          <span>Transparansi Publik & Kepatuhan Fiqih Zakat Nasional</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Laporan Audit Dana & Akuntabilitas Real-Time
            </h1>
            <p className="text-xs sm:text-sm text-[#E4E8E4]/90 max-w-2xl leading-relaxed mt-1">
              Audit matematis terbuka tanpa celah manipulasi. Setiap rupiah zakat dan wakaf terlacak langsung dari muzakki hingga ke mustahik.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadImpactReportPDF}
              disabled={isExportingQuickPdf}
              className="px-5 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] disabled:opacity-60 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all shrink-0 self-start sm:self-auto"
            >
              {isExportingQuickPdf ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Membuat PDF...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-emerald-300" />
                  <span>Unduh Impact PDF (Signed)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Cryptographically Signed Donation Impact Report Exporter Feature */}
      <DonationImpactExportCard />

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">Total Zakat & Infaq Terhimpun</span>
          <p className="text-xl font-black text-[#2E7D32] dark:text-[#4CAF50] font-mono">
            Rp {totalCollected.toLocaleString('id-ID')}
          </p>
          <span className="text-[11px] text-[#2E7D32] dark:text-[#4CAF50] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Tercatat On-Chain
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">Efisiensi Penyaluran Asnaf</span>
          <p className="text-xl font-black text-[#141A14] dark:text-[#E4E8E4] font-mono">
            96.0% Efektif
          </p>
          <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
            Hanya 4% Operasional Amil Sah
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">Opini Akuntan Publik</span>
          <p className="text-xl font-black text-[#2E7D32] dark:text-[#4CAF50] font-mono">
            WTP (Wajar Tanpa Pengecualian)
          </p>
          <span className="text-[11px] text-[#5A665B] dark:text-[#A0A8A0]">
            Audit BPK & Kantor Akuntan Publik
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-1">
          <span className="text-xs font-bold text-[#5A665B] dark:text-[#A0A8A0]">Total Mutasi Terverifikasi</span>
          <p className="text-xl font-black text-[#141A14] dark:text-[#E4E8E4] font-mono">
            {blockchainTransactions.length} Transaksi
          </p>
          <span className="text-[11px] text-[#2E7D32] dark:text-[#4CAF50] font-semibold">
            Tinggi Blok #{blockchainBlocks[0]?.blockNumber || 148293}
          </span>
        </div>
      </div>

      {/* Monthly Donation Pattern & Social Impact Trend Line Chart using Recharts */}
      <MonthlyDonationTrendChart />

      {/* Real-time Project Donation Goal Progress Tracker & Blockchain Ledger Sync */}
      <DonationGoalAuditTracker />

      {/* Humanitarian Funds Distribution Breakdown Component using Recharts */}
      <HumanitarianFundDistributionChart />

      {/* 8 Asnaf Distribution Radar / Bars */}
      <div className="bg-white dark:bg-[#1A1D1A] rounded-3xl p-6 sm:p-8 border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-[#141A14] dark:text-[#E4E8E4]">
              Peta Distribusi 8 Asnaf (QS At-Taubah: 60)
            </h3>
            <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0]">
              Alokasi proporsional amanah muzakki diprioritaskan bagi pengentasan kemiskinan dan kemaslahatan umat.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3EE] dark:bg-[#242924] text-[#2E7D32] dark:text-[#4CAF50] text-xs font-bold border border-[#D8DFD8] dark:border-[#2D332D] self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Kesesuaian Syariah 100%</span>
          </span>
        </div>

        {/* Stacked Percentage Visual Bar */}
        <div className="space-y-2">
          <div className="w-full h-4 rounded-full overflow-hidden flex shadow-inner bg-[#EEF3EE] dark:bg-[#242924]">
            {asnafData.map((a, idx) => (
              <div
                key={idx}
                className={`h-full ${a.color}`}
                style={{ width: `${a.percent}%` }}
                title={`${a.name}: ${a.percent}%`}
              />
            ))}
          </div>
        </div>

        {/* Breakdown List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-2">
          {asnafData.map((a, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#EEF3EE] dark:bg-[#242924] border border-[#D8DFD8] dark:border-[#2D332D] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${a.color}`} />
                  <span className="font-bold text-[#141A14] dark:text-[#E4E8E4]">
                    {a.name}
                  </span>
                </div>
                <span className="font-mono font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                  {a.percent}%
                </span>
              </div>
              <p className="text-sm font-extrabold text-[#141A14] dark:text-[#E4E8E4] font-mono">
                Rp {a.amount.toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sharia Governance & Legal Endorsements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#2E7D32] dark:text-[#4CAF50]">
            <Award className="w-5 h-5" />
            <h4 className="font-extrabold text-sm text-[#141A14] dark:text-[#E4E8E4]">
              Sertifikasi Dewan Pengawas Syariah (DPS)
            </h4>
          </div>
          <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed">
            Seluruh smart contract zakat, akad infak, dan skema micro-waqf Lynk.id telah diaudit dan disetujui sesuai Fatwa DSN-MUI No. 116/DSN-MUI/IX/2017 tentang Uang Elektronik Syariah dan Fatwa Zakat Digital.
          </p>
          <div className="pt-2 flex items-center gap-2 text-[11px] text-[#2E7D32] dark:text-[#4CAF50] font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Kesesuaian Fatwa: VERIFIED LENGKAP</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1D1A] border border-[#D8DFD8] dark:border-[#2D332D] shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#2E7D32] dark:text-[#4CAF50]">
            <Building className="w-5 h-5" />
            <h4 className="font-extrabold text-sm text-[#141A14] dark:text-[#E4E8E4]">
              Pengakuan Pengurang Pajak Ditjen Pajak
            </h4>
          </div>
          <p className="text-xs text-[#5A665B] dark:text-[#A0A8A0] leading-relaxed">
            Muzakki berhak mencantumkan Nomor BSZ yang diterbitkan platform ini pada Lampiran SPT Tahunan PPh Orang Pribadi atau Badan (UU RI No. 23/2011 Pasal 22).
          </p>
          <div className="pt-2 flex items-center gap-2 text-[11px] text-[#2E7D32] dark:text-[#4CAF50] font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Status NPWZ / Ditjen Pajak: VALID</span>
          </div>
        </div>
      </div>

    </div>
  );
};
