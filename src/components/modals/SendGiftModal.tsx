import { useEffect, useMemo, useState } from 'react';
import FormModal from './FormModal';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import styles from './sendGiftModal.module.css';

type Denom = { amount: number; currency: string };

type CatalogProduct = {
  code: string;
  name: string;
  themeCode: string;
  denominations: Denom[];
};

type CatalogResponse = {
  configured: boolean;
  feeDisclosure: string;
  styleCode: string | null;
  products: CatalogProduct[];
  catalogWarning?: string;
};

interface SendGiftModalProps {
  tenantId: string;
  tenantName: string;
  onClose: () => void;
}

function formatMoney(amountCents: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).format(amountCents / 100);
  } catch {
    return `${(amountCents / 100).toFixed(2)} ${currency}`;
  }
}

const SendGiftModal = ({ tenantId, tenantName, onClose }: SendGiftModalProps) => {
  const { accessToken } = useAuth();
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedProductIdx, setSelectedProductIdx] = useState(0);
  const [selectedDenom, setSelectedDenom] = useState<Denom | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadError(null);
      try {
        const { data } = await axiosInstance.get<CatalogResponse>('/api/landlords/tenant-gifts/catalog', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (cancelled) return;
        if (!data.products?.length) {
          if (!cancelled) setLoadError('Gift catalog was empty. Try again or contact support.');
          return;
        }
        setCatalog(data);
        const first = data.products[0];
        if (first?.denominations[0]) {
          setSelectedDenom(first.denominations[0]);
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const msg =
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
            ? (err as { response: { data: { message: string } } }).response.data.message
            : 'Could not load gift options. Check that you are logged in and the server is running.';
        setLoadError(msg);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const selectedProduct = catalog?.products[selectedProductIdx] ?? null;

  const styleCode = useMemo(() => {
    if (!catalog) return null;
    return catalog.styleCode;
  }, [catalog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catalog || !selectedProduct || !selectedDenom) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await axiosInstance.post(
        '/api/landlords/tenant-gifts/send',
        {
          tenantId,
          productCode: selectedProduct.code,
          productThemeCode: selectedProduct.themeCode,
          styleCode: styleCode ?? undefined,
          amount: selectedDenom.amount,
          currency: selectedDenom.currency,
          personalMessage: message,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      onClose();
    } catch (err: unknown) {
      const msg =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (err as { response: { data: { message: string } } }).response.data.message
          : 'Could not send gift. Try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal title={`Send a gift to ${tenantName}`} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {loadError && <p className={styles.error}>{loadError}</p>}
        {catalog && (
          <>
            <p className={styles.feeBox}>{catalog.feeDisclosure}</p>
            {!catalog.configured && (
              <p className={styles.demoNote}>
                {catalog.catalogWarning
                  ? catalog.catalogWarning
                  : 'Prezzee API token is not set on the server. You can still send a demo gift link for testing.'}
              </p>
            )}
            {catalog.products.length > 1 && (
              <label className={styles.label}>
                Product
                <select
                  className={styles.select}
                  value={selectedProductIdx}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setSelectedProductIdx(idx);
                    const p = catalog.products[idx];
                    setSelectedDenom(p.denominations[0] ?? null);
                  }}
                >
                  {catalog.products.map((p, i) => (
                    <option key={p.code} value={i}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {selectedProduct && (
              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>Gift amount (face value)</legend>
                <div className={styles.denomGrid}>
                  {selectedProduct.denominations.map((d) => (
                    <label key={`${d.amount}-${d.currency}`} className={styles.denomOption}>
                      <input
                        type="radio"
                        name="denom"
                        checked={
                          selectedDenom?.amount === d.amount && selectedDenom?.currency === d.currency
                        }
                        onChange={() => setSelectedDenom(d)}
                      />
                      <span>{formatMoney(d.amount, d.currency)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <label className={styles.label}>
              Personal message (optional)
              <textarea
                className={styles.textarea}
                rows={3}
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Thanks for taking great care of the place."
              />
            </label>
          </>
        )}
        {submitError && <p className={styles.error}>{submitError}</p>}
        <button type="submit" className={styles.submit} disabled={!catalog || !selectedDenom || submitting}>
          {submitting ? 'Sending…' : 'Confirm and send gift'}
        </button>
      </form>
    </FormModal>
  );
};

export default SendGiftModal;
