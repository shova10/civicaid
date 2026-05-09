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
    const timer = setTimeout(() => {
      try {
        if (map && map.getContainer()) {
          map.invalidateSize()
        }
      } catch {
        // map unmounted before timer fired — safe to ignore
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [map])
  return null
}
function FlyToCenter({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.2 })
    }
  }, [center, map])
  return null
}

export default function NepalMap({
  className = '',
  zoom = NEPAL_ZOOM,
  center = NEPAL_CENTER,
  children,
}) {
  return (
    <div
      className={`rounded-2xl overflow-hidden border border-slate-200 shadow-sm ${className}`}
      style={{ isolation: 'isolate' }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => {
          map.on('focus', () => map.scrollWheelZoom.enable())
          map.on('blur', () => map.scrollWheelZoom.disable())
        }}
      >
        <MapInvalidator />
        {center !== NEPAL_CENTER && <FlyToCenter center={center} />}
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
