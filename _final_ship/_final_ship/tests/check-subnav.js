const fs = require('fs')
const path = require('path')

const files = [
  'timeline.html',
  'cv.html',
  'myexperience.html',
  'about.html',
]

const expectedOrder = [
  { text: 'Timeline', href: '/timeline.html' },
  { text: 'Resume', href: '/cv.html' },
  { text: 'Experience', href: '/myexperience.html' },
  { text: 'About', href: '/about.html' },
]

function extractSubnav(html) {
  const navMatch = html.match(/<nav[^>]*class=\"sub-navigation\"[\s\S]*?<\/nav>/i)
  if (!navMatch) return null
  const nav = navMatch[0]
  const links = [...nav.matchAll(/<a[^>]*href=\"([^\"]+)\"[^>]*>([^<]+)<\/a>/g)].map(m => ({ href: m[1], text: m[2].trim(), active: /class=\"[^\"]*active[^\"]*\"/.test(m[0]) }))
  const ariaLabel = /aria-label=\"([^\"]+)\"/.exec(nav)?.[1]
  return { links, ariaLabel }
}

function assert(condition, message) {
  if (!condition) {
    console.error(message)
    process.exit(1)
  }
}

files.forEach(file => {
  const p = path.join(process.cwd(), file)
  const html = fs.readFileSync(p, 'utf8')
  const subnav = extractSubnav(html)
  assert(subnav, `${file}: sub-navigation not found`)
  assert(subnav.ariaLabel && subnav.ariaLabel.toLowerCase().includes('portfolio'), `${file}: aria-label missing or incorrect`)

  // Order and hrefs
  expectedOrder.forEach((exp, idx) => {
    const link = subnav.links[idx]
    assert(link, `${file}: missing link at position ${idx + 1}`)
    assert(link.text === exp.text, `${file}: expected '${exp.text}' at position ${idx + 1}, got '${link.text}'`)
    assert(link.href === exp.href, `${file}: expected href '${exp.href}' for '${exp.text}', got '${link.href}'`)
  })

  // Active state per file
  const expectedActive = file.includes('timeline') ? 'Timeline' : file.includes('cv') ? 'Resume' : file.includes('myexperience') ? 'Experience' : 'About'
  const activeLink = subnav.links.find(l => l.active)
  assert(activeLink, `${file}: active link not found`)
  assert(activeLink.text === expectedActive, `${file}: expected active '${expectedActive}', got '${activeLink.text}'`)
})

console.log('Sub-navigation checks passed for all pages')
