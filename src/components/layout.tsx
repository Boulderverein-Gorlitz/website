import React, { PropsWithChildren, ReactElement } from "react"
import { Link } from "gatsby"

export function Layout({ children }: PropsWithChildren): ReactElement {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
            <Link to="/news">News</Link>
            <Link to="/about">Über uns</Link>
            <Link to="/satzung">Satzung</Link>
            <Link to="/datenschutz">Datenschutz</Link>
          </li>
        </ul>
      </nav>
      <main>{children}</main>
    </div>
  )
}
