import { apiClient } from "./apiClient";

async function getSolutionsAPI() {
  const res = await apiClient.get("/solutions/get-solutions");

  const data = await Promise.all(
    res.data.data.map(async (sol: any) => {
      const code = await fetch(sol.solution).then(res => res.text());

      return {
        challenge: sol.challenge,
        solution: code,
      };
    })
  );

  return data;
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