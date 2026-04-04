import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  githubUsername: z.string().optional(),
  plan: z.enum(['starter', 'pro', 'enterprise']),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = leadSchema.parse(body);

    await db.insert(leads).values({
      name: data.name,
      email: data.email,
      githubUsername: data.githubUsername || null,
      plan: data.plan,
      message: data.message || null,
    });

    // Send email notification (graceful fail)
    try {
      if (process.env.RESEND_API_KEY) {
        const { sendEmail } = await import('@/lib/email/resend');
        await sendEmail({
          to: 'ahmed.alaa.eldin.hamdy@gmail.com',
          subject: `New Lead: ${data.name} wants Ignitra ${data.plan}`,
          html: `
            <h2>New Ignitra Lead!</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>GitHub:</strong> ${data.githubUsername || 'Not provided'}</p>
            <p><strong>Plan:</strong> ${data.plan}</p>
            <p><strong>Message:</strong> ${data.message || 'None'}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          `,
        });
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 },
      );
    }
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
