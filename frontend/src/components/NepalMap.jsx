import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const NEPAL_CENTER = [28.3949, 84.124]
const NEPAL_ZOOM = 7

function MapInvalidator() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 300)
  }, [map])
  return null
}

/**
 * NepalMap
 * @param {string}  className   - additional Tailwind classes for the container
 * @param {number}  zoom        - initial zoom level (default 7)
 * @param {array}   center      - [lat, lng] (default Nepal center)
 * @param {node}    children    - Markers, Popups, etc. passed as children
 */
export default function NepalMap({
  className = '',
  zoom = NEPAL_ZOOM,
  center = NEPAL_CENTER,
  children,
}) {
  return (
    <div
      className={`rounded-2xl overflow-hidden border border-slate-200 shadow-sm ${className}`}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        // Prevent the map from stealing scroll on the page
        whenCreated={(map) => {
          map.on('focus', () => map.scrollWheelZoom.enable())
          map.on('blur', () => map.scrollWheelZoom.disable())
        }}
      >
        <MapInvalidator />

        {/* OpenStreetMap tile layer — free, no API key needed */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        {children}
      </MapContainer>
    </div>
  )
}
