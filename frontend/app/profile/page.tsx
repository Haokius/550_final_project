'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserProfile, getSavedCompanies, removeCompany } from '@/utils/api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface UserProfile {
  username: string;
  email: string;
  createdAt: string;
}

interface SavedCompany {
  id: string;
  name: string;
  ticker: string;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [companies, setCompanies] = useState<SavedCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const [profileData, companiesData] = await Promise.all([
          getUserProfile(),
          getSavedCompanies()
        ])
        console.log('Profile Data:', profileData) // Debug log
        console.log('Companies Data:', companiesData) // Debug log
        setProfile(profileData)
        setCompanies(companiesData)
      } catch (err: any) {
        console.error('Error details:', err) // Debug log
        setError(err.response?.data?.message || 'Failed to load profile data')
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleRemoveCompany = async (companyId: string) => {
    try {
      await removeCompany(companyId)
      setCompanies(companies.filter(company => company.id !== companyId))
    } catch (err: any) {
      console.error('Error removing company:', err)
      setError(err.response?.data?.message || 'Failed to remove company')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-12 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-500">{error}</div>
            <Button 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {profile && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${profile.username}`} alt={profile.username} />
                  <AvatarFallback>{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{profile.username}</h2>
                  <p className="text-gray-500">{profile.email}</p>
                  <p className="text-sm text-gray-400">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Saved Companies</h3>
                {companies.length > 0 ? (
                  <ul className="space-y-2">
                    {companies.map((company) => (
                      <li key={company.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span>{company.name} ({company.ticker})</span>
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveCompany(company.id)}>
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No saved companies yet.</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

