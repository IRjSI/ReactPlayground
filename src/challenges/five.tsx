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

export { solution }