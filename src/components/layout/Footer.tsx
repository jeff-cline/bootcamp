export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="font-black text-gray-900 text-sm tracking-tight">Beyond Limits Bootcamp</p>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Beyond Limits Bootcamp. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
