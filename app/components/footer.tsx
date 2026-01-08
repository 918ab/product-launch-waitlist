export function Footer() {
  return (
    <footer className="w-full py-8 bg-[#0a0a0a] border-t border-white/10 text-gray-400 text-sm">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p className="font-medium text-gray-300">© 2025 배문환 영어 연구소.</p>
          <p className="text-xs mt-1 text-gray-500">All Rights Reserved.</p>
        </div>

        <div className="text-center md:text-right text-xs leading-relaxed">
          <p>
            <span className="font-semibold text-gray-300">사업자등록번호:</span> 866-54-00698
            <span className="mx-2 text-gray-700">|</span>
            <span className="font-semibold text-gray-300">대표:</span> 배문환
          </p>
          <p className="mt-1">
            인천광역시 서구 염곡로 498번 안길 1 
            <span className="mx-2 text-gray-700">|</span>
            Tel: 010-9950-3823
            <span className="mx-2 text-gray-700">|</span>
            Email: bae_moonhwan@naver.com
          </p>
        </div>
      </div>
    </footer>
  )
}