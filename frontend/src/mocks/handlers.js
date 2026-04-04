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
    updated_at: '2025-03-05T10:00:00Z',
    upvote_count: 12,
    has_upvoted: false,
    status_history: [
      {
        status: 'pending',
        timestamp: '2025-03-01T08:30:00Z',
        note: 'Issue submitted by citizen.',
      },
      {
        status: 'open',
        timestamp: '2025-03-02T09:00:00Z',
        note: 'Reviewed and assigned to road maintenance team.',
      },
      {
        status: 'in_progress',
        timestamp: '2025-03-05T10:00:00Z',
        note: 'Repair crew dispatched to site.',
      },
    ],
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
    updated_at: '2025-03-04T08:00:00Z',
    upvote_count: 7,
    has_upvoted: false,
    status_history: [
      {
        status: 'pending',
        timestamp: '2025-03-03T11:00:00Z',
        note: 'Issue submitted by citizen.',
      },
      {
        status: 'open',
        timestamp: '2025-03-04T08:00:00Z',
        note: 'Forwarded to Lalitpur water authority.',
      },
    ],
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
    updated_at: null,
    upvote_count: 3,
    has_upvoted: true,
    status_history: [
      {
        status: 'pending',
        timestamp: '2025-03-05T07:15:00Z',
        note: 'Issue submitted by citizen.',
      },
    ],
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
    updated_at: '2025-02-28T14:00:00Z',
    upvote_count: 1,
    has_upvoted: false,
    status_history: [
      {
        status: 'pending',
        timestamp: '2025-02-20T09:00:00Z',
        note: 'Issue submitted by citizen.',
      },
      {
        status: 'open',
        timestamp: '2025-02-21T10:00:00Z',
        note: 'Assigned to waste management unit.',
      },
      {
        status: 'in_progress',
        timestamp: '2025-02-24T08:00:00Z',
        note: 'Cleanup crew scheduled.',
      },
      {
        status: 'resolved',
        timestamp: '2025-02-28T14:00:00Z',
        note: 'Area cleaned. Issue resolved.',
      },
    ],
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
    updated_at: '2025-03-08T09:00:00Z',
    upvote_count: 9,
    has_upvoted: false,
    status_history: [
      {
        status: 'pending',
        timestamp: '2025-03-07T14:45:00Z',
        note: 'Issue submitted by citizen.',
      },
      {
        status: 'open',
        timestamp: '2025-03-08T09:00:00Z',
        note: 'Escalated to municipal drainage team.',
      },
    ],
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
    updated_at: null,
    upvote_count: 2,
    has_upvoted: false,
    status_history: [
      {
        status: 'pending',
        timestamp: '2025-03-10T16:00:00Z',
        note: 'Issue submitted by citizen.',
      },
    ],
  },
  {
    id: 7,
    title: 'Road cave-in near Chabahil junction',
    description:
      'A large section of road has caved in near the Chabahil junction, blocking one lane and causing major traffic disruption.',
    category: 'Road & Transport',
    status: 'open',
    priority: 'critical',
    location: 'Chabahil, Kathmandu',
    image: null,
    created_at: '2025-03-08T07:00:00Z',
    updated_at: '2025-03-08T10:00:00Z',
    upvote_count: 18,
    has_upvoted: false,
    status_history: [
      {
        status: 'pending',
        timestamp: '2025-03-08T07:00:00Z',
        note: 'Issue submitted by citizen.',
      },
      {
        status: 'open',
        timestamp: '2025-03-08T10:00:00Z',
        note: 'Assigned to road repair unit.',
      },
    ],
  },
  {
    id: 8,
    title: 'Flooding in Balaju industrial area',
    description:
      'Heavy rainfall has caused severe flooding in the Balaju industrial area. Several factories have been affected and workers cannot access the site.',
    category: 'Water & Drainage',
    status: 'in_progress',
    priority: 'high',
    location: 'Balaju, Kathmandu',
    image: null,
    created_at: '2025-03-09T06:30:00Z',
    updated_at: '2025-03-10T09:00:00Z',
    upvote_count: 11,
    has_upvoted: false,
    status_history: [
      {
        status: 'pending',
        timestamp: '2025-03-09T06:30:00Z',
        note: 'Issue submitted by citizen.',
      },
      {
        status: 'open',
        timestamp: '2025-03-09T09:00:00Z',
        note: 'Reviewed by drainage authority.',
      },
      {
        status: 'in_progress',
        timestamp: '2025-03-10T09:00:00Z',
        note: 'Pumping team deployed to site.',
      },
    ],
  },
  {
    id: 9,
    title: 'Power outage in Bhaktapur old town',
    description:
      'The entire old town area of Bhaktapur has been without electricity for over 18 hours. Hospitals and heritage sites are running on generators.',
    category: 'Electricity',
    status: 'open',
    priority: 'critical',
    location: 'Bhaktapur Old Town',
    image: null,
    created_at: '2025-03-10T05:00:00Z',
    updated_at: '2025-03-10T08:00:00Z',
    upvote_count: 24,
    has_upvoted: false,
    status_history: [
      {
        status: 'pending',
        timestamp: '2025-03-10T05:00:00Z',
        note: 'Issue submitted by citizen.',
      },
      {
        status: 'open',
        timestamp: '2025-03-10T08:00:00Z',
        note: 'NEA team investigating transformer failure.',
      },
    ],
  },
  {
    id: 10,
    title: 'Damaged footpath near Pashupati temple',
    description:
      'The footpath leading to Pashupati temple has large cracks and uneven surfaces, making it dangerous for elderly visitors and pilgrims.',
    category: 'Road & Transport',
    status: 'pending',
    priority: 'medium',
    location: 'Pashupati, Kathmandu',
    image: null,
    created_at: '2025-03-06T10:00:00Z',
    updated_at: null,
    upvote_count: 6,
    has_upvoted: false,
    status_history: [
      {
        status: 'pending',
        timestamp: '2025-03-06T10:00:00Z',
        note: 'Issue submitted by citizen.',
      },
    ],
  },
  {
    id: 11,
    title: 'Illegal dumping near Bagmati river bank',
    description:
      'Construction waste and household garbage is being illegally dumped on the Bagmati river bank near Thapathali, polluting the river.',
    category: 'Waste Management',
    status: 'open',
    priority: 'high',
    location: 'Thapathali, Kathmandu',
    image: null,
    created_at: '2025-03-07T08:00:00Z',
    updated_at: '2025-03-08T11:00:00Z',
    upvote_count: 15,
    has_upvoted: false,
    status_history: [
      {
        status: 'pending',
        timestamp: '2025-03-07T08:00:00Z',
        note: 'Issue submitted by citizen.',
      },
      {
        status: 'open',
        timestamp: '2025-03-08T11:00:00Z',
        note: 'Forwarded to Bagmati cleanup committee.',
      },
    ],
  },
  {
    id: 12,
    title: 'Broken water pipeline in Kirtipur',
    description:
      'A burst water pipeline in Kirtipur has been leaking for four days, wasting water and making the road slippery.',
    category: 'Water & Drainage',
    status: 'in_progress',
    priority: 'medium',
    location: 'Kirtipur, Kathmandu',
    image: null,
    created_at: '2025-03-06T14:00:00Z',
    updated_at: '2025-03-09T08:00:00Z',
    upvote_count: 8,
    has_upvoted: false,
    status_history: [
      {
        status: 'pending',
        timestamp: '2025-03-06T14:00:00Z',
        note: 'Issue submitted by citizen.',
      },
      {
        status: 'open',
        timestamp: '2025-03-07T09:00:00Z',
        note: 'KUKL notified.',
      },
      {
        status: 'in_progress',
        timestamp: '2025-03-09T08:00:00Z',
        note: 'Repair crew on site.',
      },
    ],
  },
  {
    id: 13,
    title: 'Street light failure near airport road',
    description:
      'Multiple street lights along the airport road stretch have been out for over a week, creating safety concerns for late-night travelers.',
    category: 'Electricity',
    status: 'pending',
    priority: 'high',
    location: 'Airport Road, Kathmandu',
    image: null,
    created_at: '2025-03-08T19:00:00Z',
    updated_at: null,
    upvote_count: 10,
    has_upvoted: false,
    status_history: [
      {
        status: 'pending',
        timestamp: '2025-03-08T19:00:00Z',
        note: 'Issue submitted by citizen.',
      },
    ],
  },
  {
    id: 14,
    title: 'Pothole cluster near Maharajgunj',
    description:
      'A cluster of deep potholes near Maharajgunj has formed after recent rains. Several vehicles have been damaged and motorcyclists are at risk.',
    category: 'Road & Transport',
    status: 'open',
    priority: 'medium',
    location: 'Maharajgunj, Kathmandu',
    image: null,
    created_at: '2025-03-09T12:00:00Z',
    updated_at: '2025-03-10T10:00:00Z',
    upvote_count: 7,
    has_upvoted: false,
    status_history: [
      {
        status: 'pending',
        timestamp: '2025-03-09T12:00:00Z',
        note: 'Issue submitted by citizen.',
      },
      {
        status: 'open',
        timestamp: '2025-03-10T10:00:00Z',
        note: 'Logged with Department of Roads.',
      },
    ],
  },
  {
    id: 15,
    title: 'Overgrown park in Lazimpat',
    description:
      'The public park in Lazimpat has become completely overgrown. Grass and weeds are waist-high and the park is no longer usable by residents.',
    category: 'Parks & Green',
    status: 'resolved',
    priority: 'low',
    location: 'Lazimpat, Kathmandu',
    image: null,
    created_at: '2025-02-25T11:00:00Z',
    updated_at: '2025-03-05T15:00:00Z',
    upvote_count: 3,
    has_upvoted: false,
    status_history: [
      {
        status: 'pending',
        timestamp: '2025-02-25T11:00:00Z',
        note: 'Issue submitted by citizen.',
      },
      {
        status: 'open',
        timestamp: '2025-02-26T09:00:00Z',
        note: 'Assigned to parks maintenance team.',
      },
      {
        status: 'in_progress',
        timestamp: '2025-03-02T08:00:00Z',
        note: 'Groundskeeping crew scheduled.',
      },
      {
        status: 'resolved',
        timestamp: '2025-03-05T15:00:00Z',
        note: 'Park cleared and maintained.',
      },
    ],
  },
]

