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
    const headings = Array.from(iframeDoc.querySelectorAll("h1"));
    const fruits = ['apple', 'banana', 'tomato', 'kiwi', 'watermelon', 'melon'];
    
    const renderedFruits = headings.map(h => h.innerText.trim().toLowerCase());
    
    // Ensure all expected fruits are present
    return fruits.every(fruit => renderedFruits.includes(fruit));

}

const Four = () => {
    return (
        <div className="flex justify-center items-center">
            <h1 className="text-3xl font-semibold">Challenge 4: Show a list of fruits using .map()</h1>
        </div>
    )
}

export { Four, solution }