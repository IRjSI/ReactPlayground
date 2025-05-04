const solution = (iframeDoc: Document) => {
  const button = iframeDoc.querySelector("button");
  return !!button;
};

export { solution };