const solution = (iframeDoc: Document, userCode: string) => {
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
}

export { solution }