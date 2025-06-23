function App() {
    const handleClick = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/auth/validate?token=eyJhbGciOiJIUzM4NCJ9...");
            alert("Validation: " + res.data);
        } catch (err) {
            alert("API call failed: " + err.message);
        }
    };

    return (
        <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-blue-600">Welcome to ZIDIOConnect</h1>
            <button
                onClick={handleClick}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Test Backend Connection
            </button>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));