import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { User, Calendar, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { ROUTES } from '@/lib/constants'
import { createUserProfile } from '@/lib/api/profiles'

interface ProfileFormData {
  firstName: string
  lastName: string
  gender: string
  batch: string
  indexNumber: string
  campusCard: string
}

export const ProfileCompletionPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    gender: '',
    batch: '',
    indexNumber: '',
    campusCard: '',
  })
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({})

  // Pre-fill form data from Google user metadata when user data is available
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      const fullName = user.user_metadata.full_name
      const nameParts = fullName.split(' ')

      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
      }))
    }
  }, [user])

  // Get avatar URL with fallbacks
  const rawAvatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.user_metadata?.avatar ||
    user?.identities?.[0]?.identity_data?.avatar_url ||
    user?.identities?.[0]?.identity_data?.picture

  const avatarUrl = rawAvatarUrl
    ? rawAvatarUrl.replace('=s96-c', '=s128-c')
    : null

  const userInitials =
    user?.user_metadata?.full_name
      ?.split(' ')
      ?.map((name: string) => name[0])
      ?.join('')
      ?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    '?'

  // Validate batch format (XX/XX)
  const validateBatch = (batch: string): boolean => {
    const batchRegex = /^\d{2}\/\d{2}$/
    return batchRegex.test(batch)
  }

  // Handle form input changes
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

    if (!formData.gender) {
      newErrors.gender = 'Gender is required'
    }

    if (!formData.batch.trim()) {
      newErrors.batch = 'Batch is required'
    } else if (!validateBatch(formData.batch)) {
      newErrors.batch = 'Batch must be in format XX/XX (e.g., 23/24)'
    }

    if (!formData.indexNumber.trim()) {
      newErrors.indexNumber = 'Index number is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    if (!user) {
      toast.error('User not found. Please sign in again.')
      return
    }

    setIsLoading(true)

    try {
      // Create user profile using the API
      await createUserProfile(user.id, {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        gender: formData.gender as 'male' | 'female',
        batch: formData.batch.trim(),
        index_number: formData.indexNumber.trim(),
        campus_card: formData.campusCard.trim() || undefined,
        avatar_url: avatarUrl,
      })

      toast.success('Profile completed successfully! Welcome to InfoBash.')

      // Navigate to home page
      navigate(ROUTES.HOME)
    } catch (error) {
      console.error('Error saving profile:', error)

      // Handle specific error cases
      if (error instanceof Error) {
        if (
          error.message.includes(
            'duplicate key value violates unique constraint "user_profiles_index_number_key"'
          )
        ) {
          toast.error(
            'Index number already exists'
          )
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error('Failed to save profile. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--brand-bg)] via-[color:rgb(30_41_59/0.95)] to-[color:rgb(15_23_42/0.98)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-[color:rgb(255_255_255/0.08)] backdrop-blur-md border border-[color:rgb(255_255_255/0.12)] shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Avatar className="h-20 w-20 ring-4 ring-[var(--color-accent-1)]/40">
                <AvatarImage
                  src={!imageError ? avatarUrl : undefined}
                  alt={user.user_metadata?.full_name || user.email || 'User'}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={() => setImageError(true)}
                  onLoad={() => setImageError(false)}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent-1)] text-[var(--brand-bg)] font-semibold text-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                Complete Your Profile
              </CardTitle>
              <CardDescription className="text-[var(--color-text-muted)] text-base">
                Welcome to InfoBash! Please complete your profile to get
                started.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-white font-medium flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange('firstName', e.target.value)
                    }
                    className="bg-[color:rgb(255_255_255/0.1)] border-[color:rgb(255_255_255/0.2)] text-white placeholder-[color:rgb(255_255_255/0.5)] focus:border-[var(--color-accent-1)] focus:ring-[var(--color-accent-1)]/50"
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-white font-medium flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange('lastName', e.target.value)
                    }
                    className="bg-[color:rgb(255_255_255/0.1)] border-[color:rgb(255_255_255/0.2)] text-white placeholder-[color:rgb(255_255_255/0.5)] focus:border-[var(--color-accent-1)] focus:ring-[var(--color-accent-1)]/50"
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Gender Selection */}
              <div className="space-y-2">
                <Label className="text-white font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Gender *
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger className="bg-[color:rgb(255_255_255/0.1)] border-[color:rgb(255_255_255/0.2)] text-white focus:border-[var(--color-accent-1)] focus:ring-[var(--color-accent-1)]/50">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-[color:rgb(30_41_59/0.95)] backdrop-blur-md border-[color:rgb(255_255_255/0.2)] text-white">
                    <SelectItem
                      value="male"
                      className="hover:bg-[color:rgb(255_255_255/0.1)] focus:bg-[color:rgb(255_255_255/0.1)] focus:text-white"
                    >
                      Male
                    </SelectItem>
                    <SelectItem
                      value="female"
                      className="hover:bg-[color:rgb(255_255_255/0.1)] focus:bg-[color:rgb(255_255_255/0.1)] focus:text-white"
                    >
                      Female
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-red-400 text-sm">{errors.gender}</p>
                )}
              </div>

              {/* Index Number Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="indexNumber"
                  className="text-white font-medium flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Index Number *
                </Label>
                <Input
                  id="indexNumber"
                  type="text"
                  value={formData.indexNumber}
                  onChange={(e) =>
                    handleInputChange('indexNumber', e.target.value)
                  }
                  className="bg-[color:rgb(255_255_255/0.1)] border-[color:rgb(255_255_255/0.2)] text-white placeholder-[color:rgb(255_255_255/0.5)] focus:border-[var(--color-accent-1)] focus:ring-[var(--color-accent-1)]/50"
                  placeholder="Enter your index number"
                />
                {errors.indexNumber && (
                  <p className="text-red-400 text-sm">{errors.indexNumber}</p>
                )}
              </div>

              {/* Batch Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="batch"
                  className="text-white font-medium flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Batch *
                </Label>
                <Input
                  id="batch"
                  type="text"
                  value={formData.batch}
                  onChange={(e) => handleInputChange('batch', e.target.value)}
                  className="bg-[color:rgb(255_255_255/0.1)] border-[color:rgb(255_255_255/0.2)] text-white placeholder-[color:rgb(255_255_255/0.5)] focus:border-[var(--color-accent-1)] focus:ring-[var(--color-accent-1)]/50"
                  placeholder="e.g., 23/24"
                  maxLength={5}
                />
                {errors.batch && (
                  <p className="text-red-400 text-sm">{errors.batch}</p>
                )}
                <p className="text-[color:rgb(255_255_255/0.6)] text-sm">
                  Enter your batch in XX/XX format (e.g., 23/24)
                </p>
              </div>

              {/* Campus Card Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="campusCard"
                  className="text-white font-medium flex items-center gap-2"
                >
                  Campus Card
                  <span className="text-[color:rgb(255_255_255/0.6)] text-sm font-normal">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="campusCard"
                  type="text"
                  value={formData.campusCard}
                  onChange={(e) =>
                    handleInputChange('campusCard', e.target.value)
                  }
                  className="bg-[color:rgb(255_255_255/0.1)] border-[color:rgb(255_255_255/0.2)] text-white placeholder-[color:rgb(255_255_255/0.5)] focus:border-[var(--color-accent-1)] focus:ring-[var(--color-accent-1)]/50"
                  placeholder="Enter your campus card number"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent-1)] hover:from-[var(--color-secondary)]/90 hover:to-[var(--color-accent-1)]/90 text-[var(--brand-bg)] font-semibold py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner />
                    <span>Completing Profile...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Complete Profile</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
