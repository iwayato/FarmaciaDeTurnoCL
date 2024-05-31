import axios from "axios";

const url = "https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php"

export const fetchData = async () => {
    try {
        const response = await axios.get(url);
        return response.data
    }
    catch (error) {
        return error
    }
}