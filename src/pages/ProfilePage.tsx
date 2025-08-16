import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PageLoading } from '@/components/shared/LoadingSpinner'
import { User, Save, Mail, Calendar, Shield } from 'lucide-react'
import { toast } from 'sonner'
import {
  getUserProfile,
  updateUserProfile,
  type UserProfile,
} from '@/lib/api/profiles'
import { ROUTES } from '@/lib/constants'

interface ProfileFormData {
  firstName: string
  lastName: string
  batch: string
  campusCard: string
}

export function ProfilePage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    batch: '',
    campusCard: '',
  })
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({})

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return

      try {
        const userProfile = await getUserProfile(user.id)
        if (userProfile) {
          setProfile(userProfile)
          setFormData({
            firstName: userProfile.first_name,
            lastName: userProfile.last_name,
            batch: userProfile.batch,
            campusCard: userProfile.campus_card || '',
          })
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        toast.error('Failed to load profile data')
      } finally {
        setProfileLoading(false)
      }
    }

    if (!loading && user) {
      loadProfile()
    } else if (!loading && !user) {
      setProfileLoading(false)
    }
  }, [user, loading])

  // Validation functions
  const validateBatch = (batch: string): boolean => {
    const batchRegex = /^\d{2}\/\d{2}$/
    return batchRegex.test(batch.trim())
  }

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.batch.trim()) {
      newErrors.batch = 'Batch is required'
    } else if (!validateBatch(formData.batch)) {
      newErrors.batch = 'Batch must be in format XX/XX (e.g., 23/24)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    if (!user) {
      toast.error('User not found. Please sign in again.')
      return
    }

    setIsUpdating(true)

    try {
      const updatedProfile = await updateUserProfile(user.id, {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        batch: formData.batch.trim(),
        campus_card: formData.campusCard.trim() || undefined,
      })

      setProfile(updatedProfile)
      toast.success('Profile updated successfully!')

      // Navigate to home page after successful update
      setTimeout(() => {
        navigate(ROUTES.HOME)
      }, 1500) // Small delay to show the success message
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to update profile'
      )
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading || profileLoading) {
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

  if (!profile) {
    return (
      <div className="container py-8">
        <Card className="max-w-lg mx-auto bg-card-bg border-card-border">
          <CardContent className="text-center p-8">
            <p className="text-[var(--text-secondary)]">
              Profile not found. Please complete your profile setup.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get avatar URL with fallbacks
  const rawAvatarUrl =
    profile.avatar_url ||
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    user.user_metadata?.avatar ||
    user.identities?.[0]?.identity_data?.avatar_url ||
    user.identities?.[0]?.identity_data?.picture

  const avatarUrl = rawAvatarUrl
    ? rawAvatarUrl.replace('=s96-c', '=s200-c')
    : null

  const userInitials =
    `${profile.first_name[0] || ''}${
      profile.last_name[0] || ''
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
                  src={!imageError ? avatarUrl : undefined}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={() => setImageError(true)}
                />
                <AvatarFallback className="bg-[var(--color-secondary)] text-[var(--brand-bg)] font-semibold text-2xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-[var(--text-primary)]">
              {profile.first_name} {profile.last_name}
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
                Profile Complete
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
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName}</p>
                    )}
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
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName}</p>
                    )}
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

                <div className="space-y-2">
                  <Label className="text-[var(--text-primary)]">Gender</Label>
                  <Input
                    type="text"
                    value={
                      profile.gender.charAt(0).toUpperCase() +
                      profile.gender.slice(1)
                    }
                    disabled
                    className="bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-[var(--text-secondary)]">
                    Gender cannot be changed after initial setup
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batch" className="text-[var(--text-primary)]">
                    Batch
                  </Label>
                  <Input
                    id="batch"
                    type="text"
                    value={formData.batch}
                    onChange={(e) => handleInputChange('batch', e.target.value)}
                    className="bg-[var(--brand-bg)] border-[var(--brand-border)] text-[var(--text-primary)]"
                    placeholder="e.g., 23/24"
                    required
                  />
                  {errors.batch && (
                    <p className="text-sm text-red-500">{errors.batch}</p>
                  )}
                </div>

                {/* Campus Card */}
                {/* <div className="space-y-2">
                  <Label
                    htmlFor="campusCard"
                    className="text-[var(--text-primary)]"
                  >
                    Campus Card (Optional)
                  </Label>
                  <Input
                    id="campusCard"
                    type="text"
                    value={formData.campusCard}
                    onChange={(e) =>
                      handleInputChange('campusCard', e.target.value)
                    }
                    className="bg-[var(--brand-bg)] border-[var(--brand-border)] text-[var(--text-primary)]"
                    placeholder="Enter your campus card number"
                  />
                </div> */}

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
