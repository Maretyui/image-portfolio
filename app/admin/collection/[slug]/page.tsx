'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface Image {
  id: number
  title: string
  image_url: string
  width_span: number
  height_span: number
}

interface Collection {
  id: number
  name: string
  slug: string
  description: string
}

export default function CollectionAdminPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [collection, setCollection] = useState<Collection | null>(null)
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageTitle, setImageTitle] = useState('')
  const [widthSpan, setWidthSpan] = useState('1')
  const [heightSpan, setHeightSpan] = useState('1')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCollectionData()
  }, [slug])

  const fetchCollectionData = async () => {
    try {
      const collRes = await fetch(`/api/collections/${slug}`)
      if (!collRes.ok) throw new Error('Collection not found')
      const collData = await collRes.json()
      setCollection(collData)

      const imgRes = await fetch(`/api/collections/${slug}/images`)
      if (!imgRes.ok) throw new Error('Failed to fetch images')
      const imgData = await imgRes.json()
      setImages(imgData)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching data:', err)
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !collection) return

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('collectionId', collection.id.toString())
      formData.append('title', imageTitle || selectedFile.name)
      formData.append('width', widthSpan)
      formData.append('height', heightSpan)

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
      setWidthSpan('1')
      setHeightSpan('1')
      fetchCollectionData()
      setUploading(false)
    } catch (err) {
      setError('An error occurred')
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-gray-400">Loading...</p>
      </main>
    )
  }

  if (!collection) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-gray-400">Collection not found</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-2">{collection.name}</h1>
        <p className="text-gray-400 mb-8">{collection.description}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-700 rounded p-6">
              <h2 className="text-xl font-bold mb-6">Upload Image</h2>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full text-sm"
                    disabled={uploading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-white text-sm"
                    disabled={uploading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Width Span
                    </label>
                    <select
                      value={widthSpan}
                      onChange={(e) => setWidthSpan(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-white text-sm"
                      disabled={uploading}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Height Span
                    </label>
                    <select
                      value={heightSpan}
                      onChange={(e) => setHeightSpan(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-white text-sm"
                      disabled={uploading}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
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
            <h2 className="text-xl font-bold mb-4">Images</h2>

            {images.length === 0 ? (
              <p className="text-gray-400">No images in this collection yet</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square bg-gray-900 border border-gray-700 rounded overflow-hidden"
                  >
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
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
