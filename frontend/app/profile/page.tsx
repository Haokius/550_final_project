'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserProfile, getSavedCompanies, removeCompany, addCompany, getAvailableCompanies } from '@/utils/api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { CompanyDetails } from '@/components/ui/CompanyDetails'

interface UserProfile {
  id: number;
  username: string;
  email: string;
  provider: string | null;
}

interface SavedCompany {
  cik: string;
  year: number;
  month: number;
  cash_and_equivalents: number;
  long_term_debt: number;
}

interface AvailableCompany {
  ticker: string;
  cik: string;
  companyname: string;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [companies, setCompanies] = useState<SavedCompany[]>([])
  const [availableCompanies, setAvailableCompanies] = useState<AvailableCompany[]>([])
  const [companyNames, setCompanyNames] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAddingCompany, setIsAddingCompany] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompany, setSelectedCompany] = useState<{ name: string; cik: string; ticker?: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.log('No token found, redirecting to login')
          router.push('/login')
          return
        }

        const [profileData, companiesData, availableCompaniesData] = await Promise.all([
          getUserProfile(),
          getSavedCompanies(),
          getAvailableCompanies()
        ])

        const nameMapping: Record<string, string> = availableCompaniesData.reduce((acc: Record<string, string>, company: AvailableCompany) => {
          acc[company.cik] = company.companyname;
          return acc;
        }, {});

        setProfile(profileData)
        setCompanies(companiesData)
        setAvailableCompanies(availableCompaniesData)
        setCompanyNames(nameMapping)

      } catch (err: any) {
        console.error('Error fetching data:', err)
        const errorMessage = err.response?.status === 404 
          ? "Unable to load profile. Please try again later."
          : err.response?.data?.detail || err.message || 'Failed to load profile data'
        setError(errorMessage)
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

  const handleAddCompany = async (cik: string) => {
    try {
      await addCompany([cik])
      const updatedCompanies = await getSavedCompanies()
      setCompanies(updatedCompanies)
      setIsAddingCompany(false)
    } catch (err: any) {
      console.error('Error adding company:', err)
      setError(err.response?.data?.detail || 'Failed to add company')
    }
  }

  const handleRemoveCompany = async (cik: string) => {
    try {
      await removeCompany(cik)
      setCompanies(companies.filter(company => company.cik !== cik))
    } catch (err: any) {
      console.error('Error removing company:', err)
      setError(err.response?.data?.detail || 'Failed to remove company')
    }
  }

  const handleViewDetails = (name: string, cik: string) => {
    const company = availableCompanies.find(c => c.cik === cik)
    console.log('Selected company:', company)
    setSelectedCompany({ 
      name, 
      cik,
      ticker: company?.ticker
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const filteredCompanies = availableCompanies.filter(company => 
    company.companyname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
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
            <div className="flex gap-4 mt-4">
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Return to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Profile</CardTitle>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </CardHeader>
        <CardContent>
          {profile && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${profile.username}`} 
                    alt={profile.username} 
                  />
                  <AvatarFallback>{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{profile.username}</h2>
                  <p className="text-gray-500">{profile.email}</p>
                  {profile.provider && (
                    <p className="text-sm text-gray-400">
                      Signed in with {profile.provider}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Saved Companies</h3>
                  <Dialog open={isAddingCompany} onOpenChange={setIsAddingCompany}>
                    <DialogTrigger asChild>
                      <Button>Add Company</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Company</DialogTitle>
                        <DialogDescription>
                          Search and select a company to add to your watchlist.
                        </DialogDescription>
                      </DialogHeader>
                      <Command>
                        <CommandInput 
                          placeholder="Search companies..."
                          value={searchTerm}
                          onValueChange={setSearchTerm}
                        />
                        <CommandList>
                          <CommandEmpty>No companies found.</CommandEmpty>
                          <CommandGroup>
                            {filteredCompanies.map((company) => (
                              <CommandItem
                                key={company.cik}
                                onSelect={() => handleAddCompany(company.cik)}
                              >
                                <div className="flex flex-col">
                                  <span>{company.companyname}</span>
                                  <span className="text-sm text-gray-500">
                                    {company.ticker} - CIK: {company.cik}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-3">
                  {companies.map((company) => (
                    <div 
                      key={company.cik} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{companyNames[company.cik]}</p>
                        <p className="text-sm text-gray-500">
                          Last Updated: {company.month}/{company.year}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(companyNames[company.cik], company.cik)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveCompany(company.cik)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  {companies.length === 0 && (
                    <p className="text-gray-500">No saved companies</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCompany && (
        <CompanyDetails
          companyName={selectedCompany.name}
          cik={selectedCompany.cik}
          ticker={selectedCompany.ticker}
          isOpen={!!selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  )
}