const upvotedIds = new Set()

export const handlers = [
  http.post(
    'http://192.168.100.167:8000/api/auth/login/',
    async ({ request }) => {
      const body = await request.json()
      const { email, password } = body

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
      if (email === 'admin@test.com' && password === 'password') {
        return HttpResponse.json({
          token: 'fake-admin-token',
          user: {
            id: 3,
            name: 'Admin',
            email: 'admin@test.com',
            role: 'admin',
          },
        })
      }

      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }
  ),

  http.get('http://192.168.100.167:8000/api/auth/profile/', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (authHeader?.includes('admin')) {
      return HttpResponse.json({
        id: 3,
        name: 'Admin User',
        email: 'admin@test.com',
        role: 'admin',
      })
    }

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

  // ── Issues ──────────────────────────────────────────────────────────────────
  http.get('http://192.168.100.167:8000/api/complaints/', () => {
    return HttpResponse.json(MOCK_ISSUES, { status: 200 })
  }),

  // ⚠️ heatmap MUST be before :id/ — otherwise :id matches "heatmap"
  http.get('http://192.168.100.167:8000/api/issues/heatmap/', () => {
    return HttpResponse.json(
      [
        {
          id: 1,
          title: 'Large pothole on Baneshwor main road',
          priority: 'critical',
          status: 'in_progress',
          category: 'Road & Transport',
          lat: 27.6939,
          lng: 85.3367,
        },
        {
          id: 2,
          title: 'Water supply cut off in Lalitpur ward 5',
          priority: 'high',
          status: 'open',
          category: 'Water & Drainage',
          lat: 27.6644,
          lng: 85.3188,
        },
        {
          id: 3,
          title: 'Street lights not working on Kalanki',
          priority: 'medium',
          status: 'pending',
          category: 'Electricity',
          lat: 27.6947,
          lng: 85.2793,
        },
        {
          id: 4,
          title: 'Garbage pile-up near Koteshwor bus park',
          priority: 'low',
          status: 'resolved',
          category: 'Waste Management',
          lat: 27.6762,
          lng: 85.3467,
        },
        {
          id: 5,
          title: 'Broken sewer line flooding pavement',
          priority: 'high',
          status: 'open',
          category: 'Water & Drainage',
          lat: 27.6644,
          lng: 85.3247,
        },
        {
          id: 6,
          title: 'Playground equipment broken in Ratnapark',
          priority: 'low',
          status: 'pending',
          category: 'Parks & Green',
          lat: 27.7041,
          lng: 85.3145,
        },
        {
          id: 7,
          title: 'Road cave-in near Chabahil junction',
          priority: 'critical',
          status: 'open',
          category: 'Road & Transport',
          lat: 27.7172,
          lng: 85.3456,
        },
        {
          id: 8,
          title: 'Flooding in Balaju industrial area',
          priority: 'high',
          status: 'in_progress',
          category: 'Water & Drainage',
          lat: 27.735,
          lng: 85.305,
        },
        {
          id: 9,
          title: 'Power outage in Bhaktapur old town',
          priority: 'critical',
          status: 'open',
          category: 'Electricity',
          lat: 27.671,
          lng: 85.4298,
        },
        {
          id: 10,
          title: 'Damaged footpath near Pashupati temple',
          priority: 'medium',
          status: 'pending',
          category: 'Road & Transport',
          lat: 27.7109,
          lng: 85.3484,
        },
        {
          id: 11,
          title: 'Illegal dumping near Bagmati river bank',
          priority: 'high',
          status: 'open',
          category: 'Waste Management',
          lat: 27.6789,
          lng: 85.3123,
        },
        {
          id: 12,
          title: 'Broken water pipeline in Kirtipur',
          priority: 'medium',
          status: 'in_progress',
          category: 'Water & Drainage',
          lat: 27.6762,
          lng: 85.2793,
        },
        {
          id: 13,
          title: 'Street light failure near airport road',
          priority: 'high',
          status: 'pending',
          category: 'Electricity',
          lat: 27.6966,
          lng: 85.3591,
        },
        {
          id: 14,
          title: 'Pothole cluster near Maharajgunj',
          priority: 'medium',
          status: 'open',
          category: 'Road & Transport',
          lat: 27.735,
          lng: 85.3317,
        },
        {
          id: 15,
          title: 'Overgrown park in Lazimpat',
          priority: 'low',
          status: 'resolved',
          category: 'Parks & Green',
          lat: 27.7172,
          lng: 85.3188,
        },
      ],
      { status: 200 }
    )
  }),

  http.get('http://192.168.100.167:8000/api/complaint/:id/', ({ params }) => {
    const issue = MOCK_ISSUES.find((i) => i.id === Number(params.id))
    if (!issue) {
      return HttpResponse.json({ message: 'Issue not found' }, { status: 404 })
    }
    return HttpResponse.json(issue, { status: 200 })
  }),

  // ── Upvote ──────────────────────────────────────────────────────────────────
  http.post('http://localhost:8000/api/issues/:id/upvote/', ({ params }) => {
    const id = Number(params.id)

    if (upvotedIds.has(id)) {
      return HttpResponse.json(
        { message: 'You have already upvoted this issue.' },
        { status: 400 }
      )
    }

    upvotedIds.add(id)
    const issue = MOCK_ISSUES.find((i) => i.id === id)
    const newCount = (issue?.upvote_count ?? 0) + 1
    return HttpResponse.json({ upvote_count: newCount }, { status: 200 })
  }),

  http.get('http://localhost:8000/api/admin/summary/', () => {
    return HttpResponse.json(
      {
        total_issues: 15,
        open_issues: 6,
        in_progress: 3,
        resolved_issues: 3,
        critical_issues: 3,
        total_users: 142,
        new_users_today: 4,
        total_upvotes: 118,
        resolution_rate: 40, // percentage
        avg_resolve_days: 5.2,
        by_category: [
          { category: 'Road & Transport', count: 5 },
          { category: 'Water & Drainage', count: 4 },
          { category: 'Electricity', count: 3 },
          { category: 'Waste Management', count: 2 },
          { category: 'Parks & Green', count: 1 },
        ],
        by_priority: [
          { priority: 'critical', count: 3 },
          { priority: 'high', count: 5 },
          { priority: 'medium', count: 4 },
          { priority: 'low', count: 3 },
        ],
      },
      { status: 200 }
    )
  }),

  // ── Staff list ────────────────────────────────────────────────────────────────
  http.get('http://localhost:8000/api/admin/staff/', () => {
    return HttpResponse.json(
      [
        {
          id: 10,
          name: 'Ramesh Shrestha',
          email: 'ramesh@civicaid.np',
          department: 'Road & Transport',
        },
        {
          id: 11,
          name: 'Sita Karki',
          email: 'sita@civicaid.np',
          department: 'Water & Drainage',
        },
        {
          id: 12,
          name: 'Bikram Thapa',
          email: 'bikram@civicaid.np',
          department: 'Electricity',
        },
        {
          id: 13,
          name: 'Anita Maharjan',
          email: 'anita@civicaid.np',
          department: 'Waste Management',
        },
        {
          id: 14,
          name: 'Suresh Pandey',
          email: 'suresh@civicaid.np',
          department: 'Parks & Green',
        },
      ],
      { status: 200 }
    )
  }),

  // ── Admin update issue ────────────────────────────────────────────────────────
  http.patch(
    'http://localhost:8000/api/admin/issues/:id/',
    async ({ request, params }) => {
      const body = await request.json()
      const id = Number(params.id)
      const issue = MOCK_ISSUES.find((i) => i.id === id)
      if (!issue) {
        return HttpResponse.json(
          { message: 'Issue not found' },
          { status: 404 }
        )
      }
      // Apply updates to mock (in-memory only)
      if (body.status) issue.status = body.status
      if (body.assigned_staff) issue.assigned_staff = body.assigned_staff
      if (body.remark) issue.remark = body.remark
      issue.updated_at = new Date().toISOString()
      return HttpResponse.json(issue, { status: 200 })
    }
  ),

  // ── Bulk update ───────────────────────────────────────────────────────────────
  http.post(
    'http://localhost:8000/api/admin/issues/bulk-update/',
    async ({ request }) => {
      const { ids, status } = await request.json()
      let updated = 0
      ids.forEach((id) => {
        const issue = MOCK_ISSUES.find((i) => i.id === id)
        if (issue) {
          issue.status = status
          updated++
        }
      })
      return HttpResponse.json(
        { updated, message: `${updated} issues updated.` },
        { status: 200 }
      )
    }
  ),

  // ── Staff assigned issues ─────────────────────────────────────────────────────
  http.get('http://localhost:8000/api/staff/issues/', () => {
    // Return a subset simulating issues assigned to this staff member
    return HttpResponse.json(
      MOCK_ISSUES.filter((i) =>
        ['open', 'in_progress', 'pending'].includes(i.status)
      ).slice(0, 5),
      { status: 200 }
    )
  }),

  // ── Staff quick status update ─────────────────────────────────────────────────
  http.patch(
    'http://localhost:8000/api/staff/issues/:id/status/',
    async ({ request, params }) => {
      const { status } = await request.json()
      const issue = MOCK_ISSUES.find((i) => i.id === Number(params.id))
      if (!issue) {
        return HttpResponse.json(
          { message: 'Issue not found' },
          { status: 404 }
        )
      }
      issue.status = status
      issue.updated_at = new Date().toISOString()
      return HttpResponse.json(issue, { status: 200 })
    }
  ),
]
