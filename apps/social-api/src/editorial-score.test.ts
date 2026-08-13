import { describe,expect,it } from "vitest";
import { editorialScore } from "./editorial-score.js";

const candidate={topic:"Portugal tax filing",hook:"Portugal tax filing starts with one essential check.",caption:"Check the official Portugal tax portal before filing and retain the submission receipt.",callToAction:"Save this checklist for filing day.",hashtags:["#Portugal","#Tax","#Checklist","#Finkavo"],slides:[{title:"Check first",body:"Confirm your details before filing.",items:[],sourceLabel:"Tax Authority"},{title:"Keep proof",body:"Download your official submission receipt.",items:[],sourceLabel:"Tax Authority"},{title:"Done",body:"Store the receipt with your records.",items:[],sourceLabel:"Tax Authority"}],sources:[{url:"https://info.portaldasfinancas.gov.pt",tier:"official"}],riskLevel:"high",subjectFamily:"irs",userQuestion:"How do I file?",contentIntent:"checklist"};
describe("pre-review editorial score",()=>{
  it("passes a complete evidence-bound post",()=>expect(editorialScore(candidate)).toEqual({score:100,failures:[],passed:true}));
  it("blocks generic, unsupported review copy",()=>{const weak={...candidate,hook:"Important update",sources:[],subjectFamily:""};const result=editorialScore(weak);expect(result.passed).toBe(false);expect(result.score).toBeLessThan(90);});
});
