import { randomUUID } from 'node:crypto';
import { createPrezzeeClient } from '@prezzee/ts-v2-sdks';

export const PLACEPIN_DEMO_PRODUCT = 'PLACEPIN_DEMO';

export const PREZZEE_FEE_DISCLOSURE =
  'Prezzee charges separate purchaser fees at checkout (in addition to the gift value). Those fees are paid by you as the landlord, not deducted from the tenant’s gift balance.';

export const PREZZEE_TENANT_FEE_NOTE =
  'Any separate Prezzee purchaser fees were paid by your landlord and do not reduce your gift value.';

export function isPrezzeeConfigured(): boolean {
  return Boolean(
    (process.env.PREZZEE_API_TOKEN ?? process.env.PREZZEE_TOKEN)?.trim(),
  );
}

function getClient() {
  const token = (process.env.PREZZEE_API_TOKEN ?? process.env.PREZZEE_TOKEN)?.trim();
  if (!token) {
    throw new Error('Prezzee is not configured');
  }
  const env = (process.env.PREZZEE_ENV as 'sandbox' | 'production') || 'sandbox';
  const region = (process.env.PREZZEE_REGION as 'AU' | 'UK') || 'AU';
  return createPrezzeeClient({ token, env, region });
}

export type GiftCatalogProduct = {
  code: string;
  name: string;
  themeCode: string;
  denominations: { amount: number; currency: string }[];
};

const demoCatalog = (): {
  configured: boolean;
  styleCode: string | null;
  products: GiftCatalogProduct[];
} => ({
  configured: false,
  styleCode: 'DEFAULT',
  products: [
    {
      code: PLACEPIN_DEMO_PRODUCT,
      name: 'Demo gift (add PREZZEE_API_TOKEN for live orders)',
      themeCode: 'DEFAULT',
      denominations: [
        { amount: 1000, currency: 'AUD' },
        { amount: 2500, currency: 'AUD' },
        { amount: 5000, currency: 'AUD' },
      ],
    },
  ],
});

export async function fetchGiftCatalog(): Promise<{
  configured: boolean;
  styleCode: string | null;
  products: GiftCatalogProduct[];
  catalogWarning?: string;
}> {
  if (!isPrezzeeConfigured()) {
    return demoCatalog();
  }

  try {
    const client = getClient();
    const [productsRes, stylesRes] = await Promise.all([
      client.listProducts(),
      client.listStyles(),
    ]);

    const styleCode = stylesRes.results?.[0]?.code ?? null;
    const products: GiftCatalogProduct[] = (productsRes.results ?? [])
      .slice(0, 20)
      .map((p) => ({
        code: p.code,
        name: typeof p.name === 'string' ? p.name : p.code,
        themeCode: p.themes?.[0]?.code ?? '',
        denominations: (p.denominations ?? []).map((d) => ({
          amount: d.amount,
          currency: d.currency,
        })),
      }))
      .filter((p) => p.themeCode && p.denominations.length > 0);

    if (products.length > 0 && !styleCode) {
      return {
        ...demoCatalog(),
        catalogWarning:
          'Prezzee returned products but no gift styles for this account. Using demo options until styles exist in Prezzee (check region / sandbox access).',
      };
    }

    if (products.length === 0) {
      return {
        ...demoCatalog(),
        catalogWarning:
          'Prezzee returned no orderable products for this token. Using demo options — verify PREZZEE_ENV (sandbox vs production) and PREZZEE_REGION (AU vs UK).',
      };
    }

    return { configured: true, styleCode, products };
  } catch (err) {
    console.error('fetchGiftCatalog: Prezzee request failed', err);
    return {
      ...demoCatalog(),
      catalogWarning:
        'Could not load live Prezzee catalog (invalid token, wrong region/env, or network). Using demo gift options. Fix PREZZEE_API_TOKEN, PREZZEE_ENV, and PREZZEE_REGION on the server.',
    };
  }
}

export async function fulfillPrezzeeGift(params: {
  productCode: string;
  productThemeCode: string;
  styleCode: string;
  amount: number;
  currency: string;
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  personalMessage: string;
}): Promise<{ voucherUrl: string; orderUuid: string }> {
  if (params.productCode === PLACEPIN_DEMO_PRODUCT || !isPrezzeeConfigured()) {
    const ref = randomUUID();
    return {
      voucherUrl: `https://www.prezzee.com.au/business/?placepin_demo=${ref}`,
      orderUuid: ref,
    };
  }

  const client = getClient();
  const orderRef = randomUUID();
  const order = await client.createOrder({
    reference: orderRef,
    payment_method: 'POSTPAID_CREDIT',
    wait_for_stock: false,
    items: [
      {
        reference: randomUUID(),
        product_code: params.productCode,
        product_theme_code: params.productThemeCode,
        amount: params.amount,
        currency: params.currency,
        delivery_method: 'LINK',
        delivery_details: {
          style_code: params.styleCode,
          message: params.personalMessage,
          recipient_name: params.recipientName,
          recipient_email: params.recipientEmail,
          sender_name: params.senderName,
        },
      },
    ],
  });

  await client.retrieveOrder({ orderUuid: order.uuid }, { awaitCompletion: true });
  const items = await client.listOrderItems({ orderUuid: order.uuid });
  const first = items.results?.[0];
  if (!first?.voucher_url) {
    throw new Error('Prezzee order completed but no voucher URL was returned');
  }

  return {
    voucherUrl: first.voucher_url,
    orderUuid: order.uuid,
  };
}
