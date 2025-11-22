import React, { useState } from "react";
import { FiChevronLeft, FiAward, FiBook, FiMapPin, FiActivity } from "react-icons/fi";

const judgesData = [
    {
      "judge_id": "J1",
      "name": "Justice Meera Khanna",
      "region": "Rajasthan",
      "education": {
        "LLB": "National Law University, Jodhpur",
        "LLM": "London School of Economics",
        "judicial_training": "Judicial Academy of Rajasthan"
      },
      "summary": "Justice Meera Khanna is a highly educated judge with advanced training in evidence analysis and tort law. She studied at NLU Jodhpur and later completed her LLM from the London School of Economics. With over 18 years of judicial experience, she is known for her strict courtroom discipline. She handles accident and property cases with deep analytical scrutiny. Lawyers view her as a judge who prioritizes documentation and factual consistency above all else.",
      "personality_profile": {
        "decision_style": "Analytical",
        "courtroom_behavior": "Strict",
        "tolerance_for_delays": "Low"
      },
      "strengths": ["Detailed evidence evaluation", "Strong knowledge of tort law"],
      "weaknesses": ["Slow in property dispute judgments"],
      "case_type_experience": {
        "Accident": {"percentage": 35, "avg_duration_months": 12},
        "Property": {"percentage": 25, "avg_duration_months": 18},
        "Criminal": {"percentage": 40, "avg_duration_months": 10}
      },
      "reference_cases": [
        { "case_id": "C1", "case_type": "Accident", "lawyers_involved": ["L1", "L3"], "outcome": "Plaintiff Won" },
        { "case_id": "C2", "case_type": "Property", "lawyers_involved": ["L5"], "outcome": "Defendant Won" }
      ]
    },
    {
      "judge_id": "J2",
      "name": "Justice Raghav Patel",
      "region": "Gujarat",
      "education": {
        "LLB": "Gujarat National Law University",
        "LLM": "Cambridge University",
        "judicial_training": "Gujarat Judicial Academy"
      },
      "summary": "Justice Raghav Patel combines international academic exposure with practical mediation skills. His LLM from Cambridge strengthened his understanding of comparative family law. He has 16+ years of experience handling divorce, property, and civil matters. Known for encouraging settlements, he often pushes for amicable resolutions to save time and emotional strain. His judgments are regarded as balanced and sensitive to social realities.",
      "personality_profile": {
        "decision_style": "Conciliatory",
        "courtroom_behavior": "Calm",
        "tolerance_for_delays": "Medium"
      },
      "strengths": ["Encourages settlements", "Fair decision-making"],
      "weaknesses": ["Leniency sometimes prolongs mediation"],
      "case_type_experience": {
        "Divorce": {"percentage": 40, "avg_duration_months": 3},
        "Accident": {"percentage": 20, "avg_duration_months": 8},
        "Property": {"percentage": 40, "avg_duration_months": 16}
      },
      "reference_cases": [
        { "case_id": "C3", "case_type": "Divorce", "lawyers_involved": ["L4", "L7"], "outcome": "Mutual Settlement" }
      ]
    },
    {
      "judge_id": "J3",
      "name": "Justice Alok Suri",
      "region": "Delhi",
      "education": {
        "LLB": "Faculty of Law, DU",
        "LLM": "Harvard Law School",
        "judicial_training": "Delhi Judicial Academy"
      },
      "summary": "Justice Alok Suri is one of Delhi’s most academically accomplished judges with a Harvard LLM. He specializes in corporate and financial fraud litigation. With 20 years of experience, he is known for strictly enforcing procedural discipline. He expects lawyers to present well-structured arguments backed by legal precedent. His judgments are highly detailed and often cited in corporate case rulings.",
      "personality_profile": {
        "decision_style": "Strict Interpretation",
        "courtroom_behavior": "Highly Formal",
        "tolerance_for_delays": "Low"
      },
      "strengths": ["Financial fraud evaluation", "Corporate compliance"],
      "weaknesses": ["Excessive reliance on procedural rules"],
      "case_type_experience": {
        "Corporate": {"percentage": 60, "avg_duration_months": 14},
        "Criminal": {"percentage": 20, "avg_duration_months": 10},
        "Property": {"percentage": 20, "avg_duration_months": 12}
      },
      "reference_cases": [
        { "case_id": "C4", "case_type": "Corporate", "lawyers_involved": ["L9"], "outcome": "Defendant Won" }
      ]
    },
    {
      "judge_id": "J4",
      "name": "Justice Kavita Rao",
      "region": "Maharashtra",
      "education": {
        "LLB": "Mumbai University",
        "LLM": "NALSAR Hyderabad",
        "judicial_training": "Maharashtra Judicial Academy"
      },
      "summary": "Justice Kavita Rao is known across Maharashtra for her excellence in criminal jurisprudence. Her academic foundation from NALSAR and Mumbai University shapes her evidence-heavy approach. She has served in multiple criminal courts over 17 years, gaining deep forensic understanding. Her judgments are typically concise and fact-driven. Lawyers admire her for maintaining firm yet fair courtroom control.",
      "personality_profile": {
        "decision_style": "Evidence-Oriented",
        "courtroom_behavior": "Firm",
        "tolerance_for_delays": "Medium"
      },
      "strengths": ["Forensic understanding", "Consistent judgments"],
      "weaknesses": ["Sometimes overly skeptical of emotional testimony"],
      "case_type_experience": {
        "Criminal": {"percentage": 50, "avg_duration_months": 8},
        "Divorce": {"percentage": 30, "avg_duration_months": 4},
        "Accident": {"percentage": 20, "avg_duration_months": 10}
      },
      "reference_cases": [
        { "case_id": "C5", "case_type": "Criminal", "lawyers_involved": ["L10"], "outcome": "Conviction" }
      ]
    },
    {
      "judge_id": "J5",
      "name": "Justice Mohan Iyer",
      "region": "Kerala",
      "education": {
        "LLB": "Government Law College, Ernakulam",
        "LLM": "University of Melbourne",
        "judicial_training": "Kerala Judicial Academy"
      },
      "summary": "Justice Mohan Iyer has built a reputation as a calm and meticulous civil law expert. His international LLM brought him a comparative perspective on property and civil rights cases. With over 15 years of judicial service, he is known for patiently hearing complex disputes. His decisions emphasize documentary proof and long-term possession history. Lawyers appreciate his unbiased and well-articulated orders.",
      "personality_profile": {
        "decision_style": "Balanced",
        "courtroom_behavior": "Patient",
        "tolerance_for_delays": "High"
      },
      "strengths": ["Deep understanding of civil law", "Encourages detailed submissions"],
      "weaknesses": ["Can be slow due to thorough reading"],
      "case_type_experience": {
        "Property": {"percentage": 50, "avg_duration_months": 20},
        "Accident": {"percentage": 30, "avg_duration_months": 14},
        "Civil": {"percentage": 20, "avg_duration_months": 9}
      },
      "reference_cases": [
        { "case_id": "C6", "case_type": "Property", "lawyers_involved": ["L11"], "outcome": "Plaintiff Won" }
      ]
    },
    {
      "judge_id": "J6",
      "name": "Justice Anita Verma",
      "region": "Punjab",
      "education": {
        "LLB": "Punjab University",
        "LLM": "University of Toronto",
        "judicial_training": "Punjab Judicial Academy"
      },
      "summary": "Justice Anita Verma is well known for her decisive and compensation-oriented rulings in accident cases. Her Canadian LLM broadened her understanding of international personal injury standards. With 14+ years of experience, she handles accident and criminal cases with urgency and empathy. Her courtroom behavior is warm but firm, ensuring discipline without intimidation. She is widely respected for awarding fair compensation based on medical evidence.",
      "personality_profile": {
        "decision_style": "Compensation-Oriented",
        "courtroom_behavior": "Warm but Firm",
        "tolerance_for_delays": "Low"
      },
      "strengths": ["Understanding of medical evidence", "Quick hearings"],
      "weaknesses": ["High payouts often challenged in appeals"],
      "case_type_experience": {
        "Accident": {"percentage": 45, "avg_duration_months": 11},
        "Criminal": {"percentage": 40, "avg_duration_months": 9},
        "Divorce": {"percentage": 15, "avg_duration_months": 5}
      },
      "reference_cases": [
        { "case_id": "C7", "case_type": "Accident", "lawyers_involved": ["L13"], "outcome": "High Compensation" }
      ]
    },
    {
      "judge_id": "J7",
      "name": "Justice Farah Khan",
      "region": "Uttar Pradesh",
      "education": {
        "LLB": "Aligarh Muslim University",
        "LLM": "SOAS University of London",
        "judicial_training": "UP Judicial Academy"
      },
      "summary": "Justice Farah Khan is a procedure-focused judge known for strict adherence to criminal trial norms. Her academic foundation from AMU and SOAS gives her a strong socio-legal perspective. With nearly 18 years on the bench, she is recognized for defendant-leaning decisions due to her demand for flawless prosecution evidence. Lawyers respect her for fairness but fear her intolerance toward procedural lapses. Her judgments are widely regarded as benchmarks for proper criminal procedure.",
      "personality_profile": {
        "decision_style": "Procedure-Centric",
        "courtroom_behavior": "Highly Strict",
        "tolerance_for_delays": "Low"
      },
      "strengths": ["Procedural accuracy", "Bias-free decisions"],
      "weaknesses": ["Less flexible in humanitarian considerations"],
      "case_type_experience": {
        "Criminal": {"percentage": 55, "avg_duration_months": 7},
        "Civil": {"percentage": 30, "avg_duration_months": 12},
        "Accident": {"percentage": 15, "avg_duration_months": 9}
      },
      "reference_cases": [
        { "case_id": "C8", "case_type": "Criminal", "lawyers_involved": ["L12"], "outcome": "Acquittal" }
      ]
    },
    {
      "judge_id": "J8",
      "name": "Justice Ritu Sharma",
      "region": "Haryana",
      "education": {
        "LLB": "Kurukshetra University",
        "LLM": "University of Edinburgh",
        "judicial_training": "Haryana Judicial Academy"
      },
      "summary": "Justice Ritu Sharma specializes in family and matrimonial law, drawing from years of mediation-based judicial practice. Her international education deepens her understanding of global family law models. She has spent 13+ years resolving sensitive marital disputes with tact and empathy. Lawyers admire her patient hearing style and humanitarian approach. Her judgments tend to aim for long-term harmony rather than harsh outcomes.",
      "personality_profile": {
        "decision_style": "Harmony-Seeking",
        "courtroom_behavior": "Soft-Spoken",
        "tolerance_for_delays": "Medium"
      },
      "strengths": ["Mediation", "Humanitarian approach"],
      "weaknesses": ["Avoids harsh rulings"],
      "case_type_experience": {
        "Divorce": {"percentage": 50, "avg_duration_months": 3},
        "Property": {"percentage": 20, "avg_duration_months": 13},
        "Accident": {"percentage": 30, "avg_duration_months": 9}
      },
      "reference_cases": [
        { "case_id": "C9", "case_type": "Divorce", "lawyers_involved": ["L14"], "outcome": "Mutual Settlement" }
      ]
    },
    {
      "judge_id": "J9",
      "name": "Justice Arvind Kapoor",
      "region": "Madhya Pradesh",
      "education": {
        "LLB": "University of Indore",
        "LLM": "Stanford University",
        "judicial_training": "MP Judicial Academy"
      },
      "summary": "Justice Arvind Kapoor is a property law expert with a strong academic background from Stanford University. With 19 years of experience, he specializes in complex land ownership and civil documentation cases. He is known for deeply evaluating land records and possession history. Lawyers appreciate his polite yet firm handling of hearings. His judgments are highly detailed, making them frequently cited in property disputes.",
      "personality_profile": {
        "decision_style": "Documentation-Centric",
        "courtroom_behavior": "Firm but Polite",
        "tolerance_for_delays": "Medium"
      },
      "strengths": ["Document verification", "Deep understanding of land laws"],
      "weaknesses": ["Slow in land partition cases"],
      "case_type_experience": {
        "Property": {"percentage": 60, "avg_duration_months": 18},
        "Civil": {"percentage": 20, "avg_duration_months": 11},
        "Criminal": {"percentage": 20, "avg_duration_months": 9}
      },
      "reference_cases": [
        { "case_id": "C10", "case_type": "Property", "lawyers_involved": ["L15"], "outcome": "Plaintiff Won" }
      ]
    },
    {
      "judge_id": "J10",
      "name": "Justice Sameer Shah",
      "region": "Tamil Nadu",
      "education": {
        "LLB": "Dr. Ambedkar Government Law College, Chennai",
        "LLM": "University of Sydney",
        "judicial_training": "TN State Judicial Academy"
      },
      "summary": "Justice Sameer Shah is a balanced and neutral judge with strong expertise in corporate and civil matters. His LLM from Sydney University helped him deepen his understanding of international corporate governance frameworks. With 17+ years of service, he is known for calm and structured courtroom management. He encourages well-organized legal submissions and discourages emotional arguments. His rulings are particularly appreciated for clarity and neutrality.",
      "personality_profile": {
        "decision_style": "Balanced Interpretation",
        "courtroom_behavior": "Professional and Calm",
        "tolerance_for_delays": "High"
      },
      "strengths": ["Corporate governance", "Civil case handling"],
      "weaknesses": ["Occasionally slow due to thorough evaluation"],
      "case_type_experience": {
        "Corporate": {"percentage": 45, "avg_duration_months": 15},
        "Civil": {"percentage": 35, "avg_duration_months": 10},
        "Accident": {"percentage": 20, "avg_duration_months": 8}
      },
      "reference_cases": [
        { "case_id": "C11", "case_type": "Corporate", "lawyers_involved": ["L8"], "outcome": "Defendant Won" }
      ]
    }
];

