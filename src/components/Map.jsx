import { useState, useEffect, useRef } from 'react';
import MarkerClusterGroup from 'react-leaflet-cluster'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import {
    useBreakpointValue,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Box,
    Text,
    Badge,
} from '@chakra-ui/react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import "./popup.css";
import icon from "../assets/marker.png"

const FlyToController = ({ center, zoom }) => {
    const map = useMap();
    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) { mounted.current = true; return; }
        map.flyTo([center.lat, center.lng], zoom, { duration: 1.2 });
    }, [center.lat, center.lng, zoom]);
    return null;
};

const pharmacyIcon = new L.Icon({
    iconUrl: icon,
    iconSize: [35, 35]
});
L.Marker.prototype.options.icon = pharmacyIcon;
const corner1 = L.latLng(-11.011774, -102.208789);
const corner2 = L.latLng(-57.234297, -25.698563);
const bounds = L.latLngBounds(corner1, corner2);

const toAmPm = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
};

const formatTurnDate = (fecha, dia) => {
    if (!fecha) return null;
    const [year, month, day] = fecha.split('-').map(Number);
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const dayName = dia ? dia.charAt(0).toUpperCase() + dia.slice(1) : '';
    return `${dayName}, ${day} de ${months[month - 1]} de ${year}`;
};

const formatSchedule = (apertura, cierre) => {
    const open = toAmPm(apertura);
    const close = toAmPm(cierre);
    if (!open || !close) return "No disponible";
    const [hOpen] = apertura.split(':').map(Number);
    const [hClose] = cierre.split(':').map(Number);
    const [, mClose] = cierre.split(':').map(Number);
    if (hClose < hOpen || (hClose === hOpen && mClose < apertura.split(':').map(Number)[1])) {
        return `${open} → ${close} (día sig.)`;
    }
    return `${open} – ${close}`;
};

const getPhoneInfo = (value) => {
    if (!value) return null;

    // Strip text annotations like "anexo 5499"
    const raw = value.trim().split(/\s+/)[0];
    let digits = raw.replace(/\D/g, '');

    // Strip +56 country code prefix, handling duplicates (+5656...)
    while (digits.startsWith('56') && digits.length > 7) digits = digits.slice(2);
    // Strip trunk prefix 0
    if (digits.startsWith('0')) digits = digits.slice(1);

    if (digits.length < 7 || digits.length > 9) return null;

    if (digits.length === 9) {
        if (digits.startsWith('9'))
            return { number: `+56 9 ${digits.slice(1, 5)} ${digits.slice(5)}`, label: 'Celular', icon: '📱' };
        if (digits.startsWith('2'))
            return { number: `+56 2 ${digits.slice(1, 5)} ${digits.slice(5)}`, label: 'Teléfono fijo', icon: '📞' };
        return { number: `+56 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`, label: 'Teléfono fijo', icon: '📞' };
    }

    if (digits.length === 8) {
        // Móvil antiguo pre-reforma (prefijos 8 o 9)
        if (digits.startsWith('9') || digits.startsWith('8'))
            return { number: `+56 ${digits[0]} ${digits.slice(1, 5)} ${digits.slice(5)}`, label: 'Celular', icon: '📱' };
        if (digits.startsWith('2'))
            return { number: `+56 2 ${digits.slice(1, 5)} ${digits.slice(5)}`, label: 'Teléfono fijo', icon: '📞' };
        return { number: `+56 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`, label: 'Teléfono fijo', icon: '📞' };
    }

    // 7 dígitos: formato pre-reforma 2013, solo Santiago (empieza con 2)
    if (digits.startsWith('2'))
        return { number: `+56 2 ${digits.slice(1, 4)} ${digits.slice(4)}`, label: 'Teléfono fijo', icon: '📞' };

    return null;
};

