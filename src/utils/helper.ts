export const simulateClickValidation = async (
    iframeDoc: Document,
    selector: string,
    expectedBefore: string,
    expectedAfter: string,
    delay: number = 0
  ): Promise<boolean> => {
    const element = iframeDoc.querySelector(selector);
    if (!element) return false;
  
    const beforeText = element.textContent?.toLowerCase().trim();
  
    // Fire click event
    element.dispatchEvent(new Event("click", { bubbles: true }));
  
    if (delay > 0) {
      await new Promise((res) => setTimeout(res, delay));
    }
  
    const afterText = element.textContent?.toLowerCase().trim();
  
    return beforeText === expectedBefore.toLowerCase() && afterText === expectedAfter.toLowerCase();
  };
  