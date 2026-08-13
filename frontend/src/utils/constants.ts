export const APP_NAME = 'Gig Galaxy'
export const APP_VERSION = '1.0.0'

export const TOKEN_KEY = 'gg_access_token'
export const REFRESH_TOKEN_KEY = 'gg_refresh_token'
export const USER_KEY = 'gg_user'

export const CATEGORIES = [
  { id: '1', name: 'Web Development', slug: 'web-development', icon: 'code' },
  { id: '2', name: 'Mobile Development', slug: 'mobile-development', icon: 'phone_iphone' },
  { id: '3', name: 'UI/UX Design', slug: 'ui-ux-design', icon: 'design_services' },
  { id: '4', name: 'Graphic Design', slug: 'graphic-design', icon: 'brush' },
  { id: '5', name: 'Video Editing', slug: 'video-editing', icon: 'videocam' },
  { id: '6', name: 'Digital Marketing', slug: 'digital-marketing', icon: 'trending_up' },
  { id: '7', name: 'Content Writing', slug: 'content-writing', icon: 'edit_note' },
  { id: '8', name: 'Data Science', slug: 'data-science', icon: 'analytics' }
]

export const SKILLS_LIST = [
  'Vue.js', 'React', 'Angular', 'Node.js', 'Python', 'Django', 'Laravel', 'PHP',
  'TypeScript', 'JavaScript', 'HTML/CSS', 'SCSS', 'Tailwind CSS', 'Bootstrap',
  'Flutter', 'React Native', 'Swift', 'Kotlin', 'Android', 'iOS',
  'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects',
  'SEO', 'Google Ads', 'Facebook Ads', 'Email Marketing', 'Social Media',
  'Content Writing', 'Copywriting', 'Blog Writing', 'Technical Writing',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase',
  'AWS', 'Azure', 'Docker', 'Kubernetes', 'DevOps'
]

export const DELIVERY_TIMES = [
  { label: '24 hours', value: 1 },
  { label: '3 days', value: 3 },
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 }
]

export const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Arabic', 'Chinese', 'Japanese',
  'Portuguese', 'Russian', 'Hindi', 'Italian', 'Korean', 'Turkish', 'Dutch'
]

export const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'India', 'Pakistan', 'Brazil', 'Mexico', 'Spain', 'Italy',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland',
  'Japan', 'South Korea', 'China', 'Singapore', 'UAE', 'Saudi Arabia'
]

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'warning',
  accepted: 'info',
  in_progress: 'primary',
  delivered: 'teal',
  completed: 'positive',
  cancelled: 'negative'
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled'
}

export const GIG_STATUS_COLORS: Record<string, string> = {
  draft: 'grey',
  published: 'positive',
  rejected: 'negative',
  pending_review: 'warning'
}

export const FREELANCER_LEVELS = [
  { value: 'new', label: 'New Seller', color: 'grey' },
  { value: 'level_1', label: 'Level 1', color: 'blue' },
  { value: 'level_2', label: 'Level 2', color: 'purple' },
  { value: 'top_rated', label: 'Top Rated', color: 'orange' }
]

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 12
}
