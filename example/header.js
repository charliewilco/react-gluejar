import React from 'react'

const linkStyle = {
  color: '#147aab',
  textDecoration: 'none'
}

export default () => (
  <header
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24
    }}>
    <h1 style={{ fontWeight: 300, fontSize: 18 }}>Gluejar</h1>
    <nav style={{ opacity: 0.75 }}>
      <a style={linkStyle} href="https://github.com/charliewilco/react-gluejar">
        Source
      </a>
    </nav>
  </header>
)
