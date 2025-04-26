export const simulateClickValidation = async (
    iframeDoc: Document,
    selector: string,
    expectedAfter: string,
    delay: number = 0
  ): Promise<boolean> => {
    const element = iframeDoc.querySelector(selector);
    if (!element) return false;
  
  
    // Fire click event
    element.dispatchEvent(new Event("click", { bubbles: true }));
  
    if (delay > 0) {
      await new Promise((res) => setTimeout(res, delay));
    }
  
    const afterText = element.textContent?.toLowerCase().trim();
  
    return afterText === expectedAfter.toLowerCase();
  };
  