import { useState, useEffect } from 'react'

export function useAvatar(userId) {
  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    function load() {
      try {
        const raw = localStorage.getItem(`avatar_${userId}`)
        setAvatar(raw ? JSON.parse(raw) : null)
      } catch {
        setAvatar(null)
      }
    }
    load()
    window.addEventListener('avatar-updated', load)
    return () => window.removeEventListener('avatar-updated', load)
  }, [userId])

  return avatar
}
