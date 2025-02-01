import React from 'react';
import { useState } from 'react';
import {MapContainer, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function Map() {
    const [location, setLocation] = useState({ 
        lat: 19.0760, 
        lng: 72.8777,
      });

    return (
        <>
            <div style={{ height: "500px", width: "100%", border: '1px solid #ccc' }}>
                <MapContainer 
                  center={[ location.lat, location.lng ]} 
                  zoom={13} 
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </MapContainer>
            </div>
        </>
    )
}

export default Map
