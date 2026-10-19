import { Link } from 'react-router-dom';
import './Hero.css';

function scrollToNext(event) {
  const next =
    [...document.querySelectorAll('#main-content > *')].find((el) => {
      if (el.classList.contains('wnHero')) return false;
      const style = getComputedStyle(el);
      return style.display !== 'none' && el.getBoundingClientRect().height > 80;
    }) || document.getElementById('main-content');
  if (!next) return;

  event.preventDefault();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const chrome = document.querySelector('.wnChrome');
  const offset = chrome ? chrome.getBoundingClientRect().height : 0;
  const top = next.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
}

export default function Hero() {
  return (
    <section className="hcHero" aria-label="Hartmann Capital">
      <div className="hcHero__bg" aria-hidden="true" />
      <header className="hcNav">
        <Link to="/" className="hcNav__logo" aria-label="Hartmann Capital home">
          <svg className="hcNav__mark" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M3 21.5c5.2-1.4 8.4-5.2 13-5.2 4 0 6.4 2.3 13 1.3" />
            <path d="M3 15.2c5.2-1.4 8.4-5.2 13-5.2 4 0 6.4 2.3 13 1.3" />
            <path d="M3 8.9c5.2-1.4 8.4-5.2 13-5.2 4 0 6.4 2.3 13 1.3" />
          </svg>
        </Link>
        <p className="hcNav__wordmark">Hartmann Capital</p>
        <nav className="hcNav__links" aria-label="Primary">
          <Link to="/vapt-services">Offerings</Link>
          <Link to="/case-studies">Portfolio</Link>
          <Link to="/company">About</Link>
          <Link to="/blog">Insights</Link>
        </nav>
        <Link to="/contact-us" className="hcNav__contact">
          Contact
        </Link>
      </header>
      <div className="hcHero__content">
        <h1 className="hcHero__title">
          <span className="hcHero__line">The future belongs</span>
          <span className="hcHero__line">to those who</span>
          <span className="hcHero__line">invest in it</span>
        </h1>
        <p className="hcHero__sub">
          Hartmann Capital is the institutional gateway to early-stage frontier tech.
        </p>
        <a className="hcHero__more" href="#main-content" onClick={scrollToNext}>
          Discover more <span className="hcHero__arrow">↓</span>
        </a>
      </div>
    </section>
  );
}
