import { useState, useEffect } from "react";
import axios from "axios";
import Map from "./components/Map";

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
    }, []);

    if (isLoading) {
        return (
            <div>
                Loading ...
            </div>
        )
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Map spots = {data}/>
    );
}

export default App;