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
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false)
  const [suggestions, setSuggestions] = useState([])

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
        const { latitude, longitude } = pos.coords
        setLocation({ latitude, longitude })

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          )
          const data = await res.json()
          const place =
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.village ||
            data.address?.town ||
            data.address?.city ||
            data.address?.county ||
            data.display_name?.split(',')[0] ||
            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          setLocationName(place)
          toast.success(`Location captured: ${place}`)
        } catch {
          setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
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
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        setSuggestions(data)
      } catch {
        // silently fail
      }
    }, 400)
  }

  const handleSelectSuggestion = (item) => {
    setLocation({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    })
    setLocationName(item.display_name.split(',').slice(0, 3).join(','))
    setManualAddress(item.display_name.split(',').slice(0, 3).join(','))
    setSuggestions([])
    toast.success('Address selected!')
  }

  const resetLocation = () => {
    setLocation(null)
    setLocationName(null)
    setLocationError(null)
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
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Report an Issue</h1>
          <p className="text-slate-500 mt-1">Help improve your community</p>
        </div>

        {/* Citizen tip banner */}
        <div
          className="flex items-start gap-3 bg-blue-50 border border-blue-200
          rounded-2xl px-5 py-4 mb-6"
        >
          <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800 mb-0.5">
              Help us resolve your issue faster
            </p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Adding a <span className="font-semibold">photo</span> and your{' '}
              <span className="font-semibold">location</span> helps our team
              identify and fix the problem quickly. Issues with both are
              prioritized and resolved sooner.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Issue Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Broken streetlight on main road"
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2
                  focus:ring-blue-500/20 focus:outline-none
                  ${errors.title ? 'border-red-400' : 'border-slate-200'}`}
                {...register('title', {
                  required: 'Title is required',
                  minLength: {
                    value: 5,
                    message: 'Title must be at least 5 characters',
                  },
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Description *
              </label>
              <textarea
                rows={4}
                placeholder="Describe the issue in detail — what happened, how severe it is, who is affected..."
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2
                  focus:ring-blue-500/20 focus:outline-none resize-none
                  ${errors.description ? 'border-red-400' : 'border-slate-200'}`}
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 20,
                    message: 'Please describe in at least 20 characters',
                  },
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Photo <span className="text-red-500">*</span>
              </label>
              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8
                    text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50
                    transition-colors"
                >
                  <ImageIcon
                    className="mx-auto text-slate-400 mb-2"
                    size={28}
                  />
                  <p className="text-sm text-slate-500 font-medium">
                    Click to upload image
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={imagePreview}
                    alt="Issue preview"
                    className="w-full max-h-64 object-cover block"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600
                      text-white p-1.5 rounded-full transition-colors shadow-md"
                  >
                    <X size={14} />
                  </button>
                  <div
                    className="absolute bottom-2 left-2 bg-black/50 text-white
                    text-xs px-2 py-1 rounded-lg backdrop-blur-sm"
                  >
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
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Location <span className="text-red-500">*</span>
              </label>

              {/* Mode toggle — only shown before a mode is chosen */}
              {!locationMode && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setLocationMode('auto')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
          border border-slate-200 rounded-xl text-sm font-medium
          hover:bg-blue-50 hover:border-blue-300 text-slate-600 transition-colors"
                  >
                    <MapPin size={16} /> Use My Location
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationMode('manual')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
          border border-slate-200 rounded-xl text-sm font-medium
          hover:bg-blue-50 hover:border-blue-300 text-slate-600 transition-colors"
                  >
                    ✏️ Enter Address
                  </button>
                </div>
              )}

              {/* AUTO mode */}
              {locationMode === 'auto' && !location && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locating}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200
          rounded-xl text-sm font-medium hover:bg-slate-50 text-slate-600
          transition-colors disabled:opacity-60"
                  >
                    <MapPin size={16} />
                    {locating ? 'Detecting location…' : 'Detect Now'}
                  </button>
                  <button
                    type="button"
                    onClick={resetLocation}
                    className="text-xs text-slate-400 hover:text-red-500 underline"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* MANUAL mode */}
              {/* MANUAL mode */}
              {locationMode === 'manual' && !location && (
                <div className="relative space-y-2">
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={handleAddressInput}
                    placeholder="Start typing an address…"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl
        text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                  {suggestions.length > 0 && (
                    <ul
                      className="absolute z-10 w-full mt-1 bg-white border border-slate-200
        rounded-xl shadow-lg overflow-hidden"
                    >
                      {suggestions.map((item) => (
                        <li
                          key={item.place_id}
                          onClick={() => handleSelectSuggestion(item)}
                          className="px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50
              cursor-pointer border-b border-slate-100 last:border-0 truncate"
                        >
                          📍 {item.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    onClick={resetLocation}
                    className="text-xs text-slate-400 hover:text-red-500 underline"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Confirmed location (both modes) */}
              {location && (
                <div
                  className="flex items-center gap-2 px-4 py-2.5 border border-green-300
      bg-green-50 rounded-xl text-sm text-green-700 font-medium"
                >
                  <MapPin size={16} className="text-green-600 shrink-0" />
                  <span className="truncate">✓ {locationName}</span>
                  <button
                    type="button"
                    onClick={resetLocation}
                    className="ml-auto text-xs text-slate-400 hover:text-red-500 underline whitespace-nowrap"
                  >
                    Remove
                  </button>
                </div>
              )}

              {locationError && (
                <div
                  className="mt-2 flex items-start gap-2 p-2.5 bg-red-50
      rounded-xl border border-red-200"
                >
                  <AlertCircle
                    size={13}
                    className="text-red-400 mt-0.5 shrink-0"
                  />
                  <p className="text-xs text-red-600">{locationError}</p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                text-white font-semibold rounded-xl flex items-center justify-center gap-2
                transition-colors"
            >
              <Upload size={18} />
              {isSubmitting ? 'Submitting…' : 'Submit Issue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitIssue
