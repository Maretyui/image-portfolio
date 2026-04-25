'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface PortfolioImage {
  id: number
  title: string | null
  image_url: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [images, setImages] = useState<PortfolioImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageTitle, setImageTitle] = useState('')
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/images')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setImages(data)
    } catch (err) {
      console.error('Error fetching images:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', imageTitle || selectedFile.name)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Upload failed')
        setUploading(false)
        return
      }

      setSelectedFile(null)
      setImageTitle('')
      ;(document.getElementById('file-input') as HTMLInputElement).value = ''
      fetchImages()
    } catch (err) {
      setError('An error occurred')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/images/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id))
      }
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-700 rounded p-6">
              <h2 className="text-xl font-bold mb-6">Upload Image</h2>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Image File</label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-300"
                    disabled={uploading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Title (optional)</label>
                  <input
                    type="text"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-white text-sm"
                    disabled={uploading}
                  />
                </div>

                {error && (
                  <div className="bg-red-900 border border-red-700 text-red-100 px-3 py-2 rounded text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="w-full bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">
              Images{' '}
              <span className="text-gray-500 font-normal text-base">({images.length})</span>
            </h2>

            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : images.length === 0 ? (
              <p className="text-gray-500">No images uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square bg-gray-900 border border-gray-700 rounded overflow-hidden"
                  >
                    <img
                      src={image.image_url}
                      alt={image.title || ''}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-2">
                      <div className="text-xs text-gray-300">
                        <p className="font-medium truncate">{image.title || '—'}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(image.id)}
                        disabled={deletingId === image.id}
                        className="self-end px-2 py-1 bg-red-700 hover:bg-red-600 text-white text-xs rounded disabled:opacity-50 transition"
                      >
                        {deletingId === image.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
