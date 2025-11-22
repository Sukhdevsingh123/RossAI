import React, { useState } from "react";
import { FiChevronLeft, FiBriefcase, FiGlobe, FiAward, FiUserCheck } from "react-icons/fi";

const lawyersData = [
    {
      "lawyer_id": "L1",
      "name": "Adv. Ramesh Gupta",
      "region": "Rajasthan",
      "education": {
        "LLB": "University of Rajasthan",
        "LLM": "NLU Jodhpur"
      },
      "summary": "Adv. Ramesh Gupta is a senior litigator educated at the University of Rajasthan and NLU Jodhpur. With over a decade of courtroom experience, he specializes in accident and property disputes. He is widely respected for his strategic evidence presentation and strong factual argumentation. His practice focuses on securing high compensation and protecting land ownership rights. Clients admire his disciplined, result-oriented style.",
      "bar_council_enrollment_year": 2012,
      "languages": ["Hindi", "English"],
      "biography": "A senior accident and property lawyer known for strategic evidence presentation and deep legal understanding.",
      "specialization_summary": "Expert in accident compensation and land/property disputes.",
      "awards": ["Best Accident Litigator 2020"],
      "case_types": ["Accident", "Property"],
      "average_case_duration_months": {
        "Accident": 11,
        "Property": 17
      },
      "cases": ["C1", "C12"],
      "opposing_lawyers": ["L3"]
    },
    {
      "lawyer_id": "L2",
      "name": "Adv. Sakshi Mehta",
      "region": "Delhi",
      "education": {
        "LLB": "Indian Law Institute, Delhi",
        "LLM": "NALSAR Hyderabad"
      },
      "summary": "Adv. Sakshi Mehta completed her legal education at ILI Delhi and later pursued an LLM at NALSAR. She specializes in corporate advisory and commercial dispute matters. With 9+ years of practice, she is known for her drafting precision and negotiation skills. She frequently advises startups and mid-sized companies. Her calm professional demeanor makes her a trusted corporate counsel.",
      "bar_council_enrollment_year": 2015,
      "languages": ["English", "Hindi"],
      "biography": "Corporate commercial lawyer with strong drafting skills and negotiation expertise.",
      "specialization_summary": "Corporate legal advisory and commercial dispute resolution.",
      "awards": [],
      "case_types": ["Corporate"],
      "average_case_duration_months": { "Corporate": 14 },
      "cases": [],
      "opposing_lawyers": []
    },
    {
      "lawyer_id": "L3",
      "name": "Adv. Harish Menon",
      "region": "Rajasthan",
      "education": {
        "LLB": "Kerala Law Academy",
        "LLM": "Symbiosis International University"
      },
      "summary": "Adv. Harish Menon completed his LLB in Kerala and pursued higher studies at Symbiosis. With a decade of litigation experience, he is known for his aggressive representation style. He specializes in accident claims and excels at cross-examination. His reputation among insurance companies is notable for his ability to challenge expert reports. Clients rely on his assertive courtroom approach.",
      "bar_council_enrollment_year": 2014,
      "languages": ["Hindi", "Malayalam", "English"],
      "biography": "Known for aggressive representation in accident cases with powerful cross-examination skills.",
      "specialization_summary": "Motor vehicle accident litigation specialist.",
      "awards": [],
      "case_types": ["Accident"],
      "average_case_duration_months": { "Accident": 12 },
      "cases": ["C1"],
      "opposing_lawyers": ["L1"]
    },
    {
      "lawyer_id": "L4",
      "name": "Adv. Priya Nanda",
      "region": "Gujarat",
      "education": {
        "LLB": "GNLU Gandhinagar"
      },
      "summary": "Adv. Priya Nanda graduated from GNLU and is known for her expertise in family and divorce cases. She has over eight years of experience navigating sensitive matrimonial disputes. Known for her mediation-friendly approach, she secures settlements in most cases. Her communication style is empathetic and solution-focused. Clients trust her judgment in emotionally complex matters.",
      "bar_council_enrollment_year": 2015,
      "languages": ["Gujarati", "Hindi", "English"],
      "biography": "A divorce and family attorney with a high success rate in mediated settlements.",
      "specialization_summary": "Mediation and family dispute resolution.",
      "awards": ["Family Court Excellence Award 2022"],
      "case_types": ["Divorce"],
      "average_case_duration_months": { "Divorce": 3 },
      "cases": ["C3"],
      "opposing_lawyers": ["L7"]
    },
    {
      "lawyer_id": "L5",
      "name": "Adv. Ashok Desai",
      "region": "Rajasthan",
      "education": {
        "LLB": "Delhi University"
      },
      "summary": "Adv. Ashok Desai is a senior property law expert with over 15 years of litigation experience. Educated at Delhi University, he has handled some of Rajasthan’s most complex land disputes. His courtroom presence is commanding and strategic. Known for winning tough title and ownership battles, he is one of the most trusted civil litigators. Clients appreciate his direct and honest approach.",
      "bar_council_enrollment_year": 2008,
      "languages": ["Hindi", "English"],
      "biography": "One of Rajasthan’s most experienced property litigators with a strong courtroom track record.",
      "specialization_summary": "Property and civil land dispute specialist.",
      "awards": ["Rajasthan Legal Excellence Award 2019"],
      "case_types": ["Property"],
      "average_case_duration_months": { "Property": 18 },
      "cases": ["C2"],
      "opposing_lawyers": []
    },
    {
      "lawyer_id": "L6",
      "name": "Adv. Rohit Shukla",
      "region": "Uttar Pradesh",
      "education": {
        "LLB": "Banaras Hindu University"
      },
      "summary": "Adv. Rohit Shukla is a criminal defense specialist educated at BHU. With more than 11 years in practice, he focuses on identifying procedural lapses in prosecution cases. His methodical style is appreciated in lower and high courts alike. He is known for preparing tightly structured case files and anticipating prosecutorial arguments. Clients rely on his deep understanding of criminal law.",
      "bar_council_enrollment_year": 2011,
      "languages": ["Hindi", "English"],
      "biography": "Criminal defense specialist known for dissecting procedural errors in prosecution cases.",
      "specialization_summary": "Criminal trials and procedural defense.",
      "awards": [],
      "case_types": ["Criminal"],
      "average_case_duration_months": { "Criminal": 9 },
      "cases": [],
      "opposing_lawyers": []
    },
    {
      "lawyer_id": "L7",
      "name": "Adv. Poonam Jain",
      "region": "Gujarat",
      "education": {
        "LLB": "Maharaja Sayajirao University Baroda"
      },
      "summary": "Adv. Poonam Jain is a skilled divorce negotiator with seven years of family court experience. She emphasizes collaborative settlements over adversarial litigation. Her academic background from MSU Baroda strengthened her foundation in matrimonial laws. Clients appreciate her calm, composed legal guidance. She is known for achieving peaceful, fast-track divorce settlements.",
      "bar_council_enrollment_year": 2016,
      "languages": ["Gujarati", "English"],
      "biography": "Soft-spoken but strategic divorce lawyer with strong negotiation skills.",
      "specialization_summary": "Peaceful divorce settlements and mediation.",
      "awards": [],
      "case_types": ["Divorce"],
      "average_case_duration_months": { "Divorce": 4 },
      "cases": ["C3"],
      "opposing_lawyers": ["L4"]
    },
    {
      "lawyer_id": "L8",
      "name": "Adv. Santosh Kumar",
      "region": "Tamil Nadu",
      "education": {
        "LLB": "Dr. Ambedkar Government Law College, Chennai",
        "LLM": "IIM Bangalore (Business Law)"
      },
      "summary": "Adv. Santosh Kumar is a corporate litigation expert with a strong academic background in business law. Having practiced for over 14 years, he has represented major companies in governance disputes. His analytical style and deep understanding of compliance frameworks set him apart. Known for structured and professional submissions, he maintains clarity in complex arguments. Clients trust him for high-stakes corporate cases.",
      "bar_council_enrollment_year": 2009,
      "languages": ["Tamil", "English"],
      "biography": "Corporate governance and company litigation expert with deep analytical skills.",
      "specialization_summary": "Corporate compliance, business law, company disputes.",
      "awards": ["Corporate Law Excellence Medal 2021"],
      "case_types": ["Corporate"],
      "average_case_duration_months": { "Corporate": 15 },
      "cases": ["C11"],
      "opposing_lawyers": []
    },
    {
      "lawyer_id": "L9",
      "name": "Adv. Kavya Singh",
      "region": "Delhi",
      "education": {
        "LLB": "Amity Law School",
        "LLM": "NALSAR Hyderabad"
      },
      "summary": "Adv. Kavya Singh is a hybrid corporate and criminal litigator with a sharp analytical mindset. Educated at Amity and NALSAR, she combines theory with practical litigation skills. With 6+ years of experience, she handles financial disputes and white-collar crime cases. She is known for well-researched submissions and clear courtroom arguments. Clients appreciate her precision and youthful dynamism.",
      "bar_council_enrollment_year": 2017,
      "languages": ["English", "Hindi"],
      "biography": "Corporate and criminal litigation lawyer with a reputation for sharp legal arguments.",
      "specialization_summary": "Corporate disputes and white-collar crime defense.",
      "awards": [],
      "case_types": ["Corporate", "Criminal"],
      "average_case_duration_months": {
        "Corporate": 13,
        "Criminal": 10
      },
      "cases": ["C4"],
      "opposing_lawyers": []
    },
    {
      "lawyer_id": "L10",
      "name": "Adv. Milan D'Souza",
      "region": "Maharashtra",
      "education": {
        "LLB": "Government Law College, Mumbai"
      },
      "summary": "Adv. Milan D’Souza is one of Mumbai’s best-known criminal lawyers with 13+ years of trial experience. His education at GLC Mumbai provided a strong legal foundation. He is highly skilled in using forensic evidence in court. Known for sharp cross-examination, he has secured convictions in complex criminal matters. Clients and colleagues view him as a courtroom tactician.",
      "bar_council_enrollment_year": 2010,
      "languages": ["English", "Hindi", "Marathi"],
      "biography": "Veteran criminal lawyer known for mastering forensic evidence in court.",
      "specialization_summary": "Criminal trials, forensic analysis, cross-examination.",
      "awards": ["Mumbai Criminal Bar Award 2023"],
      "case_types": ["Criminal"],
      "average_case_duration_months": { "Criminal": 8 },
      "cases": ["C5"],
      "opposing_lawyers": []
    },
    {
      "lawyer_id": "L11",
      "name": "Adv. Aisha Noor",
      "region": "Kerala",
      "education": {
        "LLB": "Government Law College, Trivandrum"
      },
      "summary": "Adv. Aisha Noor is a property dispute specialist with a calm and structured style. Educated at GLC Trivandrum, she has 9 years of civil litigation experience. She is known for her strong documentation skills and methodical preparation. Her approach is detail-driven, especially in title and possession matters. Clients appreciate her transparent and patient guidance.",
      "bar_council_enrollment_year": 2013,
      "languages": ["Malayalam", "English", "Hindi"],
      "biography": "Calm and detail-focused property litigation expert with strong documentation skills.",
      "specialization_summary": "Property and civil documentation disputes.",
      "awards": [],
      "case_types": ["Property"],
      "average_case_duration_months": { "Property": 20 },
      "cases": ["C6"],
      "opposing_lawyers": []
    },
    {
      "lawyer_id": "L12",
      "name": "Adv. Zubin Patel",
      "region": "Uttar Pradesh",
      "education": {
        "LLB": "AMU Law Faculty"
      },
      "summary": "Adv. Zubin Patel is a seasoned criminal defense attorney with 12+ years of courtroom experience. His education at AMU sharpened his socio-legal understanding. He specializes in exposing weaknesses in prosecution evidence. Known for his persuasive oral arguments, he has secured numerous acquittals. Clients trust him for sensitive and serious criminal matters.",
      "bar_council_enrollment_year": 2010,
      "languages": ["Hindi", "English", "Urdu"],
      "biography": "Criminal defense lawyer known for exposing gaps in prosecution evidence.",
      "specialization_summary": "Criminal defense and appeal matters.",
      "awards": [],
      "case_types": ["Criminal"],
      "average_case_duration_months": { "Criminal": 7 },
      "cases": ["C8"],
      "opposing_lawyers": []
    },
    {
      "lawyer_id": "L13",
      "name": "Adv. Neha Kaur",
      "region": "Punjab",
      "education": {
        "LLB": "Punjab University"
      },
      "summary": "Adv. Neha Kaur specializes in accident compensation cases and has 10 years of legal experience. Her academic training from Punjab University supports her litigation strength. She is known for maximizing compensation through strong medical and factual evidence. Her empathetic interactions help clients feel supported during difficult cases. She has become a prominent name in Punjab’s accident litigation field.",
      "bar_council_enrollment_year": 2014,
      "languages": ["Punjabi", "Hindi", "English"],
      "biography": "Accident compensation specialist known for maximizing client payouts.",
      "specialization_summary": "Accident law, insurance claim disputes.",
      "awards": ["Punjab Rising Lawyer Award 2021"],
      "case_types": ["Accident"],
      "average_case_duration_months": { "Accident": 11 },
      "cases": ["C7"],
      "opposing_lawyers": []
    },
    {
      "lawyer_id": "L14",
      "name": "Adv. Suresh Rana",
      "region": "Haryana",
      "education": {
        "LLB": "Kurukshetra University"
      },
      "summary": "Adv. Suresh Rana is a divorce and family case specialist with 8 years of focused practice. He studied at Kurukshetra University where he developed a strong interest in family law. Known for his calm and practical approach, he helps clients reach amicable settlements. His reputation in Haryana's family courts is built on fairness and clarity. Clients rely on him for conflict-free divorce solutions.",
      "bar_council_enrollment_year": 2015,
      "languages": ["Hindi", "English"],
      "biography": "Divorce and family settlement expert with strong family court experience.",
      "specialization_summary": "Mutual divorces, custody disputes, family mediation.",
      "awards": [],
      "case_types": ["Divorce"],
      "average_case_duration_months": { "Divorce": 3 },
      "cases": ["C9"],
      "opposing_lawyers": []
    },
    {
      "lawyer_id": "L15",
      "name": "Adv. Pallavi Deshpande",
      "region": "Madhya Pradesh",
      "education": {
        "LLB": "Indore Institute of Law"
      },
      "summary": "Adv. Pallavi Deshpande is a property litigation specialist with over 12 years of professional experience. Educated at Indore Institute of Law, she excels in complex title verification and land ownership cases. Her methodical style and thorough evidentiary preparation set her apart. She is known for securing favorable outcomes in long-standing civil disputes. Clients value her honest communication and deep legal knowledge.",
      "bar_council_enrollment_year": 2012,
      "languages": ["Hindi", "English"],
      "biography": "Property dispute specialist with expertise in land ownership and title verification.",
      "specialization_summary": "Property litigation and land title disputes.",
      "awards": ["MP Civil Litigation Award 2020"],
      "case_types": ["Property"],
      "average_case_duration_months": { "Property": 18 },
      "cases": ["C10"],
      "opposing_lawyers": []
    }
];

