import { useEffect, useState } from 'react'
import { supabase, TABLES } from './supabase'
import { SAMPLE_DOCTORS } from './data'

const withPrefix = (name = '') => (/^dr\.?\s/i.test(name.trim()) ? name.trim() : `Dr. ${name.trim()}`)

/**
 * Loads the doctor list from Supabase (table `Admin_Portal_User`: name, specialty).
 * Falls back to a small sample list so the booking UI is never empty.
 */
export function useDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingSample, setUsingSample] = useState(false)

  useEffect(() => {
    let active = true

    async function load() {
      if (!supabase) {
        if (active) {
          setDoctors(SAMPLE_DOCTORS.map((d) => ({ ...d, value: d.name })))
          setUsingSample(true)
          setLoading(false)
        }
        return
      }
      const { data, error } = await supabase.from(TABLES.doctors).select('name,specialty')
      if (!active) return
      if (error || !data || data.length === 0) {
        if (error) console.warn('Could not load doctors:', error.message)
        setDoctors(SAMPLE_DOCTORS.map((d) => ({ ...d, value: d.name })))
        setUsingSample(true)
      } else {
        setDoctors(
          data.map((d, i) => ({
            id: `${i}-${d.name}`,
            name: withPrefix(d.name),
            specialty: d.specialty,
            value: withPrefix(d.name),
          })),
        )
      }
      setLoading(false)
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return { doctors, loading, usingSample }
}
