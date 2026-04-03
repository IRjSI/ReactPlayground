import { apiClient } from "./apiClient";

async function getSolutionsAPI() {
    const res = await apiClient.get("/solutions/get-solutions");
    return res.data.data;
}

async function getChallengesAPI() {
  const res = await apiClient.get("/challenges/get-challenges");
  return res.data.data;
}

async function submitCodeAPI(iframeDoc: string, challengeId: string) {
  const res = await apiClient.post("/submission/submit", {
    iframeDoc,
    challengeId,
  });
  return res.data;
}

async function addSolutionAPI(challengeId: string, code: string) {
  const res = await apiClient.post("/solutions/add-solution", {
    challengeId,
    solution: code,
  });
  return res.data;
}

export {
    getSolutionsAPI,
    getChallengesAPI,
    submitCodeAPI,
    addSolutionAPI
}