"use client"

import { useState, useEffect } from 'react';
import { FileText, Search } from 'lucide-react';
import Header from '@/components/Header';
import TemplateCard from '@/components/TemplateCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Template } from '@/lib/types';

// Static templates data for demonstration
const TEMPLATES: Template[] = [
  {
    id: "template-1",
    title: "Certificate of Incorporation",
    description: "Standard Delaware C-Corp formation document template",
    category: "legal",
    fileType: "docx",
    content: "CERTIFICATE OF INCORPORATION\nOF\n[COMPANY NAME], INC.\n\nThe undersigned, in order to form a corporation for the purposes hereinafter stated, under and pursuant to the provisions of the General Corporation Law of the State of Delaware, does hereby certify:\n\nFIRST: The name of the corporation is [COMPANY NAME], Inc.\n\nSECOND: The address of the registered office of the corporation in the State of Delaware is [ADDRESS], and the name of its registered agent at such address is [AGENT NAME].\n\nTHIRD: The purpose of the corporation is to engage in any lawful act or activity for which corporations may be organized under the General Corporation Law of Delaware.\n\nFOURTH: The total number of shares of stock which the corporation shall have authority to issue is [NUMBER] shares of Common Stock, each with a par value of $0.0001 per share.\n\nFIFTH: The name and mailing address of the incorporator is:\n[INCORPORATOR NAME]\n[INCORPORATOR ADDRESS]\n\nSIXTH: The corporation is to have perpetual existence.\n\nIN WITNESS WHEREOF, the undersigned has executed this Certificate of Incorporation this [DAY] day of [MONTH], [YEAR].\n\n_______________________\n[INCORPORATOR NAME]\nIncorporator"
  },
  {
    id: "template-2",
    title: "Founders' Agreement",
    description: "Comprehensive founders agreement with equity split and vesting",
    category: "legal",
    fileType: "docx",
    content: "FOUNDERS' AGREEMENT\n\nThis Founders' Agreement (\"Agreement\") is entered into as of [DATE] by and between the undersigned founders (\"Founders\") of [COMPANY NAME], Inc. (the \"Company\").\n\n1. EQUITY ALLOCATION\nThe Founders agree to the following initial equity split:\n- [FOUNDER 1 NAME]: [PERCENTAGE]%\n- [FOUNDER 2 NAME]: [PERCENTAGE]%\n\n2. VESTING SCHEDULE\nAll founder shares shall vest over a four (4) year period with a one (1) year cliff. If a Founder's relationship with the Company terminates before the cliff date, all unvested shares shall be forfeited.\n\n3. ROLES AND RESPONSIBILITIES\n[FOUNDER 1 NAME] shall serve as [TITLE] and be responsible for [RESPONSIBILITIES]\n[FOUNDER 2 NAME] shall serve as [TITLE] and be responsible for [RESPONSIBILITIES]\n\n4. DECISION MAKING\nMajor decisions requiring unanimous consent include:\n- Raising investment or taking on debt\n- Selling the company or substantial assets\n- Hiring/firing C-level executives\n- Changing the company's core business model\n\n5. INTELLECTUAL PROPERTY\nAll Founders assign all intellectual property created in connection with the Company to the Company.\n\n6. NON-COMPETE\nDuring their involvement with the Company and for [TIME PERIOD] thereafter, Founders agree not to compete directly with the Company.\n\n7. DISPUTE RESOLUTION\nAny disputes shall be resolved through mediation, and if necessary, binding arbitration.\n\nIN WITNESS WHEREOF, the Founders have executed this Agreement as of the date first written above.\n\n_______________________  _______________________\n[FOUNDER 1 NAME]        [FOUNDER 2 NAME]"
  },
  {
    id: "template-3",
    title: "SAFE Agreement (Simple Agreement for Future Equity)",
    description: "Standard Y Combinator SAFE template for early-stage fundraising",
    category: "fundraising",
    fileType: "docx",
    content: "SAFE (Simple Agreement for Future Equity)\n\nTHIS CERTIFIES THAT in exchange for the payment by [INVESTOR NAME] (the \"Investor\") of $[AMOUNT] (the \"Purchase Amount\") on or about [DATE], [COMPANY NAME], Inc., a Delaware corporation (the \"Company\"), issues to the Investor the right to certain shares of the Company's Capital Stock, subject to the terms described below.\n\nValuation Cap: $[AMOUNT]\nDiscount Rate: [PERCENTAGE]%\n\n1. Events\n\n(a) Equity Financing. If there is an Equity Financing before the termination of this Safe, on the initial closing of such Equity Financing, this Safe will automatically convert into the number of shares of Safe Preferred Stock equal to the Purchase Amount divided by the Conversion Price.\n\n(b) Liquidity Event. If there is a Liquidity Event before the termination of this Safe, this Safe will automatically be entitled to receive a portion of Proceeds equal to the Purchase Amount.\n\n2. Company Representations\n\n(a) The Company is a corporation duly organized, validly existing and in good standing under the laws of the State of Delaware.\n\n(b) The execution, delivery and performance by the Company of this Safe is within the power of the Company and has been duly authorized.\n\nIN WITNESS WHEREOF, the undersigned have caused this Safe to be duly executed and delivered.\n\n[COMPANY NAME], INC.\n\nBy: _______________________\nName: [FOUNDER NAME]\nTitle: CEO"
  },
  {
    id: "template-4",
    title: "Employee Offer Letter",
    description: "Standard employment offer letter template",
    category: "hr",
    fileType: "docx",
    content: "EMPLOYMENT OFFER LETTER\n\n[DATE]\n\nDear [CANDIDATE NAME],\n\nWe are pleased to offer you the position of [TITLE] at [COMPANY NAME], Inc. (the \"Company\"). We believe your skills and experience will be a valuable addition to our team.\n\nPosition: [TITLE]\nStart Date: [DATE]\nSalary: $[AMOUNT] per year, paid [FREQUENCY]\nEquity: [NUMBER] stock options, subject to vesting schedule\nBenefits: [BENEFITS DESCRIPTION]\n\nReporting: You will report directly to [MANAGER NAME], [MANAGER TITLE].\n\nThis offer is contingent upon:\n- Successful completion of a background check\n- Proof of your eligibility to work in the United States\n- Signing the Company's standard Confidential Information and Invention Assignment Agreement\n\nYour employment with the Company will be \"at-will,\" meaning that either you or the Company may terminate the employment relationship at any time, with or without cause or notice.\n\nTo accept this offer, please sign and return this letter by [DATE].\n\nWe look forward to welcoming you to the team!\n\nSincerely,\n\n_______________________\n[FOUNDER NAME]\n[TITLE]"
  },
  {
    id: "template-5",
    title: "NDA (Non-Disclosure Agreement)",
    description: "Mutual non-disclosure agreement for business discussions",
    category: "legal",
    fileType: "docx",
    content: "MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis Mutual Non-Disclosure Agreement (\"Agreement\") is entered into as of [DATE] by and between [COMPANY NAME], Inc. (\"Company\") and [OTHER PARTY NAME] (\"Recipient\").\n\n1. DEFINITION OF CONFIDENTIAL INFORMATION\n\"Confidential Information\" means any information disclosed by one party to the other party, either directly or indirectly, in writing, orally or by inspection of tangible objects.\n\n2. NON-USE AND NON-DISCLOSURE\nRecipient agrees:\n(a) Not to use Confidential Information for any purpose except to evaluate and engage in discussions concerning a potential business relationship between the parties.\n(b) Not to disclose Confidential Information to third parties without the prior written consent of the disclosing party.\n\n3. EXCEPTIONS\nConfidential Information shall not include information that:\n(a) Is or becomes publicly available without breach of this Agreement\n(b) Was rightfully in Recipient's possession prior to disclosure\n(c) Is independently developed by Recipient without use of Confidential Information\n\n4. TERM\nThis Agreement shall remain in effect for [TIME PERIOD] from the date of disclosure.\n\nIN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.\n\n[COMPANY NAME], INC.          [OTHER PARTY NAME]\n\nBy: _______________________   By: _______________________"
  }
];

export default function TemplatesPage() {
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(TEMPLATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Update filters when search or category changes
  useEffect(() => {
    let filtered = [...TEMPLATES];

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTemplates(filtered);
  }, [searchQuery, categoryFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex justify-center md:justify-start">
            <FileText className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Template Library</h1>
          <p className="text-gray-600">
            Download ready-to-use legal and business document templates
          </p>
        </div>

        {/* Search & Filter */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="fundraising">Fundraising</SelectItem>
                  <SelectItem value="hr">HR & Employment</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notice */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              <strong>📄 Note:</strong> These are sample templates for demonstration purposes. 
              Always have legal documents reviewed by qualified professionals before use. Templates 
              are downloaded as text files for this prototype.
            </p>
          </CardContent>
        </Card>

        {/* Template Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600">
                No templates match your search. Try adjusting your filters.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}