const LawyerSection = () => {
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  if (selectedLawyer) {
    return (
      <div className="h-full overflow-y-auto p-6 bg-gray-50">
        <button
          onClick={() => setSelectedLawyer(null)}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FiChevronLeft className="mr-1" /> Back to Lawyers
        </button>

        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-800 to-purple-900 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                     <h2 className="text-3xl font-serif font-bold">{selectedLawyer.name}</h2>
                     {selectedLawyer.awards.length > 0 && <FiAward className="text-yellow-400 text-xl" title="Award Winner"/>}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-indigo-200 text-sm">
                  <span className="flex items-center"><FiGlobe className="mr-1" /> {selectedLawyer.region}</span>
                  <span className="flex items-center"><FiUserCheck className="mr-1" /> Bar Enrollment: {selectedLawyer.bar_council_enrollment_year}</span>
                </div>
              </div>
              <div className="text-right bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <div className="text-xs uppercase tracking-wider text-indigo-200 mb-1">Specialization</div>
                <div className="font-semibold text-lg">{selectedLawyer.case_types.join(" & ")}</div>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Biography</h3>
                <p className="text-gray-600 leading-relaxed text-justify">
                  {selectedLawyer.summary}
                </p>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-4 rounded-xl">
                    <h4 className="text-indigo-900 font-medium mb-2 flex items-center"><FiBriefcase className="mr-2"/> Primary Focus</h4>
                    <p className="text-sm text-gray-700">{selectedLawyer.specialization_summary}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                     <h4 className="text-purple-900 font-medium mb-2">Education</h4>
                     <ul className="text-sm text-gray-700 space-y-1">
                        {selectedLawyer.education.LLM && <li><strong>LLM:</strong> {selectedLawyer.education.LLM}</li>}
                        <li><strong>LLB:</strong> {selectedLawyer.education.LLB}</li>
                     </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Case Statistics</h3>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="space-y-4">
                        {Object.entries(selectedLawyer.average_case_duration_months).map(([type, months]) => (
                             <div key={type}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{type} Cases</span>
                                    <span className="text-gray-500">Avg. {months} Months</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${Math.min((months/24)*100, 100)}%` }}></div>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Professional Details</h4>
                <div className="space-y-4 text-sm">
                    <div>
                        <div className="text-gray-500 text-xs mb-1">Languages Spoken</div>
                        <div className="flex flex-wrap gap-2">
                            {selectedLawyer.languages.map(lang => (
                                <span key={lang} className="bg-white px-2 py-1 rounded border border-gray-200 text-gray-700">{lang}</span>
                            ))}
                        </div>
                    </div>
                    {selectedLawyer.awards.length > 0 && (
                        <div>
                             <div className="text-gray-500 text-xs mb-1">Recognition</div>
                             <ul className="list-disc list-inside text-gray-800">
                                {selectedLawyer.awards.map((award, i) => <li key={i}>{award}</li>)}
                             </ul>
                        </div>
                    )}
                </div>
              </div>

               {selectedLawyer.cases.length > 0 && (
                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Active Cases</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedLawyer.cases.map(c => (
                            <span key={c} className="px-3 py-1 bg-gray-100 text-gray-600 rounded font-mono text-sm">{c}</span>
                        ))}
                    </div>
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lawyersData.map((lawyer) => (
          <button
            key={lawyer.lawyer_id}
            onClick={() => setSelectedLawyer(lawyer)}
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all text-left flex flex-col h-full"
          >
            <div className="flex items-center justify-between w-full mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-serif font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {lawyer.lawyer_id}
                </div>
                <div className="flex flex-col items-end">
                     <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded mb-1">{lawyer.region}</span>
                     <span className="text-[10px] text-gray-400">Exp: {new Date().getFullYear() - lawyer.bar_council_enrollment_year} Yrs</span>
                </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{lawyer.name}</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{lawyer.biography}</p>
            
            <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                 <div className="flex flex-wrap gap-1">
                    {lawyer.case_types.map(type => (
                        <span key={type} className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{type}</span>
                    ))}
                 </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LawyerSection;