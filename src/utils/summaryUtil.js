import { openrouter } from "./openRouter.js";

function safeParseJSON(raw) {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");

    if (start === -1 || end === -1) {
        throw new Error(`Model returned non-JSON: ${raw.slice(0, 100)}`);
    }

    return JSON.parse(raw.slice(start, end + 1));
}

export const generateSummary = async (text) => {
    const response = await openrouter.chat.completions.create({
        model: "google/gemma-3-12b-it:free",
        max_tokens: 1000, 
        messages: [
            {
                role: "system",
                content: `You are a JSON-only extraction engine.
You MUST respond with ONLY a valid JSON object.
No greetings. No explanations. No markdown. No text before or after.
Your entire response must start with { and end with }.

Extract and return this exact structure:
{
  "summary": "string",
  "key_points": ["string"],
  "action_items": ["string"],
  "decisions": ["string"],
  "follow_up_questions": ["string"]
}`
            },
            {
                role: "user",
                content: text
            }
        ]
    });

    return safeParseJSON(response.choices[0].message.content);
};
// const result = await generateSummary("Research \tProject \tProposal \tConfidential\nPage\nR \tE \tS \tE \tA \tR \tC \tH \tP \tR \tO \tJ \tE \tC \tT \tP \tR \tO \tP \tO \tS \tA \tL\nRobust \tBackdoor \tPurification \tin \tSmart \tGrid\nClassifiers\nUnder \tCompromised \tAuxiliary \tData \tEnvironments\nDomain: \tCybersecurity \t• \tIndustrial \tControl \tSystems \t• \tMachine \tLearning\n1. \tAbstract\nThe \tsecurity \tof \tIndustrial \tControl \tSystems \t(ICS), \tparticularly \tSmart \tGrids, \tis \tincreasingly\nthreatened \tby \tbackdoor \tattacks \tthat \tmanipulate \tmodel \tbehavior \tvia \tspecific \tsensor \ttriggers.\nWhile \tstate-of-the-art \tpurification \ttechniques \tsuch \tas \tPBP \t(Practical \tBackdoor \tPurification,\n2025) \toffer \ta \tviable \trepair \tmechanism \tfor \tcompromised \tmodels, \tthey \tfundamentally \trely \ton\naccess \tto \ta \t100% \tclean \tauxiliary \tdataset \t— \tan \tassumption \tthat \tis \trarely \tmet \tin \tpractice.\nThis \tproject \taddresses \ta \tcritical \treal-world \tvulnerability: \tpurification \tfailure \twhen \tthe\nauxiliary \tdata \titself \tis \tpartially \tpoisoned. \tWe \tpropose \ta \ttwo-stage \tdefense \tframework \tthat\nleverages \tphysical \tsensor \tcorrelations \tto \tsanitize \tthe \tauxiliary \tdata \tbefore \tperforming\nmodel-level \tweight \treconstruction, \tvalidated \ton \tthe \tSWaT \t(Secure \tWater \tTreatment)\ndataset.\n2. \tProblem \tStatement\nExisting \tbackdoor \tpurification \tframeworks \tassume \ta \t“Trusted \tDefender” \tscenario \twith\naccess \tto \tpristine \tclean \tdata. \tIn \treal-world \tindustrial \tsupply \tchains, \tthis \tassumption \tis\nfrequently \tviolated. \tThere \tare \ttwo \tcore \tgaps \tthis \tresearch \taddresses:\n• \tCurrent \tdefenses \t(e.g., \tPBP, \tBackdoorBenchER) \tare \toptimized \tfor \timage \tdatasets\nlike \tCIFAR \tand \tImageNet, \tand \tdo \tnot \taccount \tfor \tthe \ttemporal \tand \tphysical\ndependencies \tinherent \tin \ttabular \tsensor \tdata.\n• \tThere \tis \tno \trobust \tpurification \tpipeline \tthat \tremains \teffective \twhen \tthe \tdefender’s\nown \tauxiliary \tdata \tis \tuntrusted \tor \tpartially \tpoisoned.\n3. \tLiterature \tReview \t& \tResearch \tGaps\nPBP \t— \tPractical \tBackdoor \tPurification \t(2025)\nProvides \tefficient \tmodel \trepair \tbut \tis \thighly \tsensitive \tto \tnoise \tor \tpoisoning \tin \tthe \tfine-tuning\nset. \tA \tclean \tauxiliary \tdataset \tis \ta \thard \trequirement, \tmaking \tit \tfragile \tin \tadversarial \trecovery\nscenarios.\nBackdoorBenchER \t(2025)\n\n-- 1 of 3 --\n\nResearch \tProject \tProposal \tConfidential\nPage\nDemonstrates \tthat \tauxiliary \tdata \tquality \t(OOD \tor \tSynthetic) \tsignificantly \timpacts \tdefense\nperformance. \tHowever, \tit \tis \tlimited \tto \tComputer \tVision \tand \tprovides \tno \tsolution \tfor\nPoisoned \tAuxiliary \tData \tscenarios.\nICS \t/ \tSmart \tGrid \tDomain \t(Kravchik \tet \tal.)\nExisting \tICS \tsecurity \twork \tpredominantly \tfocuses \ton \tattack \tgeneration \tor \tanomaly\ndetection. \tThere \tis \ta \tnotable \tabsence \tof \twork \ton \tpost-compromise \tmodel \tpurification \tand\nrepair \tspecific \tto \tindustrial \tsensor \tenvironments.\n4. \tProposed \tMethodology\nWe \tpropose \ta \tTwo-Stage \tRobust \tDefense \tPipeline \tdesigned \tspecifically \tfor \ttabular \tICS\nsensor \tdata:\nStage \t1: \tCorrelation-Aware \tSanitization \t(Data \tLevel)\nUnlike \timage \tpixels, \tsensor \tdata \tin \tSmart \tGrids \tobeys \tphysical \tlaws. \tWe \timplement \ta\nstatistical \tfilter \tthat \tanalyzes \tthe \tcorrelation \tmatrix \tof \tthe \tauxiliary \tdataset \tand \tflags\nsamples \tthat \tviolate \tknown \tphysical \tdependencies \t(e.g., \tinconsistent \tValve-Flow\ncorrelations) \tas \tpotential \tbackdoor \ttriggers.\n• \tMethod: \tPearson \tCorrelation \tAnalysis \tacross \tsensor \tpairs\n• \tOutlier \tDetection: \tIsolation \tForests \tto \tidentify \tanomalous \tsensor \tcombinations\nStage \t2: \tRobust \tWeight \tReconstruction \t(Model \tLevel)\nUsing \tthe \tsanitized \t“Refined \tDataset,” \twe \tapply \tan \tenhanced \tversion \tof \tthe \tPBP\nframework. \tReconstructing \tmodel \tweights \tfrom \tonly \tverified-clean \tsamples \tensures \tthe\nbackdoor \tis \tneutralized \twithout \tdegrading \tperformance \ton \tlegitimate \tgrid \toperations.\n5. \tResearch \tNovelty\n• \tUntrusted \tDefender \tScenario: \tMoves \tbeyond \tthe \t“ideal \tclean \tdata” \tassumption \tto\nhandle \tpoisoned \trecovery \tsets \t— \ta \tfirst \tin \tthis \tdomain.\n• \tDomain \tAdaptation: \tFirst \tapplication \tof \tPBP-style \tpurification \ton \ttabular \tICS\nsensor \tdata \t(SWaT \tdataset).\n• \tPhysical \tLogic \tIntegration: \tSensor-to-sensor \tphysical \tcorrelations \tused \tas \ta\nprimary \tsignal \tfor \tdata \tsanitization \t— \ta \tfeature \tabsent \tin \tall \timage/NLP-based\ndefenses.\n6. \tEvaluation \tMetrics\n• \tAttack \tSuccess \tRate \t(ASR): \tPercentage \tof \tmalicious \ttriggers \tthat \tstill \tbypass \tthe\nmodel \tafter \tpurification.\n• \tClean \tAccuracy \t(ACC): \tEnsures \tthe \tgrid’s \tanomaly \tdetection \tperformance \tremains\nhigh \tfor \tnormal \toperational \tdata.\n\n-- 2 of 3 --\n\nResearch \tProject \tProposal \tConfidential\nPage\n• \tRobustness \tGain: \tComparing \tASR \treduction \tin \t“Sanitized-PBP” \tvs. \t“Standard\nPBP” \twhen \t5–10% \tof \tauxiliary \tdata \tis \tpoisoned.\n7. \tKey \tPoints \tfor \tPresentation \t(VIVA)\n• \tWhy \tSWaT? \tIt \trepresents \thigh-stakes \tindustrial \tinfrastructure \twhere \ta \tsuccessful\nbackdoor \tattack \tcould \tcause \treal \tphysical \tdamage \tto \twater \ttreatment \tsystems.\n• \tWhy \tnot \tjust \tretrain \tthe \tmodel? \tRetraining \tfrom \tscratch \tis \tcomputationally\nexpensive \tand \trequires \tthe \toriginal \t(massive) \ttraining \tset, \twhich \tthe \tdefender \tmay\nnot \thave \taccess \tto. \tPurification \tis \tfaster \tand \trequires \tvery \tlittle \tdata.\n• \tWhat \tis \tthe \tSanitizer? \tA \tpre-processing \tstep \tthat \tuses \tstatistical \tmethods\n(Pearson \tCorrelation, \tIsolation \tForests) \tto \tdetect \t“weird” \tsensor \tcombinations \tthat\nshould \tnot \texist \tin \ta \treal \twater \ttreatment \tplant, \tthereby \tidentifying \tand \tremoving\npoisoned \tsamples.\n\n-- 3 of 3 --\n\n")

// console.log(result);