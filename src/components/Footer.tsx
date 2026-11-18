import DATA from '@/data/portfolio'

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <span>© {new Date().getFullYear()} {DATA.name}</span>
        <span>Designed and built by me.</span>
      </div>
    </footer>
  )
}
