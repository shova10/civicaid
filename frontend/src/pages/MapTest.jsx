import NepalMap from '../components/NepalMap'

export default function MapTest() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Map Test</h1>
        <p className="text-sm text-slate-400 mb-5">
          You should see a map of Nepal below. Zoom and pan should work.
        </p>

        <NepalMap className="h-125 " />

        <p className="text-xs text-slate-300 mt-3 text-center">
          Tiles © OpenStreetMap contributors
        </p>
      </div>
    </div>
  )
}