const JudgeSection = () => {
  const [selectedJudge, setSelectedJudge] = useState(null);

  if (selectedJudge) {
    return (
      <div className="h-full overflow-y-auto p-6 bg-gray-50">
        <button
          onClick={() => setSelectedJudge(null)}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FiChevronLeft className="mr-1" /> Back to Judges
        </button>

        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2">{selectedJudge.name}</h2>
                <div className="flex items-center space-x-4 text-slate-300 text-sm">
                  <span className="flex items-center"><FiMapPin className="mr-1" /> {selectedJudge.region}</span>
                  <span className="px-2 py-0.5 bg-slate-700 rounded text-xs border border-slate-600">{selectedJudge.judge_id}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Decision Style</div>
                <div className="font-semibold text-lg">{selectedJudge.personality_profile.decision_style}</div>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <FiBook className="mr-2 text-blue-600" /> Education & Background
                </h3>
                <div className="bg-blue-50 rounded-xl p-5 text-sm space-y-2 text-gray-700">
                  <p><span className="font-semibold">LLB:</span> {selectedJudge.education.LLB}</p>
                  <p><span className="font-semibold">LLM:</span> {selectedJudge.education.LLM}</p>
                  <p><span className="font-semibold">Training:</span> {selectedJudge.education.judicial_training}</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Judicial Summary</h3>
                <p className="text-gray-600 leading-relaxed text-justify">
                  {selectedJudge.summary}
                </p>
              </section>

              <section>
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                   <FiActivity className="mr-2 text-green-600" /> Experience by Case Type
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(selectedJudge.case_type_experience).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="text-gray-500 text-xs font-medium uppercase mb-1">{key}</div>
                            <div className="text-2xl font-bold text-gray-900">{value.percentage}%</div>
                            <div className="text-xs text-gray-400 mt-1">Avg. {value.avg_duration_months} months</div>
                        </div>
                    ))}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Reference Cases</h3>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outcome</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {selectedJudge.reference_cases.map((rc) => (
                                <tr key={rc.case_id}>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{rc.case_id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{rc.case_type}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className={`px-2 py-1 rounded-full text-xs ${rc.outcome.includes("Won") ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {rc.outcome}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </section>
            </div>

            {/* Right Column - Sidebar Style */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Personality Profile</h4>
                <div className="space-y-4 text-sm">
                    <div>
                        <div className="text-gray-500 text-xs mb-1">Behavior</div>
                        <div className="font-medium text-gray-800">{selectedJudge.personality_profile.courtroom_behavior}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 text-xs mb-1">Tolerance for Delays</div>
                        <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            selectedJudge.personality_profile.tolerance_for_delays === "Low" ? "bg-red-100 text-red-800" : 
                            selectedJudge.personality_profile.tolerance_for_delays === "High" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                            {selectedJudge.personality_profile.tolerance_for_delays}
                        </div>
                    </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center"><FiAward className="text-yellow-500 mr-2"/> Strengths</h4>
                <div className="flex flex-wrap gap-2">
                    {selectedJudge.strengths.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
                            {s}
                        </span>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Areas of Caution</h4>
                <ul className="space-y-2">
                    {selectedJudge.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
                           ⚠️ {w}
                        </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {judgesData.map((judge) => (
          <button
            key={judge.judge_id}
            onClick={() => setSelectedJudge(judge)}
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all text-left flex flex-col h-full"
          >
            <div className="flex items-start justify-between w-full mb-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-serif font-bold text-xl group-hover:bg-slate-800 group-hover:text-white transition-colors">
                    {judge.judge_id}
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">{judge.region}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{judge.name}</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{judge.summary}</p>
            
            <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                 <div className="flex flex-wrap gap-1">
                    {Object.keys(judge.case_type_experience).slice(0, 3).map(type => (
                        <span key={type} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{type}</span>
                    ))}
                 </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default JudgeSection;