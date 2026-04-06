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

const urlEnTurno = "https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php"

const App = () => {

    const [data, setData] = useState(null);
    const [counter, setCounter] = useState("-");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [userLoc, setUserLoc] = useState({
        lat: -53.1013,
        lng: -70.5444
    });

    const successCallback = (position) => {
        setUserLoc({
            lat: position.coords.latitude,
            lng: position.coords.longitude
        });
        setZoom(14);
    };

    const errorCallback = (error) => {
        console.log(error);
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(urlEnTurno);
                setData(response.data.filter((spot) => spot.local_lat && spot.local_lng));
                setCounter(response.data.length);
                setIsLoading(false);
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Grid
            templateAreas={`"header header" "nav main" "nav footer"`}
            gridTemplateRows={`50px 1fr 30px`}
            gridTemplateColumns={'0px 100%'}
            height='100dvh'
            color='blackAlpha.700'
            fontWeight='bold'>

            <GridItem pl='2' bg='gray.100' area={'header'} position='relative'>
                <Heading fontSize={{ base: '20px', md: '25px', lg: '30px' }} position='absolute' top='50%' transform='translateY(-50%)'>
                    Farmacias en turno Chile: {counter}
                </Heading>
            </GridItem>

            <GridItem area={'main'}>
                {
                    isLoading ?
                    <Center width='100%' height='100%'>
                        <Spinner
                            height='150px'
                            width='150px'
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl' />
                    </Center> : 
                    error ?
                    <Center width='100%' height='100%'>
                        <Text fontSize={"larger"} fontWeight={"bold"}>
                            No se pudo cargar la información. Intenta recargar la página.
                        </Text>
                    </Center> :
                    <Map spots={data} center={userLoc} zoom={zoom}/>
                }
            </GridItem>

            <GridItem pl='2' bg='gray.600' area={'footer'} color='white' position='relative'>
                <HStack position='absolute' top='50%' transform='translateY(-50%)'>
                    <Text fontSize={{ base: '11px', md: '13px', lg: '16px' }}>
                        Desarrollado por {' '} {' '}
                        <Link color='teal.500' href='https://github.com/iwayato' isExternal rel='noopener noreferrer'>
                            Tomoaki Iwaya Villalobos
                        </Link>
                    </Text>
                    <Text fontSize={{ base: '11px', md: '13px', lg: '16px' }}>
                        -
                    </Text>
                    <Text fontSize={{ base: '11px', md: '13px', lg: '16px' }}>
                        2024
                    </Text>
                </HStack>
            </GridItem>
        </Grid>
    );
}

export default App;