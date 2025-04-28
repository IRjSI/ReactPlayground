const solution = async (iframeDoc: Document): Promise<boolean> => {
    const input = iframeDoc.querySelector("input");
    const output = iframeDoc.querySelector("p");
  
    if (!input || !output) return false;
  
    // Simulate typing by user (can be any random value for the test)
    const testValue = "test";
    input.value = testValue;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  
    // Allow React to update the DOM // important
    await new Promise(res => setTimeout(res, 50));
  
    // Check if the output <p> tag reflects the input value correctly
    return output.textContent?.trim() === testValue;
  };
  

const Three = () => {
    return (
        <div className="flex justify-center items-center">
            <h1 className="text-3xl font-semibold">Challenge 3: Have an input box and show the live input below it</h1>
        </div>
    )
}

export { Three, solution }


