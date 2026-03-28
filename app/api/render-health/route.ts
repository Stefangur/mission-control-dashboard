export async function GET() {
  const apiKey = process.env.RENDER_API_KEY
  
  if (!apiKey) {
    return Response.json(
      { error: 'RENDER_API_KEY not configured' },
      { status: 500 }
    )
  }

  try {
    // Target apps: sgu-dashboard-hub, stefan-fitness-dashboard-v2, stefan-portfolio-dashboard-v2, stefan-openclaw-system-dashboard
    const apps = [
      'sgu-dashboard-hub',
      'stefan-fitness-dashboard-v2',
      'stefan-portfolio-dashboard-v2',
      'stefan-openclaw-system-dashboard',
    ]

    const healthData = await Promise.all(
      apps.map(async (serviceName) => {
        try {
          const response = await fetch(
            `https://api.render.com/v1/services?name=${serviceName}`,
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Accept': 'application/json',
              },
            }
          )

          if (!response.ok) {
            return {
              serviceName,
              status: 'unknown',
              lastDeploy: null,
              error: `API error: ${response.status}`,
            }
          }

          const data = await response.json()
          const service = data.services?.[0]

          if (!service) {
            return {
              serviceName,
              status: 'not_found',
              lastDeploy: null,
            }
          }

          return {
            serviceName,
            status: service.status || 'unknown',
            lastDeploy: service.updatedAt,
            plan: service.plan,
          }
        } catch (error) {
          return {
            serviceName,
            status: 'error',
            error: String(error),
          }
        }
      })
    )

    const response = Response.json({
      apps: healthData,
      timestamp: new Date().toISOString(),
    })

    // ✅ CRITICAL FIX: No-cache headers to prevent stale data
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    return Response.json(
      { error: 'Render health check failed', details: String(error) },
      { status: 500 }
    )
  }
}
