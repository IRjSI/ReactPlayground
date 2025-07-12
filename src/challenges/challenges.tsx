export const solutionOne = (iframeDoc: Document) => {
  const button = iframeDoc.querySelector("button");
  return !!button;
};

export const solutionTwo = async (iframeDoc: Document) => {

  const element = iframeDoc.querySelector("button");
  if (!element) return false

  const beforeText = element.textContent?.toLowerCase().trim();
  // Fire click event
  element.dispatchEvent(new Event("click", { bubbles: true }));

  const afterText = element.textContent?.toLowerCase().trim();

  return beforeText !== afterText && afterText === "click";
};

export const solutionThree = async (iframeDoc: Document): Promise<boolean> => {
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

export const solutionFour = (iframeDoc: Document, userCode: string) => {
    //expected solution
    /*
        function App() {
            const fruits = ['apple', 'banana', 'tomato', 'kiwi', 'watermelon', 'melon']
        
            return (
            <>
                {fruits.map((fruit, ind) => (
                <div key={ind}>
                    <h1>{fruit}</h1>
                </div>
                ))}
            </>
            );
        }
    */

    if (!userCode.includes('.map(')) {
        return false;
    }
    
    // Get all h1 elements from the user's solution
    const headings = Array.from(iframeDoc.querySelectorAll("h1"));
    
    // Define the expected list of fruits
    const fruits = ['apple', 'banana', 'tomato', 'kiwi', 'watermelon', 'melon'];
    
    // Extract the text content from the headings and normalize it (trim and lowercase)
    const renderedFruits = headings.map(h => h.innerText.trim().toLowerCase());
    
    // Check if all expected fruits are present in the rendered list
    return fruits.every(fruit => renderedFruits.includes(fruit));
};

export const solutionFive = () => {
    /* expected solution
        function App() {
            const [fruit, setFruit] = React.useState('');
            const [fruits, setFruits] = React.useState([]);

            const addFruit = () => {
                setFruits([...fruits, fruit]);
                setFruit('');
            };

            return (
                <div>
                <input
                    type="text"
                    placeholder="type..."
                    value={fruit}
                    onChange={(e) => setFruit(e.target.value)}
                />
                <button type="submit" onClick={addFruit}>
                    Add
                </button>
            );
        }

    */  
};

export const solutionSix = async (iframeDoc: Document): Promise<boolean> => {
  const button = iframeDoc.querySelector("button");
  if (!button) return false;

  const getParagraph = () => iframeDoc.querySelector("p");

  // 1. Initially <p> should NOT exist
  if (getParagraph()) return false;

  // 2. Click to show <p>
  button.click();
  await new Promise(res => setTimeout(res, 150)); // increased delay

  const pAfterFirstClick = getParagraph();
  if (!pAfterFirstClick || !pAfterFirstClick.textContent?.toLowerCase().includes("text")) {
    return false;
  }

  // 3. Click again to hide <p>
  button.click();
  await new Promise(res => setTimeout(res, 150)); // wait again

  if (getParagraph()) return false; // should be removed now

  return true;
};

export const solutionSeven = async (iframeDoc: Document): Promise<boolean> => {
  const button = iframeDoc.querySelector("button");
  const p = iframeDoc.querySelector("p");

  if (!button || !p) return false;

  const before = parseInt(p.textContent || "", 10);
  button.click();

  await new Promise(res => setTimeout(res, 50));

  const after = parseInt(p.textContent || "", 10);

  return !isNaN(before) && after === before + 1;
};

export const solutionEight = async (iframeDoc: Document): Promise<boolean> => {
  const input = iframeDoc.querySelector("input");
  const display = iframeDoc.querySelector("p");

  if (!input || !display) return false;

  const testValue = "hello!";
  input.value = testValue;
  input.dispatchEvent(new Event("input", { bubbles: true }));

  await new Promise(res => setTimeout(res, 50));

  return display.textContent?.includes(testValue.length.toString()) || false;
};

export const solutionNine = async (iframeDoc: Document): Promise<boolean> => {
  const checkbox: any = iframeDoc.querySelector("input[type='checkbox']");
  const display = iframeDoc.querySelector("p");

  if (!checkbox || !display) return false;

  checkbox.checked = true;
  checkbox.dispatchEvent(new Event("change", { bubbles: true }));
  await new Promise(res => setTimeout(res, 50));
  const checkedMessage = display.textContent?.toLowerCase().includes("subscribed");

  checkbox.checked = false;
  checkbox.dispatchEvent(new Event("change", { bubbles: true }));
  await new Promise(res => setTimeout(res, 50));
  const uncheckedMessage = display.textContent?.toLowerCase().includes("not subscribed");

  return !!(checkedMessage && uncheckedMessage);
};

export const solutionTen = async (iframeDoc: Document): Promise<boolean> => {
  const buttons = iframeDoc.querySelectorAll("button");

  const fruitButtons = Array.from(buttons).filter(btn =>
    btn.textContent?.toLowerCase().includes("remove")
  );

  if (fruitButtons.length < 1) return false;

  const initialItems = iframeDoc.querySelectorAll("li").length;

  fruitButtons[0].click();

  await new Promise(res => setTimeout(res, 50));

  const updatedItems = iframeDoc.querySelectorAll("li").length;

  return updatedItems === initialItems - 1;
};