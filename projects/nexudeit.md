# Nexudeit

**A peer-to-peer marketplace.** People buy, sell, make offers and swap, with trade protection that
holds the buyer's money until the outcome is settled. Live at [nexudeit.com](https://nexudeit.com).

**My role:** founder and engineer. Product, architecture, application code, payments, database,
deployment and incident response.

---

## Architecture

- **Web:** Next.js 16 (App Router), React 19, TypeScript.
- **Data:** MySQL, with Prisma for schema and migrations.
- **Payments:** Stripe across the whole lifecycle: authorization, card holds, capture, release,
  refunds, and dispute webhooks.
- **Hosting:** AWS (EC2, RDS, S3) behind nginx and Cloudflare.

## Selected engineering problems

### Trade protection with card holds
A marketplace between strangers needs a reason for the buyer to trust the seller. Payments for
protected trades are authorized with **manual capture**: the money is held on the buyer's card, then
captured or released depending on how the trade ends. Auctions, accepted offers and swaps settle at
the price recorded on the server when the deal was made, never at a price the browser supplies.

### The cart that trusted the browser's prices
The cart lives in the browser, and each item carried its own price to the server. Four places that
take money trusted that price: the checkout session, paying with a saved card, order creation, and
the pricing of order lines. Someone who edited their cart in the browser could set a lower price and
underpay.

A price that comes from the browser is a request, not a fact. The fix is one small module that looks
up the real catalog price, minus any active discount, and **floors every cart item at that price**,
applied at all four charge points. Orders store the recomputed totals, and seller payouts and fees use
the corrected items.

I chose a floor rather than rejecting the cart for two reasons. It needs no assumptions about how
variants are priced, so a legitimate up-charge passes through unchanged. And it cannot overcharge a
customer who really has a discount. That is a smaller change that cannot break a legitimate order.

**The rule I took from it: the server decides money.** Anything the browser sends is input to check.
