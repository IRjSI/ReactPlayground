const solution = () => {
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

    
}

const Five = () => {
    return (
        <div className="flex justify-center items-center">
            <h1 className="text-3xl font-semibold">Challenge 5: User types a fruit in input → clicks "Add" → adds to list</h1>
        </div>
    )
}

export { Five, solution }