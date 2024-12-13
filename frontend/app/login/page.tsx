'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { login } from '../../utils/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from '@/utils/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const data = await login(email, password)
      if (data.token) {
        localStorage.setItem('token', data.token)
        router.push('/profile')
      } else {
        setError('Login failed. Please check your credentials.')
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.')
    }
  }

  const handleGoogleLogin = async () => {
    console.log('1. Starting Google login...');
    try {
      await signIn('google', { 
        callbackUrl: '/profile',
      });
    } catch (error) {
      console.error('Error during Google sign in:', error);
      setError('An unexpected error occurred during Google login');
    }
  }

  const handleTwitterLogin = async () => {
    console.log('1. Starting Twitter login...');
    try {
      await signIn('twitter', { 
        callbackUrl: '/profile',
      });
    } catch (error) {
      console.error('Error during Twitter sign in:', error);
      setError('An unexpected error occurred during Twitter login');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full">Login</Button>
          </form>
          <div className="mt-4 space-y-2">
            <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
              Login with Google
            </Button>
            <Button onClick={handleTwitterLogin} variant="outline" className="w-full">
              Login with Twitter
            </Button>
          </div>
          <div className="mt-4 text-center">
            <Link href="/register" className="text-sm text-blue-600 hover:underline">
              Don't have an account? Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
