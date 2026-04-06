import MarkerClusterGroup from 'react-leaflet-cluster'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { VStack, Text, Heading } from '@chakra-ui/react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import icon from "../assets/marker.png"

const pharmacyIcon = new L.Icon({
    iconUrl: icon,
    iconSize: [35, 35]
});
L.Marker.prototype.options.icon = pharmacyIcon;
const corner1 = L.latLng(-11.011774, -102.208789);
const corner2 = L.latLng(-57.234297, -25.698563);
const bounds = L.latLngBounds(corner1, corner2);


const Map = ({ spots, center, zoom }) => {
    
    return (
        <MapContainer
            style={{ height: '100%', width: '100%' }}
            maxBounds={bounds}
            zoomControl={true}
            minZoom={4}
            dragging={true}
            center={[center.lat, center.lng]}
            zoom={zoom}
            scrollWheelZoom={true}>

            <TileLayer url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' />

            <MarkerClusterGroup chunkedLoading>
                {
                    spots.map((spot) =>
                        <Marker
                            key={spot.local_id}
                            position={[parseFloat(spot.local_lat), parseFloat(spot.local_lng)]}>
                            <Popup>
                                <VStack
                                    spacing={2}
                                    align='stretch'
                                    minWidth='180px'>
                                    <Heading size='sm' color='cadetblue'>{spot.local_nombre}</Heading>
                                    <Text fontSize='sm'>{spot.local_direccion}</Text>
                                    <Text fontSize='sm'>Apertura: {spot.funcionamiento_hora_apertura.slice(0, -3)}</Text>
                                    <Text fontSize='sm'>Cierre: {spot.funcionamiento_hora_cierre.slice(0, -3)}</Text>
                                    <Text fontSize='sm'>Tel: {
                                            spot.local_telefono.length < 8 ? "Sin contacto" : spot.local_telefono
                                        }
                                    </Text>
                                </VStack>
                            </Popup>
                        </Marker>
                    )
                }
            </MarkerClusterGroup>
        </MapContainer>
    );
}

export default Map;