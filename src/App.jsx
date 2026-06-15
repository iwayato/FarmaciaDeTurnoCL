import {
    Grid,
    GridItem,
    HStack,
    Flex,
    Text,
    Link,
    Heading,
    Center,
    Spinner,
    Select,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import Map from "./components/Map";

const urlEnTurno = "https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php";

const REGIONS = {
    '1':  'Arica y Parinacota',
    '2':  'Tarapacá',
    '3':  'Antofagasta',
    '4':  'Atacama',
    '5':  'Coquimbo',
    '6':  'Valparaíso',
    '7':  'Metropolitana',
    '8':  "O'Higgins",
    '9':  'Maule',
    '10': 'Biobío',
    '11': 'La Araucanía',
    '12': 'Los Ríos',
    '13': 'Los Lagos',
    '14': 'Aysén',
    '15': 'Magallanes',
    '16': 'Ñuble',
};

const REGION_CENTERS = {
    '1':  { lat: -18.4783, lng: -70.3126, zoom: 10 },
    '2':  { lat: -20.2133, lng: -70.1503, zoom: 9  },
    '3':  { lat: -23.6509, lng: -70.3975, zoom: 8  },
    '4':  { lat: -27.3668, lng: -70.3323, zoom: 8  },
    '5':  { lat: -29.9533, lng: -71.3394, zoom: 8  },
    '6':  { lat: -33.0472, lng: -71.6127, zoom: 8  },
    '7':  { lat: -33.4569, lng: -70.6483, zoom: 10 },
    '8':  { lat: -34.1708, lng: -70.7444, zoom: 9  },
    '9':  { lat: -35.4264, lng: -71.6554, zoom: 8  },
    '10': { lat: -37.4689, lng: -72.3527, zoom: 8  },
    '11': { lat: -38.9489, lng: -72.3311, zoom: 8  },
    '12': { lat: -40.2317, lng: -72.3311, zoom: 8  },
    '13': { lat: -41.8693, lng: -72.9318, zoom: 7  },
    '14': { lat: -45.5752, lng: -72.0662, zoom: 7  },
    '15': { lat: -53.1638, lng: -70.9171, zoom: 7  },
    '16': { lat: -36.6061, lng: -72.1027, zoom: 9  },
};

const App = () => {
    const [data, setData] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [zoom, setZoom] = useState(4);
    const [userLoc, setUserLoc] = useState({ lat: -53.1013, lng: -70.5444 });
    const [geoReady, setGeoReady] = useState(false);

    const successCallback = (position) => {
        setUserLoc({ lat: position.coords.latitude, lng: position.coords.longitude });
        setZoom(14);
        setGeoReady(true);
    };
    const errorCallback = (error) => { console.log(error); setGeoReady(true); };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, { timeout: 10000 });
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(urlEnTurno, { signal: controller.signal });
                const filtered = response.data.filter((spot) => spot.local_lat && spot.local_lng);
                setData(filtered);
                setIsLoading(false);
            } catch (error) {
                if (!axios.isCancel(error)) { setError(error); setIsLoading(false); }
            }
        };
        fetchData();
        return () => controller.abort();
    }, []);

    const filteredData = selectedRegion && data
        ? data.filter(s => s.fk_region === selectedRegion)
        : data;
    const counter = filteredData?.length ?? '-';

    const regionView = selectedRegion ? REGION_CENTERS[selectedRegion] : null;
    const mapCenter = regionView ? { lat: regionView.lat, lng: regionView.lng } : userLoc;
    const mapZoom = regionView ? regionView.zoom : zoom;

    return (
        <Grid
            templateAreas={`"header" "main" "footer"`}
            gridTemplateRows={'auto 1fr auto'}
            gridTemplateColumns={'1fr'}
            height='100dvh'
            fontWeight='bold'>

            <GridItem
                pl='4' pr='4' pt='3' pb='3'
                area={'header'}
                style={{ background: 'linear-gradient(135deg, #285E61, #2C7A7B)' }}>
                <Flex
                    align={{ base: 'flex-start', md: 'center' }}
                    justify='space-between'
                    direction={{ base: 'column', md: 'row' }}
                    gap='2'>
                    <Heading
                        fontSize={{ base: '22px', sm: '22px', md: '25px', lg: '30px' }}
                        color='white'
                        letterSpacing='-0.3px'>
                        Farmacias en turno Chile:{' '}
                        <span style={{ opacity: 0.85 }}>{isLoading ? '-' : counter}</span>
                    </Heading>
                    {!isLoading && !error && (
                        <Select
                            size='sm'
                            value={selectedRegion}
                            onChange={e => setSelectedRegion(e.target.value)}
                            bg='whiteAlpha.200'
                            color='white'
                            borderColor='whiteAlpha.400'
                            _hover={{ borderColor: 'whiteAlpha.600' }}
                            sx={{ '& option': { background: '#1D4044', color: 'white' } }}
                            maxW={{ base: 'full', md: '220px' }}
                            borderRadius='md'
                            fontWeight='600'
                            fontSize={{ base: '12px', md: '14px' }}>
                            <option value=''>Todas las regiones</option>
                            {Object.entries(REGIONS).map(([id, name]) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </Select>
                    )}
                </Flex>
            </GridItem>

            <GridItem area={'main'} overflow='hidden'>
                {!geoReady || isLoading ?
                    <Center width='100%' height='100%'>
                        <Spinner
                            height={{ base: '80px', md: '150px' }}
                            width={{ base: '80px', md: '150px' }}
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='teal.600'
                            size='xl' />
                    </Center> :
                    error ?
                    <Center width='100%' height='100%' px='4'>
                        <Text fontSize={{ base: 'md', md: 'larger' }} fontWeight='bold' textAlign='center' color='gray.600'>
                            No se pudo cargar la información. Intenta recargar la página.
                        </Text>
                    </Center> :
                    <Map spots={filteredData} center={mapCenter} zoom={mapZoom}/>
                }
            </GridItem>

            <GridItem
                pl='4' pr='4' pt='2' pb='2'
                area={'footer'}
                style={{ background: '#1D4044' }}>
                <HStack flexWrap='wrap' gap='1'>
                    <Text fontSize={{ base: '11px', md: '13px', lg: '15px' }} color='whiteAlpha.700'>
                        Desarrollado por{' '}
                        <Link
                            color='teal.200'
                            href='https://github.com/iwayato'
                            isExternal
                            rel='noopener noreferrer'
                            _hover={{ color: 'white' }}>
                            Tomoaki Iwaya Villalobos
                        </Link>
                    </Text>
                    <Text fontSize={{ base: '11px', md: '13px', lg: '15px' }} color='whiteAlpha.500'>
                        — {new Date().getFullYear()}
                    </Text>
                </HStack>
            </GridItem>
        </Grid>
    );
}

export default App;
