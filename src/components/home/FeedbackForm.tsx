'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';

const SERVICES = ['Nanoplastia', 'Hair Extensions', 'Color Correction', 'Altro'];

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    service: '',
    rating: 5,
    review: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante l\'invio');
      }

      setSubmitMessage('✅ Grazie per la tua recensione! È stata pubblicata con successo.');
      setFormData({
        firstName: '',
        lastName: '',
        service: '',
        rating: 5,
        review: '',
      });

      // Ricarica la pagina dopo 2 secondi per mostrare la nuova recensione
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setSubmitMessage('❌ Errore durante l\'invio. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  return (
    <Section background="white" padding="xl">
      <Container size="md">
        <div className="text-center">
          <h2 className="section-heading">Lascia la Tua Recensione</h2>
          <p className="section-subtitle">
            Condividi la tua esperienza con noi e aiuta altre clienti a scoprire i nostri servizi
          </p>
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-br from-gold-50 to-white p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome e Cognome */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-2 block font-medium text-gray-700">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-200"
                  placeholder="Es: Maria"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="mb-2 block font-medium text-gray-700">
                  Cognome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-200"
                  placeholder="Es: Rossi"
                />
              </div>
            </div>

            {/* Servizio */}
            <div>
              <label htmlFor="service" className="mb-2 block font-medium text-gray-700">
                Servizio Effettuato <span className="text-red-500">*</span>
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-200"
              >
                <option value="">Seleziona un servizio</option>
                {SERVICES.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label htmlFor="rating" className="mb-2 block font-medium text-gray-700">
                Valutazione <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  id="rating"
                  name="rating"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  className="flex-1"
                />
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-2xl ${
                        star <= formData.rating ? 'text-gold-500' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-2 font-bold text-gray-700">({formData.rating}/5)</span>
                </div>
              </div>
            </div>

            {/* Recensione */}
            <div>
              <label htmlFor="review" className="mb-2 block font-medium text-gray-700">
                La Tua Recensione <span className="text-red-500">*</span>
              </label>
              <textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleChange}
                required
                rows={6}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-200"
                placeholder="Raccontaci la tua esperienza da Paparazzo Parrucchieri..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Minimo 50 caratteri - {formData.review.length}/500
              </p>
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div
                className={`rounded-lg p-4 text-center font-medium ${
                  submitMessage.includes('✅')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {submitMessage}
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.firstName ||
                  !formData.lastName ||
                  !formData.service ||
                  formData.review.length < 50
                }
                className="inline-flex items-center justify-center rounded-lg bg-gold-500 px-8 py-4 font-bold text-white transition-all hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="mr-2 h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Invio in corso...
                  </>
                ) : (
                  <>
                    ✨ Invia Recensione
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Container>
    </Section>
  );
}
