# Domain Marketplace with Real Purchases

## Goal
Transform this project into a GoDaddy-style marketplace where customers can search domains, buy available names, manage renewals, and edit DNS records from one account.

## Customer experience
- Replace the public farming homepage with a polished domain-search storefront.
- Show availability, alternatives, first-year pricing, renewal pricing, and supported extensions.
- Add a cart and checkout review that rechecks availability before payment.
- Reuse the existing email/Google sign-in flow for customer accounts.
- Add a protected “My Domains” area for domain status, expiry, auto-renew, contact details, nameservers, and DNS records.
- Add clear states for pending registration, active, expiring, failed, and transferred domains.

## Real registration and payments
- Integrate an accredited registrar/reseller API rather than pretending to register domains.
- Keep registrar credentials and registration calls server-side.
- Use the registrar’s sandbox first, then switch to production after the reseller account is approved and funded.
- Add payment checkout only after confirming the seller’s country and the payment provider’s support for domain resale.
- Reserve payment, recheck availability, register the domain, then finalize the order; automatically release/refund failed registrations.
- Receive signed registrar and payment webhooks for registration, renewal, expiry, transfer, and payment updates.

## Accounts and data
- Store customer-owned domain records, orders, prices, contacts, DNS records, renewals, and audit history in the project backend.
- Protect every customer record so users can access only their own domains and orders.
- Keep registrar secrets, payment secrets, and webhook signatures outside browser code.
- Do not store full card details.

## Admin operations
- Add an admin-only area for extension pricing, margins, orders, registration failures, renewals, refunds, and support actions.
- Store admin roles separately and validate them on the server.
- Add idempotency and audit records so retries cannot double-charge or double-register a domain.

## Delivery sequence
1. Build the marketplace storefront, domain search flow, cart, account area, and empty operational states.
2. Add the secure database model and account permissions.
3. Connect the selected registrar sandbox for live availability, pricing, registration, renewal, and DNS.
4. Connect a compatible payment provider and signed webhooks.
5. Test failed payment, domain race, duplicate request, refund, renewal, and webhook retry scenarios.
6. Switch to production registrar credentials only after the user’s reseller account is approved and funded.

## Technical details
- Keep TanStack Start routing and the existing authentication foundation.
- Use server functions for customer actions and public server routes for signed webhooks.
- Use a registrar adapter so the provider can be replaced without rebuilding the interface.
- Existing farming pages will remain untouched during the marketplace build, but the public homepage and primary account navigation will become domain-focused.

## Required external setup
- A registrar/reseller account with API access, production approval, and prefunded balance or credit terms.
- The seller’s registered country and legal/business details.
- A supported payment merchant account for domain resale.
- Registrar and payment credentials added through Project Settings → Secrets.
