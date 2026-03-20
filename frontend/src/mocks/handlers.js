import { http, HttpResponse } from 'msw'

export const handlers = [
 http.post('http://localhost:8000/api/issues', async ({ request }) => {
  const formData = await request.formData()

  const title = formData.get('title')
  const description = formData.get('description')
  const category = formData.get('category')
  const image = formData.get('image')
  const latitude = formData.get('latitude')
  const longitude = formData.get('longitude')

  console.log('MSW received issue:', {
    title,
    description,
    category,
    hasImage: !!image,
    location: latitude ? { latitude, longitude } : null,
  })

  return HttpResponse.json({
    message: 'Issue submitted successfully',
    issue: {
      id: Math.floor(Math.random() * 1000),
      title,
      description,
      category,
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  }, { status: 201 })
}),
]
