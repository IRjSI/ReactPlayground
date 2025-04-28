const solution = async (iframeDoc: Document) => {

  const element = iframeDoc.querySelector("button");
  if (!element) return false

  const beforeText = element.textContent?.toLowerCase().trim();
  // Fire click event
  element.dispatchEvent(new Event("click", { bubbles: true }));

  const afterText = element.textContent?.toLowerCase().trim();

  return beforeText !== afterText && afterText === "click";
};

const Two = () => {

    return (
      <div className="flex justify-center items-center">
          <h1 className="text-3xl font-semibold">Challenge 2: Make a button that changes <i>it's</i> text(to 'click') on click</h1>
      </div>
    )
  }
  
export { Two, solution }