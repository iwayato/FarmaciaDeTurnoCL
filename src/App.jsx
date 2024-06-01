import {
    Grid,
    GridItem,
    HStack,
    Text,
    Link,
    Heading,
    Center,
    Spinner
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import Map from "./components/Map";

const url = "https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php"

const App = () => {

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLoc, setUserLoc] = useState({
        lat: -34.135020,
        lng: -71.565964
    });

    const successCallback = (position) => {
        setUserLoc({
            lat: position.coords.latitude, 
            lng: position.coords.longitude
        });
    };

    const errorCallback = (error) => {
        console.log(error);
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
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
            <Center width='100%' height='100vh'>
                <Spinner
                    height='150px'
                    width='150px'
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl' />
            </Center>
        )
    }

    if (error) {
        return (
            <Center width='100%' height='100vh'>
                <Text fontSize={"larger"} fontWeight={"bold"}>
                    Error: {error.message}
                </Text>
            </Center>
        )
    }

    return (
        <Grid
            templateAreas={`"header header" "nav main" "nav footer"`}
            gridTemplateRows={'50px 1fr 30px'}
            gridTemplateColumns={'0px 1fr'}
            h={"100vh"}
            color='blackAlpha.700'
            fontWeight='bold'>

            <GridItem pl='10px' bg='gray.100' area={'header'}>
                <Heading>Farmacias en turno CL</Heading>
            </GridItem>

            <GridItem bg='green.300' area={'main'}>
                <Map spots={data} center={userLoc}/>
            </GridItem>

            <GridItem pl='2' bg='gray.600' area={'footer'} color='white'>
                <HStack>
                    <Text marginTop='3px'>
                        Realizado por {' '} {' '}
                        <Link color='teal.500' href='https://github.com/iwayato'>
                            Tomoaki Iwaya Villalobos
                        </Link>
                    </Text>
                    <Text>
                        -
                    </Text>
                    <Text>
                        2024
                    </Text>
                </HStack>
            </GridItem>
        </Grid>
    );
}

export default App;