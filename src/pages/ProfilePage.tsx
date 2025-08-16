import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PageLoading } from '@/components/shared/LoadingSpinner'
import { User, Save, Mail, Calendar, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function ProfilePage() {
  const { user, loading } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  })
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    if (user?.user_metadata) {
      const fullName = user.user_metadata.full_name || ''
      const nameParts = fullName.split(' ')
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
      })
    }
  }, [user])

  if (loading) {
    return (
      <div className="container py-8">
        <PageLoading message="Loading profile..." />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container py-8">
        <Card className="max-w-lg mx-auto bg-card-bg border-card-border">
          <CardContent className="text-center p-8">
            <p className="text-[var(--text-secondary)]">
              You need to be signed in to view your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setMessage(null)

    try {
      const fullName =
        `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim()

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
        },
      })

      if (error) throw error

      setMessage({
        type: 'success',
        text: 'Profile updated successfully!',
      })

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Get avatar URL with fallbacks
  const rawAvatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    user.user_metadata?.avatar ||
    user.identities?.[0]?.identity_data?.avatar_url ||
    user.identities?.[0]?.identity_data?.picture

  const avatarUrl = rawAvatarUrl
    ? rawAvatarUrl.replace('=s96-c', '=s200-c')
    : null

  const userInitials =
    `${formData.firstName[0] || ''}${
      formData.lastName[0] || ''
    }`.toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    '?'

  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : 'Unknown'

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Profile Settings
        </h1>
        <div className="mt-2 h-1 w-28 rounded-full bg-gradient-gold opacity-80" />
        <p className="text-[var(--text-secondary)] mt-2">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Overview Card */}
        <Card className="bg-card-bg border-card-border">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={avatarUrl}
                  alt={user.user_metadata?.full_name || user.email || 'User'}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
                <AvatarFallback className="bg-[var(--color-secondary)] text-[var(--brand-bg)] font-semibold text-2xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-[var(--text-primary)]">
              {user.user_metadata?.full_name || 'Unknown User'}
            </CardTitle>
            <p className="text-[var(--text-secondary)] text-sm">{user.email}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="h-4 w-4 text-[var(--color-secondary)]" />
              <span className="text-[var(--text-secondary)]">
                {user.email_confirmed_at ? 'Email Verified' : 'Email Pending'}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Calendar className="h-4 w-4 text-[var(--color-secondary)]" />
              <span className="text-[var(--text-secondary)]">
                Joined {joinedDate}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Shield className="h-4 w-4 text-[var(--color-secondary)]" />
              <span className="text-[var(--text-secondary)]">
                Account Active
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <div className="md:col-span-2">
          <Card className="bg-card-bg border-card-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[var(--text-primary)]">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-[var(--text-primary)]"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange('firstName', e.target.value)
                      }
                      className="bg-[var(--brand-bg)] border-[var(--brand-border)] text-[var(--text-primary)]"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-[var(--text-primary)]"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange('lastName', e.target.value)
                      }
                      className="bg-[var(--brand-bg)] border-[var(--brand-border)] text-[var(--text-primary)]"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[var(--text-primary)]">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-[var(--text-secondary)]">
                    Email address cannot be changed
                  </p>
                </div>

                {message && (
                  <div
                    className={`p-4 rounded-lg ${
                      message.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/20 text-green-600'
                        : 'bg-red-500/10 border border-red-500/20 text-red-600'
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 text-[var(--brand-bg)] font-semibold px-6 py-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--brand-bg)] border-t-transparent mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
