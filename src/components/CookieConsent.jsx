import { useEffect, useState } from 'react';
import { Cookie, Settings2, X } from 'lucide-react';

const KEY = 'shelby-cookie-preferences';
const readPreferences = () => {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
};

export default function CookieConsent() {
  const [preferences, setPreferences] = useState(readPreferences);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [showBanner, setShowBanner] = useState(!readPreferences());

  useEffect(() => {
    if (preferences) localStorage.setItem(KEY, JSON.stringify(preferences));
  }, [preferences]);

  const save = (next) => {
    const value = { necessary: true, analytics: !!next.analytics, marketing: !!next.marketing, updatedAt: new Date().toISOString() };
    setPreferences(value);
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;
  return <aside className="cookie-consent" role="dialog" aria-modal="false" aria-labelledby="cookie-title">
    <div className="cookie-copy"><span className="cookie-icon"><Cookie size={19}/></span><div><h2 id="cookie-title">A little choice about cookies.</h2><p>We use essential browser storage for your preferences and wishlist. No optional analytics or advertising scripts are active. <a href="/privacy.html">Read our privacy note</a>.</p></div></div>
    {showSettings && <div className="cookie-options">
      <label><span><strong>Essential</strong><small>Required for cart and site preferences. Always on.</small></span><input type="checkbox" checked disabled/></label>
      <label><span><strong>Analytics</strong><small>Helps us understand how the store is used.</small></span><input type="checkbox" checked={analytics} onChange={e=>setAnalytics(e.target.checked)}/></label>
      <label><span><strong>Marketing</strong><small>Allows relevant campaign measurement and advertising.</small></span><input type="checkbox" checked={marketing} onChange={e=>setMarketing(e.target.checked)}/></label>
    </div>}
    <div className="cookie-actions">
      {showSettings ? <><button className="cookie-secondary" onClick={()=>save({analytics:false,marketing:false})}>Reject optional</button><button className="cookie-primary" onClick={()=>save({analytics,marketing})}>Save choices</button></> : <><button className="cookie-secondary" onClick={()=>setShowSettings(true)}><Settings2 size={14}/> Settings</button><button className="cookie-secondary" onClick={()=>save({analytics:false,marketing:false})}>Reject optional</button><button className="cookie-primary" onClick={()=>save({analytics:true,marketing:true})}>Accept all</button></>}
      <button className="cookie-close" aria-label="Close cookie notice" onClick={()=>save({analytics:false,marketing:false})}><X size={16}/></button>
    </div>
  </aside>;
}
