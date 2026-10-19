export default function SiteFonts() {
  return (
    <style>{`
      :root {
        --font-family-body: "Archivo", sans-serif;
        --font-family-heading: "Archivo", sans-serif;
      }

      body,
      button,
      input,
      textarea,
      select {
        font-family: "Archivo", sans-serif;
      }

      .companyCaseStudies__header {
        grid-column: main-start / main-end;
        padding-right: 0;
      }

      .companyCaseStudies__viewAll {
        flex-shrink: 0;
        align-self: flex-start;
      }

      @media screen and (min-width: 616px) {
        .companyCaseStudies__header {
          align-items: center;
        }
      }

      .companyCaseStudies__introText {
        grid-column: main-start / main-end;
        margin-top: calc(-1 * var(--spacer-xs, 0.5rem));
        padding-bottom: var(--spacer-md);
      }
    `}</style>
  );
}
