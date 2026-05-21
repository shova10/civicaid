import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { MapPin, Upload, X, ImageIcon, AlertCircle, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { submitIssue } from '../services/issues'

const SubmitIssue = () => {
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [location, setLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const fileInputRef = useRef(null)
  const [locationMode, setLocationMode] = useState(null)
  const [manualAddress, setManualAddress] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [locationDetails, setLocationDetails] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm()

  const navigate = useNavigate()
  const [locationName, setLocationName] = useState(null)

  // ── Image ───────────────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (event) => setImagePreview(event.target.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Location ────────────────────────────────────────────────────────────────
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      return
    }
    setLocating(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        setLocation({ latitude, longitude })

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&zoom=18`,
            { headers: { 'Accept-Language': 'en' } }
          )
          const data = await res.json()
          const a = data.address || {}

          const details = {
            houseNumber: a.house_number || '',
            road: a.road || a.pedestrian || a.footway || a.path || '',
            quarter: a.quarter || a.neighbourhood || a.suburb || '',
            ward: a.ward || '',
            city: a.city || a.town || a.village || a.municipality || '',
            district: a.county || a.state_district || '',
            accuracy: Math.round(accuracy),
          }
          setLocationDetails(details)

          const parts = [
            details.houseNumber && `${details.houseNumber},`,
            details.road,
            details.quarter,
            details.ward && `Ward: ${details.ward}`,
            details.city,
          ].filter(Boolean)

          const place = parts.length
            ? parts.join(', ')
            : data.display_name?.split(',').slice(0, 3).join(',')
          setLocationName(place)
          toast.success(`Location captured (±${details.accuracy}m)`)
        } catch {
          setLocationName(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
          toast.success('Location captured')
        }
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        let message = 'Could not get location'
        if (err.code === err.PERMISSION_DENIED)
          message =
            'Location permission denied. Please allow location access in browser settings.'
        else if (err.code === err.POSITION_UNAVAILABLE)
          message = 'Location unavailable. Try again.'
        else if (err.code === err.TIMEOUT)
          message = 'Location request timed out. Try again.'
        setLocationError(message)
        toast.error(message)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }

  const searchTimeout = useRef(null)

  const handleAddressInput = (e) => {
    const value = e.target.value
    setManualAddress(value)
    setSuggestions([])

    if (value.trim().length < 3) return

    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=7&addressdetails=1&countrycodes=np&accept-language=en`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        setSuggestions(data)
      } catch {
        // silently fail
      }
    }, 400)
  }

  const handleSelectSuggestion = async (item) => {
    const lat = parseFloat(item.lat)
    const lon = parseFloat(item.lon)
    setLocation({ latitude: lat, longitude: lon })

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=18`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      const a = data.address || {}
      const details = {
        houseNumber: a.house_number || '',
        road: a.road || a.pedestrian || a.footway || '',
        quarter: a.quarter || a.neighbourhood || a.suburb || '',
        ward: a.ward || '',
        city: a.city || a.town || a.village || a.municipality || '',
        district: a.county || a.state_district || '',
        accuracy: null,
      }
      setLocationDetails(details)
      const parts = [
        details.houseNumber,
        details.road,
        details.quarter,
        details.ward && `Ward: ${details.ward}`,
        details.city,
      ].filter(Boolean)
      const place = parts.length
        ? parts.join(', ')
        : item.display_name.split(',').slice(0, 3).join(',')
      setLocationName(place)
    } catch {
      setLocationDetails(null)
      setLocationName(item.display_name.split(',').slice(0, 3).join(','))
    }
    setSuggestions([])
    toast.success('Address selected!')
  }

  const resetLocation = () => {
    setLocation(null)
    setLocationName(null)
    setLocationError(null)
    setLocationDetails(null)
    setManualAddress('')
    setLocationMode(null)
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleFormSubmit = async (data) => {
    if (!imageFile) {
      toast.error('Please attach a photo of the issue')
      return
    }
    if (!location) {
      toast.error('Please capture your location')
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('image', imageFile)
      formData.append('location_lat', location.latitude)
      formData.append('location_lng', location.longitude)
      formData.append('location_name', locationName || '')
      formData.append('location_details', JSON.stringify(locationDetails || {}))

      const result = await submitIssue(formData)

      if (result?.is_duplicate) {
        toast('Issue submitted — AI detected it may be a duplicate.', {
          icon: '⚠️',
          duration: 5000,
        })
      } else {
        toast.success('Issue submitted successfully!')
      }

      reset()
      removeImage()
      setLocation(null)
      setLocationError(null)
      navigate('/issues')
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Submission failed. Try again.'
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F1E8] font-sans">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
        {/* ── Page Header ── */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-indigo-700">
            <span className="inline-block w-5 h-0.5 bg-amber-400 rounded" />
            Citizens
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1C1A17] tracking-tight mb-2">
            Report an Issue
          </h1>
          <p className="text-sm font-medium text-[#6B665E]">
            Help improve your community
          </p>
        </div>

        {/* ── Tip Banner ── */}
        <div className="flex items-start gap-3 bg-[#FFFDF9] border border-[#E7DED1] rounded-3xl px-5 py-4 mb-6 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
            <Info size={15} className="text-indigo-700" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#1C1A17]">
              Help us resolve your issue faster
            </p>
            <p className="text-xs text-[#6B665E] leading-relaxed">
              Adding a{' '}
              <span className="font-semibold text-[#1C1A17]">photo</span> and
              your{' '}
              <span className="font-semibold text-[#1C1A17]">location</span>{' '}
              helps our team identify and fix problems more quickly. Reports
              with both details are prioritized.
            </p>
          </div>
        </div>

        {/* ── Form Card ── */}
        <div className="bg-[#FFFDF9] border border-[#E7DED1] rounded-3xl shadow-[0_2px_10px_rgba(15,23,42,0.04)] p-6 sm:p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B665E] block mb-2">
                Issue Title <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Broken streetlight on main road"
                className={`w-full px-4 py-3 border rounded-2xl text-sm text-[#1C1A17] bg-[#F6F1E8] outline-none transition-all duration-200
                  placeholder:text-[#B0A898]
                  focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300
                  hover:border-[#D8CCBC]
                  ${errors.title ? 'border-red-300 focus:ring-red-200' : 'border-[#E7DED1]'}`}
                {...register('title', {
                  required: 'Title is required',
                  minLength: {
                    value: 5,
                    message: 'Title must be at least 5 characters',
                  },
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B665E] block mb-2">
                Description <span className="text-amber-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Describe the issue in detail — what happened, severity, and who is affected..."
                className={`w-full px-4 py-3 border rounded-2xl text-sm text-[#1C1A17] bg-[#F6F1E8] outline-none transition-all duration-200
                  placeholder:text-[#B0A898] resize-none
                  focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300
                  hover:border-[#D8CCBC]
                  ${errors.description ? 'border-red-300 focus:ring-red-200' : 'border-[#E7DED1]'}`}
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 20,
                    message: 'Please describe in at least 20 characters',
                  },
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.description.message}
                </p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B665E] block mb-2">
                Photo <span className="text-amber-500">*</span>
              </label>

              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group border-2 border-dashed border-[#D8CCBC] rounded-3xl p-8 text-center cursor-pointer
                    hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200 active:scale-[0.99] bg-[#F6F1E8]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#EFE6DA] flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-100 transition-colors">
                    <ImageIcon
                      size={22}
                      className="text-[#B0A898] group-hover:text-indigo-500 transition-colors"
                    />
                  </div>
                  <p className="text-sm font-bold text-[#6B665E] group-hover:text-[#1C1A17] transition-colors">
                    Click to upload image
                  </p>
                  <p className="text-xs text-[#B0A898] mt-1">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border border-[#E7DED1] group">
                  <img
                    src={imagePreview}
                    alt="Issue preview"
                    className="w-full max-h-64 object-cover block transition-transform duration-200 group-hover:scale-[1.01]"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-black/50 hover:bg-black/70
                      text-white p-1.5 rounded-full transition-colors shadow-md"
                  >
                    <X size={14} />
                  </button>
                  <div className="absolute bottom-3 left-3 max-w-[80%] bg-black/50 text-white text-xs px-2.5 py-1 rounded-xl backdrop-blur-sm truncate">
                    {imageFile?.name}
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B665E] block mb-2">
                Location <span className="text-amber-500">*</span>
              </label>

              {/* Mode picker */}
              {!locationMode && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLocationMode('auto')}
                    className="group flex items-center justify-center gap-2 px-4 py-3
                      border border-[#E7DED1] rounded-2xl text-sm font-bold text-[#6B665E]
                      bg-[#F6F1E8] hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700
                      transition-all active:scale-[0.99]"
                  >
                    <MapPin
                      size={16}
                      className="group-hover:text-indigo-500 transition-colors"
                    />
                    Use My Location
                  </button>

                  <button
                    type="button"
                    onClick={() => setLocationMode('manual')}
                    className="group flex items-center justify-center gap-2 px-4 py-3
                      border border-[#E7DED1] rounded-2xl text-sm font-bold text-[#6B665E]
                      bg-[#F6F1E8] hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700
                      transition-all active:scale-[0.99]"
                  >
                    ✏️ Enter Address
                  </button>
                </div>
              )}

              {/* AUTO MODE */}
              {locationMode === 'auto' && !location && (
                <div className="flex items-center justify-between bg-[#F6F1E8] border border-[#E7DED1] rounded-2xl px-4 py-3">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold
                      bg-indigo-700 text-white hover:bg-indigo-800 disabled:opacity-60 transition-all"
                  >
                    <MapPin size={15} />
                    {locating ? 'Detecting location…' : 'Detect Now'}
                  </button>
                  <button
                    type="button"
                    onClick={resetLocation}
                    className="text-xs text-[#B0A898] hover:text-red-500 underline transition"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* MANUAL MODE */}
              {locationMode === 'manual' && !location && (
                <div className="relative space-y-2">
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={handleAddressInput}
                    placeholder="Start typing an address…"
                    className="w-full px-4 py-3 border border-[#E7DED1] rounded-2xl text-sm text-[#1C1A17]
                      bg-[#F6F1E8] placeholder:text-[#B0A898]
                      focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:outline-none transition-all"
                  />

                  {suggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1">
                      <ul className="bg-[#FFFDF9] border border-[#E7DED1] rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.10)] overflow-hidden">
                        {suggestions.map((item) => {
                          const a = item.address || {}
                          const road = a.road || a.pedestrian || a.footway || ''
                          const ward = a.ward || ''
                          const quarter =
                            a.quarter || a.neighbourhood || a.suburb || ''
                          const city =
                            a.city ||
                            a.town ||
                            a.village ||
                            a.municipality ||
                            ''
                          const district = a.county || a.state_district || ''

                          const primaryLine =
                            [road, quarter].filter(Boolean).join(', ') ||
                            item.display_name.split(',')[0]

                          const secondaryLine = [
                            ward && `Ward ${ward}`,
                            city,
                            district,
                          ]
                            .filter(Boolean)
                            .join(', ')

                          return (
                            <li
                              key={item.place_id}
                              onClick={() => handleSelectSuggestion(item)}
                              className="px-4 py-3 cursor-pointer border-b border-[#F0EBE3] last:border-0
                                hover:bg-[#F6F1E8] transition-colors group"
                            >
                              <div className="flex items-start gap-2">
                                <MapPin
                                  size={14}
                                  className="text-indigo-400 mt-0.5 flex-shrink-0 group-hover:text-indigo-600 transition-colors"
                                />
                                <div className="min-w-0">
                                  <p className="text-sm text-[#1C1A17] font-semibold truncate">
                                    {primaryLine}
                                  </p>
                                  {secondaryLine && (
                                    <p className="text-xs text-[#B0A898] truncate mt-0.5">
                                      {secondaryLine}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={resetLocation}
                      className="text-xs text-[#B0A898] hover:text-red-500 underline transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Location confirmed */}
              {location && (
                <div className="border border-emerald-200 bg-emerald-50/60 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-emerald-700 font-bold">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <MapPin size={13} className="text-emerald-600" />
                    </div>
                    <span className="truncate">
                      ✓ {locationName || 'Location selected'}
                    </span>
                    <button
                      type="button"
                      onClick={resetLocation}
                      className="ml-auto text-xs text-[#B0A898] hover:text-red-500 underline whitespace-nowrap font-normal"
                    >
                      Remove
                    </button>
                  </div>

                  {locationDetails && (
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      {locationDetails.road && (
                        <div className="bg-white rounded-xl px-3 py-2 border border-emerald-100">
                          <span className="text-[#B0A898] block">Road</span>
                          <span className="font-semibold text-[#1C1A17]">
                            {locationDetails.road}
                          </span>
                        </div>
                      )}
                      {locationDetails.quarter && (
                        <div className="bg-white rounded-xl px-3 py-2 border border-emerald-100">
                          <span className="text-[#B0A898] block">Area</span>
                          <span className="font-semibold text-[#1C1A17]">
                            {locationDetails.quarter}
                          </span>
                        </div>
                      )}
                      {locationDetails.ward && (
                        <div className="bg-white rounded-xl px-3 py-2 border border-emerald-100">
                          <span className="text-[#B0A898] block">Ward No.</span>
                          <span className="font-semibold text-[#1C1A17]">
                            {locationDetails.ward}
                          </span>
                        </div>
                      )}
                      {locationDetails.city && (
                        <div className="bg-white rounded-xl px-3 py-2 border border-emerald-100">
                          <span className="text-[#B0A898] block">
                            Municipality
                          </span>
                          <span className="font-semibold text-[#1C1A17]">
                            {locationDetails.city}
                          </span>
                        </div>
                      )}
                      {typeof locationDetails.accuracy === 'number' && (
                        <div className="col-span-2 bg-white rounded-xl px-3 py-2 border border-emerald-100">
                          <span className="text-[#B0A898]">GPS Accuracy: </span>
                          <span
                            className={`font-semibold ${
                              locationDetails.accuracy < 20
                                ? 'text-emerald-600'
                                : locationDetails.accuracy < 50
                                  ? 'text-amber-600'
                                  : 'text-red-500'
                            }`}
                          >
                            ±{locationDetails.accuracy}m{' '}
                            {locationDetails.accuracy < 20
                              ? '(Excellent)'
                              : locationDetails.accuracy < 50
                                ? '(Good)'
                                : '(Low — try again outdoors)'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {locationDetails && !locationDetails.ward && (
                    <div className="mt-1">
                      <input
                        type="text"
                        placeholder="Ward number not detected — enter manually (optional)"
                        className="w-full px-3 py-2 text-xs border border-[#E7DED1] rounded-xl bg-[#F6F1E8]
                          placeholder:text-[#B0A898] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        onChange={(e) =>
                          setLocationDetails((prev) => ({
                            ...(prev || {}),
                            ward: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}
                </div>
              )}

              {locationError && (
                <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 rounded-2xl border border-red-200">
                  <AlertCircle
                    size={14}
                    className="text-red-400 mt-0.5 shrink-0"
                  />
                  <p className="text-xs text-red-600 leading-relaxed">
                    {locationError}
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300
                text-[#1C1A17] font-bold rounded-full flex items-center justify-center gap-2
                transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <Upload size={17} className="shrink-0" />
              <span>{isSubmitting ? 'Submitting…' : 'Submit Issue'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitIssue
