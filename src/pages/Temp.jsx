'use client'
import { useState, useEffect } from 'react'
import { Trash2, MapPin, Loader, Calendar, Weight, Search } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { toast } from 'react-hot-toast'
import { GoogleGenerativeAI } from "@google/generative-ai"

// Make sure to set your Gemini API key in your environment variables
const geminiApiKey = import.meta.env.VITE_PUBLIC_GEMINI_API_KEY

export default function CollectPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredWasteType, setHoveredWasteType] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTask, setSelectedTask] = useState(null)
  const [verificationImage, setVerificationImage] = useState(null)
  const [verificationStatus, setVerificationStatus] = useState('idle')
  const [verificationResult, setVerificationResult] = useState(null)

  useEffect(() => {
    // Simulate fetching tasks from a database
    const fetchTasks = async () => {
      setLoading(true)
      try {
        // Simulated task data
        const fetchedTasks = [
          { id: 1, location: 'Location A', wasteType: 'Plastic', amount: 10, date: '2024-10-31', status: 'pending' },
          { id: 2, location: 'Location B', wasteType: 'Glass', amount: 5, date: '2024-10-31', status: 'pending' },
          // Add more simulated tasks as needed
        ]
        setTasks(fetchedTasks)
      } catch (error) {
        console.error('Error fetching tasks:', error)
        toast.error('Failed to load tasks. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleStatusChange = (taskId, newStatus) => {
    // Simulate status change
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
    toast.success('Task status updated successfully')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setVerificationImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const readFileAsBase64 = (dataUrl) => {
    return dataUrl.split(',')[1]
  }

  const handleVerify = async () => {
    if (!selectedTask || !verificationImage) {
      toast.error('Missing required information for verification.')
      return
    }

    setVerificationStatus('verifying')

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const base64Data = readFileAsBase64(verificationImage)

      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg',
          },
        },
      ]

      const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
        1. Confirm if the waste type matches: ${selectedTask.wasteType}
        2. Estimate if the quantity matches: ${selectedTask.amount}
        3. Your confidence level in this assessment (as a percentage)
        
        Respond in JSON format like this:
        {
          "wasteTypeMatch": true/false,
          "quantityMatch": true/false,
          "confidence": confidence level as a number between 0 and 1
        }`

      const result = await model.generateContent([prompt, ...imageParts])
      const response = await result.response
      const text = await response.text()

      try {
        const parsedResult = JSON.parse(text)
        setVerificationResult(parsedResult)
        setVerificationStatus('success')

        if (parsedResult.wasteTypeMatch && parsedResult.quantityMatch && parsedResult.confidence > 0.7) {
          handleStatusChange(selectedTask.id, 'verified')
          toast.success('Verification successful!', {
            duration: 5000,
            position: 'top-center',
          })
        } else {
          toast.error('Verification failed. The collected waste does not match the reported waste.', {
            duration: 5000,
            position: 'top-center',
          })
        }
      } catch (error) {
        console.error('Failed to parse JSON response:', text)
        setVerificationStatus('failure')
      }
    } catch (error) {
      console.error('Error verifying waste:', error)
      setVerificationStatus('failure')
    }
  }

  const filteredTasks = tasks.filter(task =>
    task.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pageCount = Math.ceil(filteredTasks.length / 5)
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * 5,
    currentPage * 5
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Waste Collection Tasks</h1>
      
      <div className="mb-4 flex items-center">
        <Input
          type="text"
          placeholder="Search by area..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-2"
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-gray-500" />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedTasks.map(task => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-medium text-gray-800 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                    {task.location}
                  </h2>
                  <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold ${task.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {task.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center relative">
                    <Trash2 className="w-4 h-4 mr-2 text-gray-500" />
                    <span 
                      onMouseEnter={() => setHoveredWasteType(task.wasteType)}
                      onMouseLeave={() => setHoveredWasteType(null)}
                      className="cursor-pointer"
                    >
                      {task.wasteType.length > 8 ? `${task.wasteType.slice(0, 8)}...` : task.wasteType}
                    </span>
                    {hoveredWasteType === task.wasteType && (
                      <div className="absolute left-0 top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                        {task.wasteType}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Weight className="w-4 h-4 mr-2 text-gray-500" />
                    {task.amount} kg
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    {new Date(task.date).toLocaleDateString()}
                  </div>
                </div>
                <Button
                  onClick={() => handleStatusChange(task.id, task.status === 'pending' ? 'in-progress' : 'pending')}
                  className="mr-2"
                >
                  {task.status === 'pending' ? 'Start Collection' : 'Reset Collection'}
                </Button>
                <Button onClick={() => setSelectedTask(task)}>Verify Waste</Button>
              </div>
            ))}
          </div>

          {selectedTask && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-300">
              <h3 className="text-lg font-semibold">Verify Waste for: {selectedTask.wasteType}</h3>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
              {verificationImage && (
                <img src={verificationImage} alt="Verification" className="mb-4 h-48 object-cover" />
              )}
              <Button onClick={handleVerify} disabled={verificationStatus === 'verifying'}>
                {verificationStatus === 'verifying' ? 'Verifying...' : 'Verify Waste'}
              </Button>
              {verificationStatus === 'success' && (
                <div className="mt-2 text-green-600">Verification successful! Results: {JSON.stringify(verificationResult)}</div>
              )}
              {verificationStatus === 'failure' && (
                <div className="mt-2 text-red-600">Verification failed. Please try again.</div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))} disabled={currentPage === pageCount}>
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
