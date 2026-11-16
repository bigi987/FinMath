import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Currency } from '../types';

export function exportSavingsPDF(params: {
  currency: Currency;
  initialDeposit: number;
  monthlyContribution: number;
  annualRate: number;
  periodYears: number;
  compoundingFrequency: string;
  totalBalance: number;
  principalInvested: number;
  interestEarned: number;
  rows: {
    year: number;
    principal: number;
    interest: number;
    totalBalance: number;
  }[];
}) {
  const doc = new jsPDF();

  // Primary colors
  const primaryBlue = [2, 103, 210]; // #0267D2
  const textDark = [15, 23, 42];

  // Header Title
  doc.setFontSize(22);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('FinMath', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Interactive Financial Simulator Report · Compound Savings', 14, 26);

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Generated on: ${dateStr}`, 140, 26);

  // Horizontal divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 30, 196, 30);

  // Key Metrics Grid
  doc.setFontSize(12);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('Summary Results', 14, 40);

  const summaryData = [
    ['Total Projected Balance', `${params.totalBalance.toLocaleString()} ${params.currency}`],
    ['Principal Invested', `${params.principalInvested.toLocaleString()} ${params.currency}`],
    ['Interest Earned', `${params.interestEarned.toLocaleString()} ${params.currency}`],
    ['Initial Deposit', `${params.initialDeposit.toLocaleString()} ${params.currency}`],
    ['Monthly Contribution', `${params.monthlyContribution.toLocaleString()} ${params.currency}`],
    ['Annual Interest Rate', `${params.annualRate}%`],
    ['Investment Horizon', `${params.periodYears} Years`],
    ['Compounding Frequency', params.compoundingFrequency],
  ];

  autoTable(doc, {
    startY: 44,
    head: [['Parameter / Metric', 'Value']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [2, 103, 210], textColor: 255 },
    styles: { fontSize: 9, cellPadding: 2.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 100 },
      1: { halign: 'right', cellWidth: 80 },
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 110;

  // Breakdown Table
  doc.setFontSize(12);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('Year-by-Year Growth Projection', 14, finalY + 12);

  const tableRows = params.rows.map((r) => [
    r.year === 0 ? 'Today' : `Year ${r.year}`,
    `${r.principal.toLocaleString()} ${params.currency}`,
    `${r.interest.toLocaleString()} ${params.currency}`,
    `${r.totalBalance.toLocaleString()} ${params.currency}`,
  ]);

  autoTable(doc, {
    startY: finalY + 16,
    head: [['Timeline', 'Principal Invested', 'Interest Earned', 'Total Balance']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: 255 },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  });

  // Footer Disclaimer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'FinMath · Educational financial simulation · Not formal financial advice',
      14,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 25,
      doc.internal.pageSize.height - 10
    );
  }

  doc.save(`FinMath_Compound_Savings_${params.periodYears}Y.pdf`);
}

export function exportLoanPDF(params: {
  currency: Currency;
  loanAmount: number;
  annualRate: number;
  durationYears: number;
  paymentFrequency: string;
  periodicPayment: number;
  totalPayment: number;
  totalInterest: number;
  rows: {
    paymentNumber: number;
    periodLabel: string;
    paymentAmount: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }[];
}) {
  const doc = new jsPDF();
  const primaryBlue = [2, 103, 210];

  doc.setFontSize(22);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('FinMath', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Loan & Annuity Amortization Schedule', 14, 26);

  const summaryData = [
    ['Loan Principal Amount', `${params.loanAmount.toLocaleString()} ${params.currency}`],
    ['Periodic Payment', `${params.periodicPayment.toLocaleString()} ${params.currency}`],
    ['Total Interest Cost', `${params.totalInterest.toLocaleString()} ${params.currency}`],
    ['Total Lifetime Payment', `${params.totalPayment.toLocaleString()} ${params.currency}`],
    ['Annual Interest Rate', `${params.annualRate}%`],
    ['Duration', `${params.durationYears} Years`],
    ['Payment Frequency', params.paymentFrequency],
  ];

  autoTable(doc, {
    startY: 34,
    head: [['Loan Metric', 'Value']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [2, 103, 210], textColor: 255 },
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 100 },
      1: { halign: 'right', cellWidth: 80 },
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 85;

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Payment Amortization Schedule', 14, finalY + 10);

  // Take first 60 payments or all if less to keep PDF compact
  const displayRows = params.rows.slice(0, 72).map((r) => [
    r.periodLabel,
    `${r.paymentAmount.toLocaleString()} ${params.currency}`,
    `${r.principalPaid.toLocaleString()} ${params.currency}`,
    `${r.interestPaid.toLocaleString()} ${params.currency}`,
    `${r.remainingBalance.toLocaleString()} ${params.currency}`,
  ]);

  autoTable(doc, {
    startY: finalY + 14,
    head: [['Period', 'Payment', 'Principal Paid', 'Interest Paid', 'Remaining Balance']],
    body: displayRows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: 255 },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  });

  doc.save(`FinMath_Loan_Amortization_${params.durationYears}Y.pdf`);
}
