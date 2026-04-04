import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing">
      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.3}px)`, opacity: 1 - scrollY / 700 }}>
          <div className="hero-badge">膳プランナー</div>
          <h1>Meal<span className="accent">Planner</span></h1>
          <div className="hero-line"></div>
          <p className="hero-subtitle">L'art de planifier vos repas</p>
          <p className="hero-description">
            Découvrez une nouvelle façon d'organiser vos repas. Créez, planifiez
            et générez votre liste de courses en quelques clics.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-glow">Commencer</Link>
            <Link to="/login" className="btn-ghost">Se connecter →</Link>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Découvrir</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="section-header">
          <span className="section-number">01</span>
          <h2>Fonctionnalités</h2>
          <div className="hero-line"></div>
        </div>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-number">一</div>
            <h3>Vos Recettes</h3>
            <p>Créez et organisez vos recettes. Importez depuis notre catalogue de milliers de plats du monde entier.</p>
          </div>
          <div className="feature-item">
            <div className="feature-number">二</div>
            <h3>Planificateur</h3>
            <p>Organisez vos 21 repas de la semaine sur une grille intuitive. Glissez, déposez, c'est planifié.</p>
          </div>
          <div className="feature-item">
            <div className="feature-number">三</div>
            <h3>Liste de Courses</h3>
            <p>Votre liste se génère automatiquement. Les ingrédients sont consolidés intelligemment.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="section-header">
          <span className="section-number">02</span>
          <h2>Comment ça marche</h2>
          <div className="hero-line"></div>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-circle">1</div>
            <div className="step-content">
              <h3>Choisissez vos recettes</h3>
              <p>Parcourez notre catalogue ou créez les vôtres</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-circle">2</div>
            <div className="step-content">
              <h3>Planifiez votre semaine</h3>
              <p>Assignez chaque recette à un jour et un repas</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-circle">3</div>
            <div className="step-content">
              <h3>Faites vos courses</h3>
              <p>Votre liste est prête, consolidée et optimisée</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Prêt à simplifier vos repas ?</h2>
          <div className="hero-line"></div>
          <p>Rejoignez MealPlanner gratuitement et découvrez une nouvelle façon de cuisiner.</p>
          <Link to="/register" className="btn-glow">Créer mon compte</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-content">
          <span className="footer-brand">膳 MealPlanner</span>
          <span className="footer-copy">© 2026 — Projet Génie Logiciel L3</span>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
