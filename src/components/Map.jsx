import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { VStack, Text, Heading, Divider } from '@chakra-ui/react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

const corner1 = L.latLng(-11.011774, -102.208789);
const corner2 = L.latLng(-57.234297, -25.698563);
const bounds = L.latLngBounds(corner1, corner2);

const Map = ({ spots }) => {

    return (
        <MapContainer
            style={{ height: '100vh', width: '100vw' }}
            maxBounds={bounds}
            zoomControl={true}
            minZoom={4}
            dragging={true}
            center={[-34.135020, -71.565964]}
            zoom={4}
            scrollWheelZoom={true}>

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {
                spots.map((spot) =>
                    <Marker
                        key={spot.local_id}
                        position={[spot.local_lat, spot.local_lng]}>
                        <Tooltip
                            opacity={1}
                            direction='top'>
                            <VStack
                                spacing={3}
                                align='stretch'>
                                <Heading size='md' color='cadetblue'>{spot.local_nombre}</Heading>
                                <Divider></Divider>
                                <Text fontSize='sm' color='gray.1000'>{spot.local_direccion}</Text>
                                <Text fontSize='sm' color='gray.1000'>Hora apertura: {spot.funcionamiento_hora_apertura}</Text>
                                <Text fontSize='sm' color='gray.1000'>Hora cierre: {spot.funcionamiento_hora_cierre}</Text>
                                <Text fontSize='sm' color='gray.1000'>Teléfono: {spot.local_telefono}</Text>
                            </VStack>
                        </Tooltip>
                    </Marker>
                )
            }
        </MapContainer>
    );
}

export default Map;