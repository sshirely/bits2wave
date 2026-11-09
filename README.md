# PayPal Pact

## The pitch

PayPal Pact turns an informal freelancer-client conversation into a clear, milestone-based payment agreement. AI translates plain language into deliverables and release amounts, compares submitted proof against the original pact, and explains a fair resolution when scope or quality is disputed.

**One-line pitch:** Upwork-style milestone protection for any freelancer relationship, powered by explainable AI and PayPal payments.

## Two-minute demo

1. Enter the demo workspace as a freelancer or client.
2. Describe a project in plain language and choose one of the top freelancer matches.
3. Attach a brief and let AI generate milestones and budget splits.
4. Review the freelancer QR identity and choose a payment method.
5. Fund the pact through the PayPal Sandbox-style checkout.
6. Upload proof of work and submit it for AI review.
7. Approve a milestone to see the payout confirmation.
8. Open AI dispute review to compare the original terms with client feedback.
9. Use **Reset demo** to restart instantly.

## What makes it different

- **Plain-language agreement creation:** no legal or payment expertise required.
- **AI evidence comparison:** submitted files and feedback are checked against agreed deliverables.
- **Explainable dispute resolutions:** the AI shows which terms support a release, pause, or next step.
- **Separate scope-change pacts:** extra work becomes a new agreement instead of an argument over the original budget.

## PayPal value

The prototype demonstrates PayPal-style checkout, escrow locking, milestone release, payment references, webhook verification states, and freelancer payment QR identities. Payment, webhook, and storage labels are intentionally marked as Sandbox/demo because no production credentials are included.

## Architecture

- Next.js App Router and React
- Tailwind CSS with a dark, high-trust financial UI
- Client-side demo state for the hackathon flow
- AI agreement, evidence, and dispute interaction surfaces
- PayPal Sandbox-ready payment states and QR payment identity

## Production roadmap

1. Add Supabase or Neon authentication, database persistence, RLS, and private file storage.
2. Replace the checkout simulation with PayPal Orders API and server-side order validation.
3. Add PayPal webhook signature verification and idempotent payment state updates.
4. Bind QR codes to verified freelancer payment identities rather than demo records.
5. Add production dispute, refund, audit-log, and moderation policies.

## Important demo note

This repository is optimized for a self-contained hackathon presentation. It does not claim to process real money or store private files until the production integrations in the roadmap are configured.
