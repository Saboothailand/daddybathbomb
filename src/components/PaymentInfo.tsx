import { useState } from 'react'

interface PaymentInfoProps {
  paymentMethod: 'qr_pay' | 'bank_transfer' | 'line_chat'
  totalAmount: number
  orderId: string
}

export default function PaymentInfo({ paymentMethod, totalAmount, orderId }: PaymentInfoProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const qrPayInfo = {
    name: "Daddy Bath Bomb",
    phone: "+66 XX XXX XXXX",
    promptpay: "0XX-XXX-XXXX"
  }

  const bankInfo = {
    bankName: "Bangkok Bank",
    accountName: "Daddy Bath Bomb Co., Ltd.",
    accountNumber: "XXX-X-XXXXX-X",
    swiftCode: "BKKBTHBK"
  }

  const lineInfo = {
    lineId: "@daddybathbomb",
    qrCodeUrl: "https://qr-official.line.me/gs/M_123456789_GW.png", // 실제 라인 QR 코드 URL로 교체
    displayName: "Daddy Bath Bomb Official"
  }

  return (
    <div className="bg-white rounded-2xl p-6 max-w-md mx-auto shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">결제 안내</h2>
        <p className="text-gray-600">주문번호: #{orderId.slice(0, 8)}</p>
        <p className="text-2xl font-bold text-pink-600 mt-2">
          ฿{totalAmount.toLocaleString()}
        </p>
      </div>

      {paymentMethod === 'line_chat' ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
              <span className="text-2xl mr-2">💬</span>
              LINE 채팅으로 주문 완료하기
            </h3>
            
            {/* LINE QR Code */}
            <div className="text-center mb-4">
              <div className="bg-white p-4 rounded-lg inline-block shadow-sm border">
                <img
                  src={lineInfo.qrCodeUrl}
                  alt="LINE QR Code"
                  className="w-48 h-48 mx-auto"
                  onError={(e) => {
                    // QR 코드 로드 실패 시 대체 이미지 표시
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik05NiA2NEw5NiAxMjgiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHA+dGggZD0iTTY0IDk2TDEyOCA5NiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K'
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                QR 코드를 스캔하여 LINE으로 연결하세요
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-green-700 font-medium mb-1">LINE ID</label>
                <div className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="font-mono">{lineInfo.lineId}</span>
                  <button
                    onClick={() => copyToClipboard(lineInfo.lineId)}
                    className="text-green-600 hover:text-green-800 text-xs"
                  >
                    복사
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-green-700 font-medium mb-1">계정명</label>
                <div className="flex items-center justify-between bg-white p-2 rounded border">
                  <span>{lineInfo.displayName}</span>
                  <span className="text-green-600 text-xs">✓ 공식 계정</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
              <strong>주문 진행 방법:</strong><br />
              1. 위 QR 코드를 스캔하거나 LINE ID로 친구 추가<br />
              2. 주문번호 <strong>#{orderId.slice(0, 8)}</strong>와 함께 메시지 전송<br />
              3. 상담사가 결제 방법과 배송 정보를 안내해드립니다<br />
              4. 실시간으로 주문 상태를 확인할 수 있습니다
            </div>

            {/* 빠른 메시지 템플릿 */}
            <div className="mt-4">
              <label className="block text-green-700 font-medium mb-2">빠른 메시지 (복사해서 사용하세요)</label>
              <div className="bg-gray-50 p-3 rounded border text-sm">
                <p className="mb-2">안녕하세요! 주문 문의드립니다.</p>
                <p className="mb-2">주문번호: #{orderId.slice(0, 8)}</p>
                <p className="mb-2">총 금액: ฿{totalAmount.toLocaleString()}</p>
                <p>결제 방법과 배송 정보를 안내받고 싶습니다.</p>
                <button
                  onClick={() => copyToClipboard(`안녕하세요! 주문 문의드립니다.\n주문번호: #${orderId.slice(0, 8)}\n총 금액: ฿${totalAmount.toLocaleString()}\n결제 방법과 배송 정보를 안내받고 싶습니다.`)}
                  className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                >
                  메시지 복사
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : paymentMethod === 'qr_pay' ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <span className="text-2xl mr-2">📱</span>
              QR Pay 결제 안내
            </h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-blue-700 font-medium mb-1">수취인</label>
                <div className="flex items-center justify-between bg-white p-2 rounded border">
                  <span>{qrPayInfo.name}</span>
                  <button
                    onClick={() => copyToClipboard(qrPayInfo.name)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    복사
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-blue-700 font-medium mb-1">전화번호</label>
                <div className="flex items-center justify-between bg-white p-2 rounded border">
                  <span>{qrPayInfo.phone}</span>
                  <button
                    onClick={() => copyToClipboard(qrPayInfo.phone)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    복사
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-blue-700 font-medium mb-1">PromptPay</label>
                <div className="flex items-center justify-between bg-white p-2 rounded border">
                  <span>{qrPayInfo.promptpay}</span>
                  <button
                    onClick={() => copyToClipboard(qrPayInfo.promptpay)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    복사
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
              <strong>결제 방법:</strong><br />
              1. QR Pay 앱을 열어주세요<br />
              2. 위 정보로 송금하거나 QR 코드를 스캔해주세요<br />
              3. 정확한 금액을 입력해주세요<br />
              4. 결제 완료 후 스크린샷을 보내주세요
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
              <span className="text-2xl mr-2">🏦</span>
              은행 송금 안내
            </h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-green-700 font-medium mb-1">은행명</label>
                <div className="flex items-center justify-between bg-white p-2 rounded border">
                  <span>{bankInfo.bankName}</span>
                  <button
                    onClick={() => copyToClipboard(bankInfo.bankName)}
                    className="text-green-600 hover:text-green-800 text-xs"
                  >
                    복사
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-green-700 font-medium mb-1">예금주</label>
                <div className="flex items-center justify-between bg-white p-2 rounded border">
                  <span>{bankInfo.accountName}</span>
                  <button
                    onClick={() => copyToClipboard(bankInfo.accountName)}
                    className="text-green-600 hover:text-green-800 text-xs"
                  >
                    복사
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-green-700 font-medium mb-1">계좌번호</label>
                <div className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="font-mono">{bankInfo.accountNumber}</span>
                  <button
                    onClick={() => copyToClipboard(bankInfo.accountNumber)}
                    className="text-green-600 hover:text-green-800 text-xs"
                  >
                    복사
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-green-700 font-medium mb-1">SWIFT 코드</label>
                <div className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="font-mono">{bankInfo.swiftCode}</span>
                  <button
                    onClick={() => copyToClipboard(bankInfo.swiftCode)}
                    className="text-green-600 hover:text-green-800 text-xs"
                  >
                    복사
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
              <strong>송금 방법:</strong><br />
              1. 위 계좌로 정확한 금액을 송금해주세요<br />
              2. 송금인명에 주문번호를 포함해주세요<br />
              3. 송금 완료 후 영수증을 보내주세요<br />
              4. 확인 후 배송을 시작합니다
            </div>
          </div>
        </div>
      )}

      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          클립보드에 복사되었습니다!
        </div>
      )}

      <div className="mt-6 space-y-3">
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
          <h4 className="font-semibold text-pink-800 mb-2">📞 고객센터</h4>
          <p className="text-sm text-pink-700">
            결제 관련 문의: <br />
            이메일: support@daddybathbomb.com<br />
            전화: +66 XX XXX XXXX<br />
            운영시간: 월-금 09:00-18:00
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">⚠️ 주의사항</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 결제 완료 후 24시간 이내에 확인됩니다</li>
            <li>• 잘못된 금액 송금 시 환불 처리됩니다</li>
            <li>• 결제 증명서를 반드시 보관해주세요</li>
            <li>• 배송은 결제 확인 후 1-3일 내 시작됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
