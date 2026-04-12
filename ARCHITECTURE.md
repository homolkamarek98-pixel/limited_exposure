# Architektura — Limited Exposure

## Adresářová struktura
```
limited_exposure/
├── src/
│   ├── app/              (Next.js App Router — FRONTEND)
│   ├── components/       (FRONTEND)
│   ├── api/              (BACKEND)
│   └── lib/              (BACKEND)
├── prisma/               (BACKEND)
├── design/               (DESIGNER)
├── public/assets/        (DESIGNER)
├── tests/                (QA)
└── e2e/                  (QA)
```

## Stack
- Next.js 14+ App Router + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth.js (email + Google)
- Stripe (platby)
- Cloudflare R2 (storage obrázků)
- Vercel (deploy)

## Databázové schéma

### User
| pole      | typ      | popis                              |
|-----------|----------|------------------------------------|
| id        | String   | cuid, PK                           |
| email     | String   | unique                             |
| name      | String?  |                                    |
| role      | Role     | buyer / photographer / admin       |
| createdAt | DateTime |                                    |

### Photographer
| pole        | typ    | popis                          |
|-------------|--------|--------------------------------|
| id          | String | cuid, PK                       |
| userId      | String | FK → User                      |
| bio         | String |                                |
| instagram   | String |                                |
| totalSales  | Int    | počet prodaných kusů           |

### Photo
| pole          | typ    | popis                              |
|---------------|--------|------------------------------------|
| id            | String | cuid, PK                           |
| title         | String |                                    |
| photographerId| String | FK → Photographer                  |
| description   | String |                                    |
| imageUrl      | String | URL v Cloudflare R2                |
| format        | Format | S / M / L                          |

### Edition
| pole           | typ           | popis                                        |
|----------------|---------------|----------------------------------------------|
| id             | String        | cuid, PK                                     |
| photoId        | String        | FK → Photo                                   |
| type           | EditionType   | limited_count / time_window                  |
| price          | Int           | v haléřích (centimech)                        |
| totalCount     | Int?          | max kusů (pro limited_count)                  |
| soldCount      | Int           | prodáno                                      |
| availableUntil | DateTime?     | deadline (pro time_window)                   |
| tier           | Tier          | rising_talent / signature                    |

### Order
| pole             | typ         | popis                     |
|------------------|-------------|---------------------------|
| id               | String      | cuid, PK                  |
| buyerId          | String      | FK → User                 |
| editionId        | String      | FK → Edition              |
| certificateNumber| Int         | pořadové číslo tisku      |
| stripePaymentId  | String      | Stripe payment intent ID  |
| status           | OrderStatus | pending/paid/cancelled    |
| createdAt        | DateTime    |                           |

### Certificate
| pole       | typ      | popis                    |
|------------|----------|--------------------------|
| id         | String   | cuid, PK                 |
| orderId    | String   | FK → Order, unique       |
| serialNumber| String  | např. "LE-0042/50"       |
| printedAt  | DateTime |                          |

## API endpointy (Fáze 2)
- GET  /api/listings          — seznam dostupných edic
- GET  /api/listings/[id]     — detail edice
- POST /api/listings          — vytvoření edice (photographer/admin)
- POST /api/upload            — upload fotografie do R2

## URL struktura (Fáze 3)
- /                           — homepage (featured works)
- /listing/[id]               — detail fotografie + edice
- /photographer/[id]          — profil fotografa
- /order/[id]                 — potvrzení objednávky + certifikát
- /admin                      — admin dashboard
