import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Ignitra — The AI-Native SaaS Boilerplate';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #030014 0%, #0F172A 50%, #1E1B4B 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#0F4C75',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 900,
              color: '#fff',
            }}
          >
            A
          </div>
          <span style={{ fontSize: '48px', fontWeight: 900, color: '#F1F5F9', letterSpacing: '-0.03em' }}>
            Ignitra
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#94A3B8',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Launch your AI SaaS in days, not months
        </div>

        {/* Features pill */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '40px',
          }}
        >
          {['Auth', 'Payments', 'AI Chat', 'Usage Billing'].map((f) => (
            <div
              key={f}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#CBD5E1',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              {f}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
