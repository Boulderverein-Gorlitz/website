import React, { PropsWithChildren, ReactElement } from "react"
import { Link } from "gatsby"
import "../index.css"

function MainNavigation() {
  return (
    <nav className="page-nav">
      <ul>
        <li>
          <Link activeClassName="active" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link activeClassName="active" to="/news">
            Neuigkeiten
          </Link>
        </li>
        <li>
          <Link activeClassName="active" to="/verein">
            Verein
          </Link>
        </li>
        <li>
          <Link activeClassName="active" to="/mitmachen">
            Mitmachen
          </Link>
        </li>
        <li>
          <Link activeClassName="active" to="/bouldern">
            Was ist Bouldern?
          </Link>
        </li>
        <li>
          <Link activeClassName="active" to="/kontakt">
            Kontakt
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export function Layout({ children, className }: PropsWithChildren & { className?: string }): ReactElement {
  return (
    <div className="page-root">
      <header>
        <div id="page-title">
          <Link to="/">
            <h1>
              Boulderverein
              <br />
              Görlitz
            </h1>
          </Link>
        </div>
        <MainNavigation />
      </header>
      <main className={className}>{children}</main>
      <footer>
        <ul>
          <li>
            <Link to="/datenschutz">Datenschutz</Link>
          </li>
          <li>
            <Link to="/impressum">Impressum</Link>
          </li>
        </ul>
      </footer>
    </div>
  )
}
