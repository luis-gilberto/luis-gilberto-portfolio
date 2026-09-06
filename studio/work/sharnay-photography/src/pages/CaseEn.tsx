import { assets } from "../content/assets";
import { copy } from "../content/en";

export function CaseEn() {
  return (
    <main id="studio-main" className="sh-case">
      <header className="sh-hero" id="open">
        <div className="sh-wrap sh-hero__grid">
          <div className="sh-hero__copy">
            <p className="sh-lbl">{copy.hero.eyebrow}</p>
            <h1 className="sh-h1">{copy.hero.headline}</h1>
            <p className="sh-lede">{copy.hero.standfirst}</p>
            {copy.hero.body.map((p) => (
              <p className="sh-body" key={p.slice(0, 24)}>
                {p}
              </p>
            ))}
          </div>
          <figure>
            <img
              src={assets.hero.src}
              alt={assets.hero.alt}
              width={1600}
              height={2000}
              decoding="async"
            />
            <figcaption className="sh-cap">{copy.hero.caption}</figcaption>
          </figure>
        </div>
      </header>

      <section className="sh-skim" id="skim" aria-labelledby="skim-title">
        <div className="sh-wrap">
          <p className="sh-lbl" id="skim-title">
            {copy.sixty.label}
          </p>
          <div className="sh-skim__rule" />
          <div className="sh-skim__grid">
            {copy.sixty.items.map((item) => (
              <article className="sh-skim__item" key={item.kicker}>
                <span className="sh-lbl">{item.kicker}</span>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sh-ch" id="practice" aria-labelledby="practice-title">
        <div className="sh-wrap">
          <div className="sh-ch__head">
            <span className="sh-lbl">{copy.practice.eyebrow}</span>
            <h2 className="sh-h2" id="practice-title">
              {copy.practice.headline}
            </h2>
            <p className="sh-lede">{copy.practice.standfirst}</p>
            <p className="sh-tagline">{copy.practice.tagline}</p>
            {copy.practice.body.map((p) => (
              <p className="sh-body" key={p.slice(0, 24)}>
                {p}
              </p>
            ))}
          </div>
          <div className="sh-triptych">
            <figure>
              <img
                src={assets.beauty.src}
                alt={assets.beauty.alt}
                width={900}
                height={1200}
                loading="lazy"
                style={{ objectPosition: assets.beauty.focal }}
              />
            </figure>
            <figure>
              <img
                src={assets.styling.src}
                alt={assets.styling.alt}
                width={900}
                height={1200}
                loading="lazy"
                style={{ objectPosition: assets.styling.focal }}
              />
            </figure>
            <figure>
              <img
                src={assets.goldenHour.src}
                alt={assets.goldenHour.alt}
                width={900}
                height={1200}
                loading="lazy"
                style={{ objectPosition: assets.goldenHour.focal }}
              />
              <figcaption className="sh-cap">{assets.goldenHour.caption}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="sh-ch sh-ch--ink" id="read" aria-labelledby="read-title" data-surface="ink">
        <div className="sh-wrap">
          <div className="sh-ch__head">
            <span className="sh-lbl">{copy.read.eyebrow}</span>
            <h2 className="sh-h2" id="read-title">
              {copy.read.headline}
            </h2>
            <p className="sh-lede">{copy.read.standfirst}</p>
            {copy.read.body.map((p) => (
              <p className="sh-body" key={p.slice(0, 24)}>
                {p}
              </p>
            ))}
          </div>
          <div className="sh-quote-grid">
            <figure>
              <img
                src={assets.erikaWorking.src}
                alt={assets.erikaWorking.alt}
                width={1100}
                height={1375}
                loading="lazy"
                style={{ objectPosition: assets.erikaWorking.focal }}
              />
              <figcaption className="sh-cap">{assets.erikaWorking.caption}</figcaption>
            </figure>
            <div className="sh-quote">
              <blockquote>
                <p lang="es">“{copy.read.quoteEs}”</p>
                <cite>{copy.read.cite}</cite>
              </blockquote>
              <p className="sh-quote-en">{copy.read.quoteEn}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sh-ch" id="direction" aria-labelledby="direction-title">
        <div className="sh-wrap">
          <div className="sh-ch__head">
            <span className="sh-lbl">{copy.direction.eyebrow}</span>
            <h2 className="sh-h2" id="direction-title">
              {copy.direction.headline}
            </h2>
            <p className="sh-lede">{copy.direction.standfirst}</p>
            <p className="sh-body">{copy.direction.lead}</p>
          </div>

          <div className="sh-decisions">
            {copy.direction.decisions.map((d) => (
              <article className="sh-decision" key={d.title}>
                <span className="sh-lbl">{d.status}</span>
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </article>
            ))}
          </div>
          <p className="sh-body">{copy.direction.still}</p>
          <p className="sh-body">{copy.direction.experience}</p>
          <ol className="sh-journey" aria-label="Client journey">
            {copy.direction.journey.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="sh-body">{copy.direction.know}</p>
          <p className="sh-body">{copy.direction.protect}</p>
        </div>
      </section>

      <section className="sh-ch" id="language" aria-labelledby="language-title">
        <div className="sh-wrap">
          <div className="sh-ch__head">
            <span className="sh-lbl">{copy.language.eyebrow}</span>
            <h2 className="sh-h2" id="language-title">
              {copy.language.headline}
            </h2>
            <p className="sh-lede">{copy.language.standfirst}</p>
            {copy.language.body.map((p) => (
              <p className="sh-body" key={p.slice(0, 24)}>
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="sh-words" aria-label="Craft vocabulary">
          <div className="sh-wrap">
            <ol className="sh-words__index">
              {copy.language.words.map((w) => (
                <li key={w.word}>
                  <span className="sh-words__term">{w.word}</span>
                  <span className="sh-words__line">{w.line}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="sh-specimen sh-specimen--ink" data-surface="ink">
          <div className="sh-wrap sh-specimen__marks">
            <figure className="sh-specimen__mark">
              <img src={assets.mark.src} alt={assets.mark.alt} width={640} height={200} loading="lazy" />
            </figure>
            <figure className="sh-specimen__logo">
              <img src={assets.logotype.src} alt={assets.logotype.alt} width={480} height={80} loading="lazy" />
              <figcaption className="sh-cap">{copy.language.apertureCaption}</figcaption>
            </figure>
          </div>
        </div>

        <div className="sh-wrap">
          <figure className="sh-plate">
            <img
              src={assets.application.src}
              alt={assets.application.alt}
              width={1600}
              height={1000}
              loading="lazy"
            />
            <figcaption className="sh-cap">{copy.language.applicationCaption}</figcaption>
          </figure>
          <p className="sh-system-link">
            <a href={copy.language.systemHref} target="_blank" rel="noopener noreferrer">
              {copy.language.systemLink}
            </a>
          </p>
        </div>
      </section>

      <section className="sh-ch" id="album" aria-labelledby="album-title">
        <div className="sh-wrap">
          <div className="sh-ch__head">
            <span className="sh-lbl">{copy.album.eyebrow}</span>
            <h2 className="sh-h2" id="album-title">
              {copy.album.headline}
            </h2>
            <p className="sh-lede">{copy.album.standfirst}</p>
            {copy.album.body.map((p) => (
              <p className="sh-body" key={p.slice(0, 24)}>
                {p}
              </p>
            ))}
          </div>
        </div>
        <figure className="sh-bleed">
          <img
            src={assets.albumHero.src}
            alt={assets.albumHero.alt}
            width={2000}
            height={1200}
            loading="lazy"
          />
          <figcaption className="sh-cap sh-wrap">{copy.album.heroCaption}</figcaption>
        </figure>
        <div className="sh-wrap sh-album-pair">
          <figure>
            <img
              src={assets.albumEncuadre.src}
              alt={assets.albumEncuadre.alt}
              width={1400}
              height={900}
              loading="lazy"
            />
            <figcaption className="sh-cap">{copy.album.specCaption}</figcaption>
          </figure>
          <figure>
            <img
              src={assets.albumMobile.src}
              alt={assets.albumMobile.alt}
              width={900}
              height={1400}
              loading="lazy"
            />
            <figcaption className="sh-cap">{copy.album.mobileCaption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="sh-ch" id="folio" aria-labelledby="folio-title">
        <div className="sh-wrap">
          <div className="sh-ch__head">
            <span className="sh-lbl">{copy.folio.eyebrow}</span>
            <h2 className="sh-h2" id="folio-title">
              {copy.folio.headline}
            </h2>
            <p className="sh-lede">{copy.folio.standfirst}</p>
            {copy.folio.intro.map((p) => (
              <p className="sh-body" key={p.slice(0, 24)}>
                {p}
              </p>
            ))}
          </div>

          <ol className="sh-proof" aria-label="Folio proof sequence">
            {copy.folio.steps.map((step) => (
              <li className="sh-proof__item" key={step.title} data-status={step.status}>
                <span className="sh-lbl">{step.status}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                {"measure" in step && step.measure ? <p className="sh-measure">{step.measure}</p> : null}
              </li>
            ))}
          </ol>
          <p className="sh-cap">{copy.folio.proofCaption}</p>
        </div>
        <figure className="sh-bleed">
          <img
            src={assets.compositeDesktop.src}
            alt={assets.compositeDesktop.alt}
            width={1448}
            height={1086}
            loading="lazy"
          />
          <figcaption className="sh-cap sh-wrap">{copy.folio.compositeCaption}</figcaption>
        </figure>
      </section>

      <section className="sh-ch sh-ch--now" id="now" aria-labelledby="now-title">
        <div className="sh-wrap">
          <div className="sh-ch__head">
            <span className="sh-lbl">{copy.now.eyebrow}</span>
            <h2 className="sh-h2" id="now-title">
              {copy.now.headline}
            </h2>
            <p className="sh-lede">{copy.now.standfirst}</p>
          </div>
          <div className="sh-status">
            {copy.now.groups.map((g) => (
              <section className="sh-status__group" key={g.status} aria-labelledby={`now-${g.status}`}>
                <h3 className="sh-lbl" id={`now-${g.status}`}>
                  {g.status}
                </h3>
                <ul>
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <p className="sh-body">{copy.now.direction}</p>
          <p className="sh-close-line">{copy.now.close}</p>
          <p className="sh-cap">{copy.now.caption}</p>
        </div>
      </section>

      <section className="sh-close-cta" aria-labelledby="close-cta-title">
        <div className="sh-wrap">
          <p className="sh-lbl">{copy.closeCta.eyebrow}</p>
          <h2 className="sh-h2" id="close-cta-title">
            {copy.closeCta.title}
          </h2>
          <p className="sh-lede">{copy.closeCta.body}</p>
          <p>
            <a
              className="sh-close-cta__btn"
              href={copy.closeCta.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.closeCta.action}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
