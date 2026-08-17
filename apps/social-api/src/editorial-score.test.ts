import { describe,expect,it } from "vitest";
import { editorialScore } from "./editorial-score.js";

const candidate={topic:"Portugal tax filing",hook:"Portugal tax filing starts with one essential check.",caption:"People filing taxes in Portugal should check the official tax portal and retain the receipt so they can prove submission.",callToAction:"Save this checklist for filing day.",hashtags:["#Portugal","#Tax","#Checklist","#Finkavo"],slides:[{title:"Portugal tax filing",body:"Know what to check before filing and why the receipt matters.",items:[],sourceLabel:"Tax Authority"},{title:"Keep proof",body:"Download your official submission receipt.",items:[],sourceLabel:"Tax Authority"},{title:"Your filing takeaway",body:"Store the receipt with your tax records so you can verify submission later.",items:[],sourceLabel:"Tax Authority"}],sources:[{url:"https://info.portaldasfinancas.gov.pt",tier:"official"}],riskLevel:"high",subjectFamily:"irs",userQuestion:"How do I file?",contentIntent:"checklist"};
describe("pre-review editorial score",()=>{
  it("passes a complete evidence-bound post",()=>expect(editorialScore(candidate)).toEqual({score:100,failures:[],passed:true}));
  it("blocks generic, unsupported review copy",()=>{const weak={...candidate,hook:"Important update",sources:[],subjectFamily:""};const result=editorialScore(weak);expect(result.passed).toBe(false);expect(result.score).toBeLessThan(90);});
});
