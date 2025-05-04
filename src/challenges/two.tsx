const solution = async (iframeDoc: Document) => {

  const element = iframeDoc.querySelector("button");
  if (!element) return false

  const beforeText = element.textContent?.toLowerCase().trim();
  // Fire click event
  element.dispatchEvent(new Event("click", { bubbles: true }));

  const afterText = element.textContent?.toLowerCase().trim();

  return beforeText !== afterText && afterText === "click";
};

export { solution }