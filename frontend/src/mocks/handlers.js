// import { http, HttpResponse } from 'msw'
// While using django
// export const handlers = [
//  http.post('http://localhost:8000/api/issues', async ({ request }) => {
//   const formData = await request.formData()

//   const title = formData.get('title')
//   const description = formData.get('description')
//   const category = formData.get('category')
//   const image = formData.get('image')
//   const latitude = formData.get('latitude')
//   const longitude = formData.get('longitude')

//   console.log('MSW received issue:', {
//     title,
//     description,
//     category,
//     hasImage: !!image,
//     location: latitude ? { latitude, longitude } : null,
//   })

//   return HttpResponse.json({
//     message: 'Issue submitted successfully',
//     issue: {
//       id: Math.floor(Math.random() * 1000),
//       title,
//       description,
//       category,
//       status: 'pending',
//       createdAt: new Date().toISOString(),
//     },
//   }, { status: 201 })
// }),
// ]

import { http, HttpResponse } from 'msw'

const MOCK_ISSUES = [
  {
    id: 1,
    title: 'Large pothole on Baneshwor main road causing accidents',
    description:
      'There is a massive pothole near the Baneshwor junction that has already caused two motorcycle accidents this week. It needs urgent patching.',
    category: 'Road & Transport',
    status: 'in_progress',
    priority: 'critical',
    location: 'Baneshwor, Kathmandu',
    image: null,
    created_at: '2025-03-01T08:30:00Z',
  },
  {
    id: 2,
    title: 'Water supply cut off for 3 days in Lalitpur ward 5',
    description:
      'Residents of ward 5 have had no piped water supply since Monday morning. The ward office has not responded to repeated calls.',
    category: 'Water & Drainage',
    status: 'open',
    priority: 'high',
    location: 'Lalitpur Ward 5',
    image: null,
    created_at: '2025-03-03T11:00:00Z',
  },
  {
    id: 3,
    title: 'Street lights not working on Kalanki highway stretch',
    description:
      'The street lights between Kalanki and Balkhu have been non-functional for two weeks, making nighttime commuting dangerous.',
    category: 'Electricity',
    status: 'pending',
    priority: 'medium',
    location: 'Kalanki, Kathmandu',
    image: null,
    created_at: '2025-03-05T07:15:00Z',
  },
  {
    id: 4,
    title: 'Garbage pile-up near Koteshwor bus park',
    description:
      'Uncollected garbage has been piling up for over a week near the Koteshwor bus park. It is attracting stray animals and emitting a foul smell.',
    category: 'Waste Management',
    status: 'resolved',
    priority: 'low',
    location: 'Koteshwor, Kathmandu',
    image: null,
    created_at: '2025-02-20T09:00:00Z',
  },
  {
    id: 5,
    title: 'Broken sewer line flooding pavement in Patan',
    description:
      'A cracked sewer line near Patan Dhoka is leaking sewage onto the footpath, making it unusable and creating a health hazard.',
    category: 'Water & Drainage',
    status: 'open',
    priority: 'high',
    location: 'Patan Dhoka, Lalitpur',
    image: null,
    created_at: '2025-03-07T14:45:00Z',
  },
  {
    id: 6,
    title: 'Playground equipment broken in Ratnapark area',
    description:
      'The swings and slide in the small park near Ratnapark have been broken for a month. Children are still trying to use the damaged equipment.',
    category: 'Parks & Green',
    status: 'pending',
    priority: 'low',
    location: 'Ratnapark, Kathmandu',
    image: null,
    created_at: '2025-03-10T16:00:00Z',
  },
]
export const handlers = [
  http.post('http://localhost:8000/api/auth/login/', async ({ request }) => {
    const body = await request.json()
    const { email, password } = body

    // Citizen  login
    if (email === 'citizen@test.com' && password === 'password') {
      return HttpResponse.json({
        token: 'fake-citizen-token',
        user: {
          id: 1,
          name: 'Citizen User',
          email: 'citizen@test.com',
          role: 'citizen',
        },
      })
    }

    // Staff login
    if (email === 'staff@test.com' && password === 'password') {
      return HttpResponse.json({
        token: 'fake-staff-token',
        user: {
          id: 2,
          name: 'Staff User',
          email: 'staff@test.com',
          role: 'staff',
        },
      })
    }

    return HttpResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    )
  }),

  http.get('http://localhost:8000/api/auth/profile/', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    // simulate role based on token
    if (authHeader?.includes('staff')) {
      return HttpResponse.json({
        id: 2,
        name: 'Staff User',
        email: 'staff@test.com',
        role: 'staff',
      })
    }

    return HttpResponse.json({
      id: 1,
      name: 'Citizen User',
      email: 'citizen@test.com',
      role: 'citizen',
    })
  }),
  http.get('http://localhost:8000/api/issues/', () => {
    return HttpResponse.json(MOCK_ISSUES, { status: 200 })
  }),

  http.get('http://localhost:8000/api/issues/:id/', ({ params }) => {
    const issue = MOCK_ISSUES.find((i) => i.id === Number(params.id))
    if (!issue) {
      return HttpResponse.json({ message: 'Issue not found' }, { status: 404 })
    }
    return HttpResponse.json(issue, { status: 200 })
  }),
]
