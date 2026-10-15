# Nexudeit

A peer-to-peer marketplace. People buy, sell, make offers and swap, and trade
protection holds the buyer's money until the outcome is settled. Live at
[nexudeit.com](https://nexudeit.com).

My role: founder and engineer. Product, architecture, application code,
payments, database, deployment and incident response.

---

## Architecture

- Next.js 16 (App Router), React 19 and TypeScript on the web.
- MySQL, with Prisma for the schema and migrations.
- Stripe for the whole payment lifecycle: authorization, card holds, capture,
  release, refunds and dispute webhooks.
- AWS (EC2, RDS, S3) behind nginx and Cloudflare.

## Selected engineering problems

### Trade protection with card holds
A marketplace between strangers needs a reason for the buyer to trust the
seller. Protected trades are authorized with manual capture: the money is
held on the buyer's card, then captured or released depending on how the
trade ends. Auctions, accepted offers and swaps settle at the price the server
recorded when the deal was made, never at a price the browser sends.

### The cart that trusted the browser's prices
The cart lives in the browser, and each item carried its own price to the
server. Four places that take money trusted that price: the checkout session,
paying with a saved card, order creation, and pricing the order lines. Anyone
who edited their cart in the browser could set a lower price and underpay.

A price from the browser is a request to check. The fix is one small module
that looks up the real catalogue price, minus any active discount, and floors
every cart item at that price. It runs at all four charge points. Orders store
the recomputed totals, and seller payouts and fees use the corrected items.

I went with a floor instead of rejecting the cart for two reasons. It doesn't
need to know how variants are priced, so a legitimate up-charge passes
through unchanged. And it can't overcharge a customer who really has a
discount. It's a smaller change, and it can't break a legitimate order.

What I took from it: the server decides money. Whatever the browser sends is
input to check.
