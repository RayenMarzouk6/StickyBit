const URLSCAN_API = 'https://urlscan.io/api/v1'

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return Response.json({ error: 'URL is required' }, { status: 400 })
    }

    const apiKey = process.env.URLSCAN_API_KEY
    if (!apiKey) {
      return Response.json(
        { error: 'URLScan API key not configured' },
        { status: 500 }
      )
    }

    // 🔹 Submit URL to urlscan
    const response = await fetch(`${URLSCAN_API}/scan/`, {
      method: 'POST',
      headers: {
        'API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        visibility: 'private',
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return Response.json(
        { error: 'URLScan submit failed', details: err },
        { status: response.status }
      )
    }

    const data = await response.json()

    // data.uuid is IMPORTANT
    return Response.json({
      uuid: data.uuid,
      resultUrl: data.result,
      message: 'Scan submitted successfully',
    })
  } catch (error) {
    return Response.json(
      { error: 'Failed to submit URL', details: String(error) },
      { status: 500 }
    )
  }
}

// 🔹 GET scan result by UUID
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const uuid = searchParams.get('uuid')

    if (!uuid) {
      return Response.json(
        { error: 'UUID is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${URLSCAN_API}/result/${uuid}/`)

    if (!response.ok) {
      return Response.json(
        { status: 'PENDING', message: 'Scan not ready yet' },
        { status: 202 }
      )
    }

    const data = await response.json()

    // 🔥 Analyze risk
    const verdict = analyzeRisk(data)

    return Response.json({
      status: 'DONE',
      verdict,
      data,
    })
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch result', details: String(error) },
      { status: 500 }
    )
  }
}
function analyzeRisk(scanResult: any) {
  const consoleMessages = scanResult.data?.console || []

  const passwordWarning = consoleMessages.some((c: any) =>
    c.message?.text?.toLowerCase().includes('password')
  )

  const socialEngineering =
    JSON.stringify(scanResult).toLowerCase().includes('social-engineering')

  if (passwordWarning || socialEngineering) {
    return {
      level: 'DANGER',
      reason: 'Phishing behavior detected',
    }
  }

  if (scanResult.stats?.malicious > 0) {
    return {
      level: 'WARNING',
      reason: 'Suspicious activity detected',
    }
  }

  return {
    level: 'SAFE',
    reason: 'No malicious behavior detected',
  }
}
