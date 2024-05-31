import { useState, useEffect } from "react";
import axios from "axios";

const url = "https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php"

const App = () => {

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(url);
                setData(response.data);
                setIsLoading(false);
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // empty dependency array means this effect will only run once after the component mounts

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            {data && (
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>{item.comuna_nombre}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;
