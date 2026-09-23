import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getStyles } from '../components/styles';
import { submitNetlifyForm, HoneypotField, HONEYPOT_FIELD } from '../lib/netlifyForms';

const STEP_FIELDS = {
  1: ['address', 'zipCode'],
  2: ['name', 'email']
};

export default function HomeValuation({ trackEvent }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: '',
    zipCode: '',
    name: '',
    email: '',
    phone: '',
    [HONEYPOT_FIELD]: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [stepError, setStepError] = useState('');
  const formRef = useRef(null);
  const styles = getStyles(false);

  useEffect(() => {
    document.title = 'Free Home Valuation | Nicholas Liappas | Compass Real Estate';
    const metaTags = [
      { name: 'description', content: 'Get a free, no-obligation home valuation for your North Shore property. Nicholas Liappas at Compass provides personalized Comparative Market Analysis (CMA) for Manhasset, Port Washington, Roslyn, and more.' },
      { name: 'keywords', content: 'home valuation, free home valuation, CMA, comparative market analysis, North Shore real estate, Manhasset valuation, Port Washington valuation' },
    ];
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.name = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = 'https://nicholasliappas.com/home-valuation';
    document.head.appendChild(canonical);
  }, []);

  // Returns true when every required field for the current step has a
  // non-whitespace value and passes native constraint validation.
  const validateStep = () => {
    const form = formRef.current;
    if (form && !form.reportValidity()) return false;
    const missing = STEP_FIELDS[step]?.filter((f) => !formData[f].trim());
    if (missing?.length) {
      setStepError('Please complete all required fields before continuing.');
      return false;
    }
    setStepError('');
    return true;
  };

  const goToStep = (next) => {
    setStepError('');
    setStep(next);
  };

  // Single submit handler: Enter or the visible button advances a step
  // (after validation) until step 3, where it actually sends the form.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      if (validateStep()) goToStep(step + 1);
      return;
    }
    if (submitting) return;
    setSubmitError(false);
    setSubmitting(true);

    try {
      await submitNetlifyForm('home-valuation', formData);
      trackEvent('form_submit', 'Lead_Generation', 'Home_Valuation');
      setSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const stepErrorMessage = stepError && (
    <p role="alert" style={{
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '13px',
      color: '#b00020',
      lineHeight: 1.6,
      margin: 0
    }}>
      {stepError}
    </p>
  );

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={{
        ...styles.hero,
        paddingTop: '200px',
        minHeight: '600px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #1a1a1a 100%)',
        textAlign: 'center'
      }}>
        <div style={styles.heroContent}>
          <h1 style={{
            fontSize: 'clamp(36px, 8vw, 80px)',
            fontWeight: 300,
            letterSpacing: '4px',
            lineHeight: 1,
            marginBottom: '24px',
            color: '#fff'
          }}>
            What's Your Home Worth?
          </h1>

          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 'clamp(14px, 2vw, 18px)',
            fontWeight: 500,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '40px',
            opacity: 0.9,
            color: '#fff'
          }}>
            Get a Free, No-Obligation Home Valuation
          </p>

          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '14px',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.8
          }}>
            Receive a personalized Comparative Market Analysis (CMA) from Nicholas Liappas, a Licensed Associate Real Estate Broker at Compass with 15+ years of North Shore expertise.
          </p>
        </div>
      </section>

      {/* Valuation Form Section */}
      <section style={{ padding: '120px 5%', background: '#fff' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#1a1a1a',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '32px'
              }}>✓</div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 300,
                marginBottom: '12px',
                letterSpacing: '1px'
              }}>Thank You</h2>
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '14px',
                color: '#666',
                marginBottom: '24px',
                lineHeight: 1.8
              }}>
                Your request has been received. Nicholas will prepare your personalized home valuation and reach out within 24-48 hours.
              </p>
              <Link to="/" style={{
                ...styles.btnPrimary,
                display: 'inline-block'
              }}>
                Back to Home
              </Link>
            </div>
          ) : (
            <form
              ref={formRef}
              name="home-valuation"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              aria-label="Home valuation form"
            >
              <input type="hidden" name="form-name" value="home-valuation" />
              <HoneypotField value={formData[HONEYPOT_FIELD]} onChange={(e) => setFormData({...formData, [HONEYPOT_FIELD]: e.target.value})} />

              {/* Step Indicator */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '60px',
                alignItems: 'center'
              }}>
                {[1, 2, 3].map((s) => (
                  <div key={s} style={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: step >= s ? '#1a1a1a' : '#e0e0e0',
                      color: step >= s ? '#fff' : '#999',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '14px',
                      fontWeight: 600,
                      transition: 'all 0.3s ease'
                    }}>
                      {s}
                    </div>
                    {s < 3 && (
                      <div style={{
                        flex: 1,
                        height: '2px',
                        background: step > s ? '#1a1a1a' : '#e0e0e0',
                        marginLeft: '12px',
                        transition: 'all 0.3s ease'
                      }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Property Details */}
              {step === 1 && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <h2 style={{
                    fontSize: '28px',
                    fontWeight: 400,
                    marginBottom: '12px',
                    letterSpacing: '1px'
                  }}>Property Details</h2>
                  <p style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '40px'
                  }}>
                    Where is the property located?
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input
                      type="text"
                      name="address"
                      placeholder="Property Address"
                      autoComplete="street-address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                      style={styles.input}
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="Zip Code"
                      autoComplete="postal-code"
                      inputMode="numeric"
                      pattern="[0-9]{5}(-[0-9]{4})?"
                      title="Enter a 5-digit ZIP code"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                      required
                      style={styles.input}
                    />

                    {stepErrorMessage}
                    <button type="submit" style={{ ...styles.btnPrimary, width: '100%', marginTop: '12px' }}>
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Details */}
              {step === 2 && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <h2 style={{
                    fontSize: '28px',
                    fontWeight: 400,
                    marginBottom: '12px',
                    letterSpacing: '1px'
                  }}>Your Information</h2>
                  <p style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '40px'
                  }}>
                    How can we reach you?
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      style={styles.input}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      style={styles.input}
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number (Optional)"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      style={styles.input}
                    />

                    {stepErrorMessage}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => goToStep(1)}
                        style={{
                          ...styles.btnOutline,
                          flex: 1,
                          background: '#f8f8f8',
                          border: '1px solid #e0e0e0',
                          color: '#1a1a1a'
                        }}>
                        Back
                      </button>
                      <button type="submit" style={{ ...styles.btnPrimary, flex: 1 }}>
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Submit */}
              {step === 3 && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <h2 style={{
                    fontSize: '28px',
                    fontWeight: 400,
                    marginBottom: '12px',
                    letterSpacing: '1px'
                  }}>Review Your Information</h2>
                  <p style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '40px'
                  }}>
                    Please verify your details before submitting.
                  </p>

                  <div style={{
                    background: '#f8f8f8',
                    padding: '32px',
                    marginBottom: '32px',
                    borderRadius: '4px'
                  }}>
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '11px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: '#888',
                        marginBottom: '8px'
                      }}>Property Address</p>
                      <p style={{
                        fontSize: '16px',
                        color: '#1a1a1a',
                        fontWeight: 400
                      }}>{formData.address}</p>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <p style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '11px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: '#888',
                        marginBottom: '8px'
                      }}>Zip Code</p>
                      <p style={{
                        fontSize: '16px',
                        color: '#1a1a1a',
                        fontWeight: 400
                      }}>{formData.zipCode}</p>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <p style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '11px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: '#888',
                        marginBottom: '8px'
                      }}>Your Name</p>
                      <p style={{
                        fontSize: '16px',
                        color: '#1a1a1a',
                        fontWeight: 400
                      }}>{formData.name}</p>
                    </div>

                    <div style={{ marginBottom: '0' }}>
                      <p style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '11px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: '#888',
                        marginBottom: '8px'
                      }}>Email Address</p>
                      <p style={{
                        fontSize: '16px',
                        color: '#1a1a1a',
                        fontWeight: 400
                      }}>{formData.email}</p>
                    </div>
                  </div>

                  <p style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '13px',
                    color: '#666',
                    marginBottom: '32px',
                    lineHeight: 1.8
                  }}>
                    Nicholas will analyze recent comparable sales in your area and provide a comprehensive Comparative Market Analysis (CMA) to determine your home's market value. You can expect to hear from him within 24-48 business hours.
                  </p>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      style={{
                        ...styles.btnOutline,
                        flex: 1,
                        background: '#f8f8f8',
                        border: '1px solid #e0e0e0',
                        color: '#1a1a1a'
                      }}>
                      Back
                    </button>
                    <button type="submit" disabled={submitting} style={{ ...styles.btnPrimary, flex: 1, opacity: submitting ? 0.7 : 1 }}>
                      {submitting ? 'Sending…' : 'Get My Valuation'}
                    </button>
                  </div>
                  {submitError && (
                    <p role="alert" style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '13px',
                      color: '#b00020',
                      textAlign: 'center',
                      lineHeight: 1.6,
                      marginTop: '16px'
                    }}>
                      Something went wrong sending your request. Please call or text{' '}
                      <a href="tel:+15162147761" style={{ color: '#b00020' }}>516-214-7761</a>{' '}
                      or email <a href="mailto:nicholas.liappas@compass.com" style={{ color: '#b00020' }}>nicholas.liappas@compass.com</a>.
                    </p>
                  )}
                </div>
              )}
            </form>
          )}
        </div>
      </section>

      {/* Why Valuation Section */}
      <section style={{ padding: '120px 5%', background: '#f8f8f8' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            ...styles.sectionTitle,
            textAlign: 'center',
            marginBottom: '60px'
          }}>Why Get a Home Valuation?</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px'
          }}>
            {[
              {
                title: 'Selling Your Home',
                description: 'Understand your home\'s true market value before listing. Strategic pricing leads to faster sales and better results.'
              },
              {
                title: 'Refinancing',
                description: 'Know your home\'s current value for refinancing decisions and to understand your equity position.'
              },
              {
                title: 'Estate Planning',
                description: 'Accurate home valuations are essential for estate settlements, insurance coverage, and financial planning.'
              },
              {
                title: 'Investment Decisions',
                description: 'Evaluate whether a property is a good investment opportunity with accurate market data and comparable sales.'
              },
            ].map((item, i) => (
              <div key={i}>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: 400,
                  marginBottom: '12px',
                  letterSpacing: '1px'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '14px',
                  lineHeight: 1.9,
                  color: '#666'
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '120px 5%', background: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            ...styles.sectionTitle,
            marginBottom: '60px'
          }}>What Sellers Say</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px'
          }}>
            {[
              {
                name: 'Lisa M.',
                text: 'Nicholas\'s valuation was spot-on. His market analysis gave us confidence in our asking price, and we received multiple offers within the first week.'
              },
              {
                name: 'Robert & Sarah K.',
                text: 'The detailed CMA helped us understand the local market. Nicholas explained everything clearly, and we felt prepared for the selling process.'
              },
              {
                name: 'James H.',
                text: 'I was amazed at the thoroughness of Nicholas\'s valuation. He identified unique features of our home that really helped with the sale.'
              },
            ].map((testimonial, i) => (
              <div key={i} style={{
                background: '#f8f8f8',
                padding: '32px',
                borderRadius: '4px'
              }}>
                <p style={{
                  fontSize: '18px',
                  fontStyle: 'italic',
                  lineHeight: 1.8,
                  color: '#333',
                  marginBottom: '24px'
                }}>
                  "{testimonial.text}"
                </p>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  color: '#1a1a1a'
                }}>
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
