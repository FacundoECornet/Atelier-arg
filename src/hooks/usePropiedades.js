import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../Firebase'

let cachedData = null

async function fetchAll() {
  const q = query(collection(db, 'propiedades'), orderBy('fechaIngreso', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export function usePropiedades() {
  const [propiedades, setPropiedades] = useState(cachedData ?? [])
  const [loading, setLoading] = useState(cachedData === null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cachedData !== null) return
    fetchAll()
      .then((data) => {
        cachedData = data
        setPropiedades(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Error al cargar las propiedades.')
        setLoading(false)
      })
  }, [])

  function refetch() {
    cachedData = null
    setLoading(true)
    setError(null)
    fetchAll()
      .then((data) => {
        cachedData = data
        setPropiedades(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Error al cargar las propiedades.')
        setLoading(false)
      })
  }

  return { propiedades, loading, error, refetch }
}