const PopupRow = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <span style={{ fontSize: '14px', lineHeight: '1.4', flexShrink: 0 }}>{icon}</span>
        <div style={{ fontSize: '13px', lineHeight: '1.4', color: '#2D3748' }}>
            <span style={{ color: '#718096', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                {label}
            </span>
            <div style={{ marginTop: '1px' }}>{value}</div>
        </div>
    </div>
);

const PharmacyHeader = ({ spot }) => (
    <div style={{
        background: 'linear-gradient(135deg, #285E61, #2C7A7B)',
        padding: '14px 16px',
        paddingRight: '40px',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <div style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: '20px',
            }}>
                En turno
            </div>
            {spot.comuna_nombre && (
                <div style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '10px',
                    fontWeight: '600',
                    letterSpacing: '0.3px',
                    padding: '2px 8px',
                    borderRadius: '20px',
                }}>
                    {spot.comuna_nombre.charAt(0) + spot.comuna_nombre.slice(1).toLowerCase()}
                </div>
            )}
        </div>
        <div style={{
            color: 'white',
            fontWeight: '700',
            fontSize: '14px',
            lineHeight: '1.3',
        }}>
            {spot.local_nombre}
        </div>
    </div>
);

const PharmacyBody = ({ spot }) => {
    const turnDate = formatTurnDate(spot.fecha, spot.funcionamiento_dia);
    const phone = getPhoneInfo(spot.local_telefono);
    return (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'white' }}>
            {turnDate && (
                <>
                    <PopupRow icon="📅" label="Turno" value={turnDate} />
                    <div style={{ borderTop: '1px solid #EDF2F7' }} />
                </>
            )}
            <PopupRow icon="📍" label="Dirección" value={spot.local_direccion} />
            <div style={{ borderTop: '1px solid #EDF2F7' }} />
            <PopupRow icon="🕐" label="Horario"
                value={formatSchedule(spot.funcionamiento_hora_apertura, spot.funcionamiento_hora_cierre)} />
            <div style={{ borderTop: '1px solid #EDF2F7' }} />
            {phone
                ? <PopupRow icon={phone.icon} label={phone.label} value={phone.number} />
                : <PopupRow icon="📞" label="Teléfono" value="Sin contacto" />}
        </div>
    );
};

const Map = ({ spots, center, zoom }) => {
    const [selectedSpot, setSelectedSpot] = useState(null);
    const isMobile = useBreakpointValue({ base: true, md: false });

    const handleMarkerClick = (spot) => {
        if (isMobile) setSelectedSpot(spot);
    };

    return (
        <>
            <MapContainer
                style={{ height: '100%', width: '100%' }}
                maxBounds={bounds}
                zoomControl={true}
                minZoom={4}
                dragging={true}
                center={[center.lat, center.lng]}
                zoom={zoom}
                scrollWheelZoom={true}>

                <FlyToController center={center} zoom={zoom} />
                <TileLayer url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' />

                <MarkerClusterGroup chunkedLoading>
                    {spots.map((spot) =>
                        <Marker
                            key={spot.local_id}
                            position={[parseFloat(spot.local_lat), parseFloat(spot.local_lng)]}
                            eventHandlers={{ click: () => handleMarkerClick(spot) }}>
                            {!isMobile && (
                                <Popup className="pharmacy-popup">
                                    <PharmacyHeader spot={spot} />
                                    <PharmacyBody spot={spot} />
                                </Popup>
                            )}
                        </Marker>
                    )}
                </MarkerClusterGroup>
            </MapContainer>

            <Drawer
                isOpen={!!selectedSpot && isMobile}
                placement="bottom"
                onClose={() => setSelectedSpot(null)}
                autoFocus={false}>
                <DrawerOverlay />
                <DrawerContent borderTopRadius="16px" overflow="hidden" maxH="70vh">
                    <DrawerCloseButton
                        color="white"
                        zIndex="1"
                        top="10px"
                        right="12px" />
                    {selectedSpot && (
                        <>
                            <PharmacyHeader spot={selectedSpot} />
                            <Box overflowY="auto">
                                <PharmacyBody spot={selectedSpot} />
                            </Box>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default Map;
