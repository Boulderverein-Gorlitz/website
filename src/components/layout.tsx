import React, { PropsWithChildren, ReactElement } from "react"
import { Link } from "gatsby"
import "../index.css"

export function Layout({ children, className }: PropsWithChildren & { className?: string }): ReactElement {
  return (
    <div className="page-root">
      <header>
        <Link to="/">
          <h1>Boulderverein Görlitz</h1>
        </Link>
        <nav className="page-nav">
          <ul>
            <li>
              <Link to="/news">News</Link>
            </li>
            <li>
              <Link to="/verein">Verein</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className={className}>{children}</main>
      <footer>
        <ul>
          <li>
            <Link to="/datenschutz">Datenschutz</Link>
          </li>
        </ul>
      </footer>
    </div>
  )
}
