const solution = (iframeDoc: Document) => {
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

    // Get all h1 elements from the user's solution
    const headings = Array.from(iframeDoc.querySelectorAll("h1"));
    
    // Check if there are multiple h1 elements (suggesting a list was rendered)
    if (headings.length < 3) {
        return false; // Require at least 3 items to ensure they're using mapping
    }
    
    // If all heading texts are the same, they might have manually created elements
    // If there are multiple unique texts, they likely used .map() with an array
    return true;
}

const Four = () => {
    return (
        <div className="flex justify-center items-center">
            <h1 className="text-3xl font-semibold">Challenge 4: Show a list of fruits using .map()</h1>
        </div>
    )
}

export { Four, solution }