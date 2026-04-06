---
title: Building a Native A/B Testing System for Shopify Plus Checkout
author: Aditya Pasikanti
tags: ab-testing, checkout extensibility, shopify plus, checkout ui extensions, aws, lambda, dynamodb
date: 2026-04-03
---

# Building a Native A/B Testing System for Shopify Plus Checkout

## Overview

At Vedic Lab, we customized the Shopify checkout experience by adding **Trust Badges** and **Reviews** using Shopify Checkout UI Extensions. The client wanted to measure whether these additions actually improved conversion rates — which meant running an A/B test between the old (default) checkout and the new (enhanced) checkout.

The problem: **no existing Shopify app offers A/B testing for checkout.** Due to Checkout Extensibility, third-party scripts cannot be injected into the checkout flow, which means traditional A/B testing tools simply don't work there.

So we built it from scratch — a fully native A/B testing system using Cart Attributes, Checkout UI Extensions, and an AWS backend.

> **Note:** This solution is only possible on **Shopify Plus** stores. Checkout UI Extensions and Checkout Extensibility are exclusive to the Shopify Plus plan.

---

## The Problem

- The client added Trust Badges and Customer Reviews to the checkout page using Checkout UI Extensions.
- They wanted to compare the **conversion rate** of the new checkout (with trust badges and reviews) against the old checkout (without them).
- No Shopify app supports A/B testing at checkout because Checkout Extensibility blocks third-party scripts from running in the checkout flow.
- Shopify itself does not provide any built-in analytics or comparison tools for checkout variants.

---

## The Solution — How It Works

The system has four key parts:

1. **Token Assignment** — Assign each visitor to variant A or B when they land on the site.
2. **Cart Attribute** — Attach the assigned variant token to the cart so it travels to checkout.
3. **Checkout UI Extension** — Read the token at checkout and conditionally show or hide the new checkout elements.
4. **Backend + Analytics** — Track token usage, manage supply, and store conversion data.

### Architecture Diagram

```
User lands on site
        |
        v
Storefront JS calls AWS Lambda
        |
        v
Lambda checks DynamoDB, assigns A or B token
        |
        v
Token stored as cart attribute (ab_token)
        |
        v
User adds to cart --> ab_token travels with the cart
        |
        v
At Checkout: UI Extension reads ab_token
        |
        +--> A: Old checkout (default, no extras)
        |
        +--> B: New checkout (trust badges + reviews)
        |
        v
Order placed --> Lambda updates DynamoDB (reduces token count)
        |
        v
Analytics written to Shop metafields
```

---

## Step-by-Step Breakdown

### 1. Token Assignment on the Storefront

When a user lands on the Vedic Lab website, a JavaScript call is made to an **AWS Lambda function**. The Lambda function checks the available token pool in DynamoDB and assigns the user either an **A** or **B** token.

- **A** = Old checkout (default Shopify checkout, no modifications)
- **B** = New checkout (with Trust Badges and Reviews)

This assignment happens once per visitor session so the experience remains consistent throughout their browsing.

### 2. Storing the Token as a Cart Attribute

Once the token is assigned, it is stored as a **Shopify cart attribute** with the key `ab_token`. Cart attributes persist across the shopping session and are carried forward into the checkout flow.

When the user adds any product to their cart, the `ab_token` value is already attached to the cart and requires no further action.

### 3. Reading the Token at Checkout

At the checkout stage, a **Checkout UI Extension** (built as part of Shopify's Checkout Extensibility framework) reads the `ab_token` cart attribute.

- If `ab_token` = **A** — The extension does nothing. The user sees the default Shopify checkout.
- If `ab_token` = **B** — The extension renders the Trust Badges and Customer Reviews within the checkout page.

This is seamless to the user. They see one version of checkout without knowing they are part of a test.

### 4. Backend — AWS Lambda + DynamoDB

The backend is a lightweight setup:

- **AWS Lambda** — A serverless function that handles two operations:
  - **Token assignment** — Called from the storefront to assign A or B to a new visitor.
  - **Token consumption** — Called when an order is placed to decrement the token count.
- **DynamoDB** — Stores the token pool and tracks usage. The initial setup allocated:
  - **10,000 A tokens** (old checkout)
  - **10,000 B tokens** (new checkout)

Each time an order is placed, the corresponding token (A or B) is consumed — its count is reduced by one in DynamoDB. This ensures the test runs for a defined sample size (10,000 orders per variant, 20,000 total).

### 5. Analytics — Shop Metafields

Since Shopify does not provide built-in analytics for checkout variant testing, we store all the performance data on **Shop metafields**. This includes:

- Total orders placed with variant A
- Total orders placed with variant B
- Conversion rates for each variant
- Any additional metrics the client wants to track

By using Shop metafields, the client can view the A/B test results directly from the Shopify admin without needing access to AWS or any external dashboard.

---

## Why This Approach Works

| Challenge | How We Solved It |
|-----------|-----------------|
| No app supports checkout A/B testing | Built it natively using Shopify's own tools |
| Scripts can't run in checkout | Used Checkout UI Extensions (allowed by Shopify Plus) |
| Need to pass data from storefront to checkout | Used cart attributes (`ab_token`) |
| Need controlled sample sizes | Pre-allocated 10k A + 10k B tokens in DynamoDB |
| Shopify has no checkout variant analytics | Stored analytics in Shop metafields |
| Need a lightweight, scalable backend | Used AWS Lambda (serverless) + DynamoDB |

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Storefront | Shopify Liquid + Vanilla JS |
| Checkout customization | Shopify Checkout UI Extensions |
| Data transport (storefront to checkout) | Shopify Cart Attributes |
| Backend API | AWS Lambda (serverless) |
| Database | AWS DynamoDB |
| Analytics storage | Shopify Shop Metafields |
| Store plan requirement | **Shopify Plus** |

---

## Key Takeaways

1. **Checkout Extensibility is not a limitation — it's a framework.** While it blocks third-party scripts, Checkout UI Extensions give you controlled, sanctioned access to customize the checkout experience.

2. **Cart attributes are a powerful data bridge.** They allow you to pass information from the storefront all the way into checkout without any hacks or workarounds.

3. **You don't need a heavy backend.** A single Lambda function and a DynamoDB table were enough to power the entire token management and analytics pipeline.

4. **Shop metafields make analytics accessible.** By writing results to metafields, the client can check performance from the Shopify admin — no external tools or developer access needed.

5. **This requires Shopify Plus.** Checkout UI Extensions and Checkout Extensibility are only available on Shopify Plus plans. This solution cannot be implemented on standard Shopify plans.
