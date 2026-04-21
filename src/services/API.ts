import { apiClient } from "./apiClient";

async function getSolutionsAPI() {
  const res = await apiClient.get("/solutions/get-solutions");

  const data = await Promise.all(
    res.data.data.map(async (sol: any) => {
      let code = sol.solution;
      if (typeof code === 'string' && code.startsWith('http')) {
        const response = await fetch(sol.solution);
        if (response.ok && !response.headers.get('content-type')?.includes('text/html')) {
          code = await response.text();
        }
      }

      return {
        challenge: sol.challenge,
        solution: code,
      };
    })
  );

  return data;
}

async function getSolutionByChallengeIdAPI(challengeId: string) {
  const res = await apiClient.get(`/solutions/get-solution/${challengeId}`);

  const sol = res.data.data;
  let code = sol.solution;
  if (typeof code === 'string' && code.startsWith('http')) {
    const response = await fetch(sol.solution);
    if (response.ok && !response.headers.get('content-type')?.includes('text/html')) {
      code = await response.text();
    }
  }


  return {
    challenge: sol.challenge,
    solution: code,
    result: sol.result,
  };
}

async function getChallengesAPI() {
  const res = await apiClient.get("/challenges/get-challenges");
  return res.data.data;
}

async function getChallengeByIdAPI(challengeId: string) {
  const res = await apiClient.get(`/challenges/get-challenge/${challengeId}`);
  return res.data.data;
}

async function submitCodeAPI(iframeDoc: string, validatorKey: string, challengeId: string) {
  const res = await apiClient.post("/submission/submit", {
    iframeDoc,
    validatorKey,
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
  getSolutionByChallengeIdAPI,
  getChallengesAPI,
  getChallengeByIdAPI,
  submitCodeAPI,
  addSolutionAPI
}